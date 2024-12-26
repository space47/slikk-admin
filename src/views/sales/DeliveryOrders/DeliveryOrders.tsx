/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Table, Pagination, Select, Dropdown } from '@/components/ui'
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
import { RiEBike2Fill } from 'react-icons/ri'
import { CiFilter } from 'react-icons/ci'
import FilterForwardDelivery from './filter/FilterForwardDelivery'
import { MdAssignmentTurnedIn, MdCancel } from 'react-icons/md'
import { FaFilter } from 'react-icons/fa'
import UltimateDatePicker from '@/common/UltimateDateFilter'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const LOGISTIC_PARTNER = [
    { value: 'porter', label: 'PORTER' },
    { value: 'shiprocket', label: 'SHIPROCKET' },
    { value: 'shadowfax', label: 'SHADOWFAX' },
    { value: 'slikk', label: 'SLIKK' },
    { value: 'pidge', label: 'PIDGE' },
]

const SEARCHOPTIONS = [
    { label: 'INVOICE', value: 'invoice' },
    { label: 'MOBILE', value: 'mobile' },
    { label: 'AWB', value: 'awb' },
]

export const DELIVERY_OPTIONS = [
    { label: 'EXPRESS', value: 'EXPRESS' },
    { label: 'STANDARD', value: 'STANDARD' },
    { label: 'TRY_AND_BUY', value: 'TRY_AND_BUY' },
]

const DeliveryOrders = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { orders, orderCount, page, pageSize, searchInput, deliveryType, from, currentSelectedPage, to, dropdownStatus, paymentType } =
        useAppSelector<OrderState>((state) => state.order)

    useEffect(() => {
        dispatch(fetchOrders())
    }, [dispatch, page, pageSize, from, to, dropdownStatus, searchInput, deliveryType, paymentType])

    const [showFilter, setShowFilter] = useState(false)

    const [partner, setPartner] = useState<{
        [key: string]: { value: string; label: string }
    }>({})

    const [deliveryChangeType, setDeliveryChangeType] = useState<{
        [key: string]: { value: string; label: string }
    }>({})

    const columns = [
        {
            header: 'Order Invoice Id',
            accessorKey: 'invoice_id',
            cell: ({ row }: any) => {
                const referenceId = row.original?.invoice_id

                return referenceId ? (
                    <div
                        className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                        onClick={() => handleInvoiceClick(referenceId)}
                    >
                        {referenceId}
                    </div>
                ) : (
                    ''
                )
            },
        },
        { header: 'Mobile Number', accessorKey: 'user.mobile' },
        {
            header: 'Tracking Url',
            accessorKey: 'logistic.tracking_url',
            cell: ({ getValue, row }: any) => {
                const { partner } = row.original?.logistic || {}
                const { awb_code } = row.original || {}
                const { delivery_type } = row.original || {}

                console.log('SSSDSDSDD', delivery_type)

                let trackingUrl

                if ((partner === 'Shadowfax' || partner === 'shadowfax') && delivery_type === 'STANDARD') {
                    trackingUrl = `https://tracker.shadowfax.in/#/awb/${awb_code}`
                } else if ((partner === 'Shiprocket' || partner === 'shiprocket') && delivery_type === 'EXPRESS') {
                    trackingUrl = `https://shiprocket.co/tracking/${awb_code}`
                } else {
                    trackingUrl = getValue()
                }

                return (
                    <a href={trackingUrl} target="_blank" rel="noreferrer">
                        <div className="flex justify-center">
                            <RiEBike2Fill className="text-xl" />
                        </div>
                    </a>
                )
            },
        },
        { header: 'Device Type', accessorKey: 'device_type' },

        {
            header: 'Delivery Type',
            accessorKey: 'delivery_type',
            cell: ({ row }: any) => {
                const Rowid = row?.original.invoice_id
                const selectedDeliveryType = deliveryChangeType[Rowid]?.label || row.original?.delivery_type || 'SELECT'

                return (
                    <Dropdown
                        className="w-full px-4 py-2 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                        title={selectedDeliveryType}
                        onSelect={(value) => handleDeliveryChange(value, Rowid)}
                    >
                        <div className="max-h-60 overflow-y-auto">
                            {DELIVERY_OPTIONS.map((item, key) => (
                                <DropdownItem
                                    key={key}
                                    eventKey={item.value}
                                    className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                >
                                    <span>{item.label}</span>
                                </DropdownItem>
                            ))}
                        </div>
                    </Dropdown>
                )
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue, row }) => {
                const statuses = row?.original?.status
                return (
                    <div>
                        {statuses === 'PENDING' ? (
                            <span className="text-red-700 font-semibold bg-red-200 p-2 rounded-md">{statuses}</span>
                        ) : statuses === 'COMPLETED' ? (
                            <span className="font-semibold text-green-700 bg-green-200 p-2 rounded-lg">{statuses}</span>
                        ) : (
                            <span className="text-yellow-700 bg-yellow-200 p-2 rounded-lg font-semibold">{statuses}</span>
                        )}
                    </div>
                )
            },
        },
        { header: 'Runner Name', accessorKey: 'logistic.runner_name' },
        {
            header: 'Runner Number',
            accessorKey: 'logistic.runner_phone_number',
        },
        {
            header: 'Payment Mode',
            accessorKey: 'payment.mode',
        },

        {
            header: 'Pickup Time',
            accessorKey: 'log',
            cell: ({ row }: any) => {
                const deliveryCreatedLog = row.original.log.find(
                    (logEntry: any) => logEntry.status === 'SHIPPED' || logEntry.status === 'OUT_FOR_DELIVERY',
                )

                return deliveryCreatedLog ? <div>{moment(deliveryCreatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')}</div> : null
            },
        },

        {
            header: 'Drop Time',
            accessorKey: 'log',
            cell: ({ row }: any) => {
                const deliveryCreatedLog = row.original.log.find(
                    (logEntry: any) => logEntry.status === 'DELIVERED' || logEntry.status === 'COMPLETED',
                )

                return deliveryCreatedLog ? <div>{moment(deliveryCreatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')}</div> : null
            },
        },
        { header: 'AWB Code', accessorKey: 'logistic.awb_code' },
        {
            header: 'Partner',
            accessorKey: 'logistic.partner',
            cell: ({ row }: any) => {
                const selectedPartner = partner[row.id]?.label || row.original?.logistic?.partner

                return (
                    <Dropdown
                        className="w-full px-4 py-2 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                        title={selectedPartner || 'SELECT'}
                        onSelect={(value) => handlePartnerSelect(value, row)}
                    >
                        <div className="max-h-60 overflow-y-auto">
                            {LOGISTIC_PARTNER.map((item, key) => (
                                <DropdownItem
                                    key={key}
                                    eventKey={item.value}
                                    className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                >
                                    <span>{item.label}</span>
                                </DropdownItem>
                            ))}
                        </div>
                    </Dropdown>
                )
            },
        },
        {
            header: 'CREATE TASk',
            accessorKey: 'logistic.partner',
            cell: ({ row, getValue }: any) => (
                <button onClick={() => handleCreateTask(partner[row.id], getValue(), row.original.invoice_id)}>
                    <MdAssignmentTurnedIn className="border-none bg-none text-2xl flex justify-center items-center text-green-600" />
                </button>
            ),
        },
        {
            header: 'Cancel Task',
            accessorKey: 'id',
            cell: ({ row }: any) => (
                <button onClick={() => handleCancelTask(row.original.invoice_id)}>
                    <MdCancel className="border-none bg-none text-2xl flex justify-center items-center text-red-600" />
                </button>
            ),
        },
    ]

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

    const handleCancelTask = async (invoce_id: any) => {
        console.log('Id', invoce_id)

        try {
            await axioisInstance.patch(`logistic/cancel/order/${invoce_id}`)
            notification.success({
                message: 'success',
                description: 'Order successfully cancelled',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to cancel order',
            })
        }
    }

    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            dispatch(setCurrentSelectedPage(selected))
        }
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchInput(e.target.value))
    }

    const handleInvoiceClick = (invoiceId: string) => {
        navigate(`/app/orders/${invoiceId}`)
    }

    const onPaginationChange = (page: number) => {
        dispatch(setPage(page))
    }

    const handleFromChange = (date: Date | null) => {
        dispatch(setFrom(date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')))
    }

    const handleToChange = (date: Date | null) => {
        dispatch(setTo(date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')))
    }

    const handlePartnerSelect = (selectedValue: any, row: any) => {
        console.log('VALUE', selectedValue, row)
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''

        setPartner((prev) => ({
            ...prev,
            [row.id]: { value: selectedValue, label: selectedLabel },
        }))
    }

    const handleDeliveryChange = (selectedValue: any, row: any) => {
        console.log('DELIVERY VALUE', selectedValue, row)
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
            notification.success({
                message: response.data.message || 'DELIVERY TYPE UPDATED',
            })
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
                action: 'PACKED',
                delivery_partner: partner?.value ? partner?.value : logistic_partner,
            }
            const response = await axioisInstance.patch(`/merchant/order/${order_id}`, body)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Created Task Successfully',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to create Task',
            })
        }
    }

    const handleShowFilter = useCallback(() => {
        setShowFilter(true)
    }, [setShowFilter])

    const handleFilterClose = useCallback(() => {
        setShowFilter(false)
    }, [setShowFilter])

    console.log(`from`, from, 'and', 'to', to)

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 items-center gap-4 md:flex-col">
                <div className="flex gap-2">
                    <div className="flex justify-start ">
                        <input
                            type="search"
                            name="search"
                            id=""
                            placeholder="search here"
                            value={searchInput}
                            className="xl:w-[250px] rounded-[10px] w-[130px] dark:bg-gray-900"
                            onChange={handleSearch}
                        />
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

                <div className="flex gap-3 items-center">
                    <div>
                        <UltimateDatePicker
                            from={from}
                            setFrom={setFrom}
                            to={to}
                            setTo={setTo}
                            handleFromChange={handleFromChange}
                            handleToChange={handleToChange}
                            handleDateChange={handleDateChange}
                            dispatch={dispatch}
                        />
                    </div>

                    <div className="mt-7">
                        <Button variant="new" size="sm" onClick={handleShowFilter} className="hidden xl:flex gap-2">
                            <CiFilter className="text-xl font-extrabold" /> FILTER
                        </Button>

                        <Button variant="default" size="sm" onClick={handleShowFilter} className="flex xl:hidden">
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
                <Pagination pageSize={pageSize} currentPage={page} total={orderCount} onChange={onPaginationChange} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => dispatch(setPageSize(option?.value))}
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
            {showFilter && (
                <FilterForwardDelivery
                    showFilter={showFilter}
                    handleFilterClose={handleFilterClose}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={handleDropdownSelect}
                    handleFromChange={handleFromChange}
                    handleToChange={handleToChange}
                    from={from}
                    to={to}
                    deliveryType={deliveryType}
                    handleDeliverySelect={handleDeliverySelect}
                    paymentType={paymentType}
                    handlePaymentSelect={handlePaymentSelect}
                    handleDateChange={handleDateChange}
                    setFrom={setFrom}
                    setTo={setTo}
                    dispatch={dispatch}
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
