/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import moment from 'moment'
import Button from '@/components/ui/Button'
import { Table, Pagination, Select, Dropdown, Input } from '@/components/ui'
import {
    fetchOrders,
    setDropdownStatus,
    setCurrentSelectedPage,
    setSearchInput,
    setPageSize,
    setPage,
    setFrom,
    setTo,
    setDeliveryType,
    setPaymentType,
} from '@/store/slices/orderList/OrderList'
import { OrderState } from '@/store/types/orderList.types'
import type { FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useAppDispatch, useAppSelector } from '@/store'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { CiFilter } from 'react-icons/ci'
import FilterForwardDelivery from './filter/FilterForwardDelivery'
import { FaFilter } from 'react-icons/fa'
import { DELIVERY_OPTIONS, LOGISTIC_PARTNER, SEARCHOPTIONS } from './DeliveryCommon'
import { pageSizeOptions } from '../groupNotification/getGroup/groupComnmon'
import { ForwardDeliveryColumns } from './forwardDeliveryUtils/ForwardDeliveryColumns'
import { HiSearch } from 'react-icons/hi'
import ReduxDateRange from '@/common/ReduxDateRange'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const DeliveryOrders = () => {
    const dispatch = useAppDispatch()
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const { orders, orderCount, page, pageSize, searchInput, deliveryType, from, currentSelectedPage, to, dropdownStatus, paymentType } =
        useAppSelector<OrderState>((state) => state.order)

    useEffect(() => {
        dispatch(fetchOrders())

        const noFilters =
            page === 1 && !dropdownStatus.value.length && !searchInput && !deliveryType.value.length && !paymentType.value.length

        if (noFilters) {
            const interval = setInterval(() => {
                dispatch(fetchOrders())
            }, 30000)

            return () => clearInterval(interval)
        }
    }, [page, pageSize, from, to, dropdownStatus, searchOnEnter, deliveryType, paymentType])

    const [showFilter, setShowFilter] = useState(false)
    const [partner, setPartner] = useState<{ [key: string]: { value: string; label: string } }>({})
    const [deliveryChangeType, setDeliveryChangeType] = useState<{ [key: string]: { value: string; label: string } }>({})

    const handleCancelTask = async (invoce_id: any) => {
        try {
            await axioisInstance.patch(`logistic/cancel/order/${invoce_id}`)
            notification.success({ message: 'success !! Order successfully cancelled' })
        } catch (error) {
            console.log(error)
            notification.error({ message: 'Failed to cancel order' })
        }
    }

    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            dispatch(setCurrentSelectedPage(selected))
        }
    }

    const handlePartnerSelect = (selectedValue: any, row: any) => {
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''
        setPartner((prev) => ({
            ...prev,
            [row.id]: { value: selectedValue, label: selectedLabel },
        }))
    }

    const handleDeliveryChange = (selectedValue: any, row: any) => {
        const selectedLabel = DELIVERY_OPTIONS.find((item) => item.value === selectedValue)?.label || ''
        setDeliveryChangeType((prev) => ({
            ...prev,
            [row]: { value: selectedValue, label: selectedLabel },
        }))
        deliveryChangeAPI(selectedValue, row)
    }
    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            const toDate = dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            dispatch(setTo(toDate))
        }
    }

    const deliveryChangeAPI = async (selectedValue: string, id: any) => {
        try {
            const body = {
                action: 'CHANGE_DELIVERY_TYPE',
                delivery_type: selectedValue,
            }
            const response = await axioisInstance.patch(`/merchant/order/${id}`, body)
            notification.success({ message: response.data.message || 'DELIVERY TYPE UPDATED' })
        } catch (error) {
            console.log(error)
        }
    }

    const handleDropdownSelect = (selectedValue: string) => {
        const currentValue = dropdownStatus?.value ? dropdownStatus.value : []
        const updatedValue = currentValue.includes(selectedValue)
            ? currentValue.filter((item) => item !== selectedValue)
            : [...currentValue, selectedValue]

        dispatch(setDropdownStatus({ ...dropdownStatus, value: updatedValue }))
    }

    const handleDeliverySelect = (selectedValue: string) => {
        const currentValues = deliveryType?.value ?? []
        const updatedValues = currentValues.includes(selectedValue)
            ? currentValues.filter((item) => item !== selectedValue)
            : [...currentValues, selectedValue]
        dispatch(setDeliveryType({ ...deliveryType, value: updatedValues }))
    }

    const handlePaymentSelect = (selectedValue: string) => {
        const currentValues = paymentType?.value ?? []
        const updatedValues = currentValues.includes(selectedValue)
            ? currentValues.filter((item) => item !== selectedValue)
            : [...currentValues, selectedValue]
        dispatch(setPaymentType({ ...paymentType, value: updatedValues }))
    }
    const handleCreateTask = async (partner: any, logistic_partner: any, order_id: any) => {
        try {
            const body = {
                action: 'CREATE_DELIVERY',
                delivery_partner: partner?.value ? partner?.value : logistic_partner,
            }
            const response = await axioisInstance.patch(`/merchant/order/${order_id}`, body)
            notification.success({ message: response?.data?.message || 'Created Task Successfully' })
        } catch (error) {
            console.error(error)
            notification.error({ message: 'Failed to create Task' })
        }
    }

    const columns = ForwardDeliveryColumns(
        handleCreateTask,
        handleCancelTask,
        partner,
        deliveryChangeType,
        handleDeliveryChange,
        handlePartnerSelect,
    )

    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(orderCount / pageSize),
        globalFilterFn: fuzzyFilter,
    })

    const handleSearchWithIcon = () => {
        setSearchOnEnter(searchInput)
    }

    return (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
            <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 items-center gap-4 md:flex-col">
                <div className="flex gap-2">
                    <div className="flex  xl:gap-2  flex-row   gap-3  ">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search here..."
                                value={searchInput}
                                className="w-[150px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                                onChange={(e) => dispatch(setSearchInput(e.target.value))}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        setSearchOnEnter(e.target.value)
                                    }
                                }}
                            />
                            <div className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer">
                                <HiSearch className="text-white  dark:text-gray-400 text-xl" onClick={() => handleSearchWithIcon()} />
                            </div>
                            <div>
                                <div className="bg-gray-100 dark:bg-blue-600 dark:text-white xl:mt-1  xl:text-md text-sm w-auto rounded-md ">
                                    <Dropdown
                                        className=" text-xl text-black bg-gray-200 font-bold "
                                        title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                        onSelect={handleSelect}
                                    >
                                        {SEARCHOPTIONS?.map((item, key) => {
                                            return (
                                                <DropdownItem key={key} eventKey={item.value}>
                                                    <span>{item.label}</span>
                                                </DropdownItem>
                                            )
                                        })}
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    <div>
                        <ReduxDateRange handleDateChange={handleDateChange} id="delivery_orders" setFrom={setFrom} setTo={setTo} />
                    </div>

                    <div className="mt-7">
                        <Button variant="new" size="sm" onClick={() => setShowFilter(true)} className="hidden xl:flex gap-2">
                            <CiFilter className="text-xl font-extrabold" /> FILTER
                        </Button>

                        <Button variant="default" size="sm" onClick={() => setShowFilter(true)} className="flex xl:hidden">
                            <FaFilter className="text-xl font-extrabold" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="border p-2 border-gray-200 rounded-lg">
                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <Sorter sort={header.column.getIsSorted()} />
                                            </div>
                                        )}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={orderCount} onChange={(page) => dispatch(setPage(page))} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        className="w-full flex justify-end"
                        onChange={(option) => {
                            if (option) {
                                dispatch(setPageSize(option.value))
                                dispatch(setPage(1))
                            }
                        }}
                    />
                </div>
            </div>
            {showFilter && (
                <FilterForwardDelivery
                    showFilter={showFilter}
                    handleFilterClose={() => setShowFilter(false)}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={handleDropdownSelect}
                    deliveryType={deliveryType}
                    handleDeliverySelect={handleDeliverySelect}
                    paymentType={paymentType}
                    handlePaymentSelect={handlePaymentSelect}
                />
            )}
        </div>
    )
}

export default DeliveryOrders

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
