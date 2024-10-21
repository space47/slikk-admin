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
import { Table, Pagination, Select, DatePicker, Dropdown } from '@/components/ui'
import type { FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { RiEBike2Fill } from 'react-icons/ri'
import { DELEIVERYRETRUNOPTIONS, ReturnOrder } from '../returnOrders/ReturnOrders'
import FilterReturnOrder from '../returnOrders/filter/FilterReturnOrder'
import { CiFilter } from 'react-icons/ci'
import { MdAssignmentTurnedIn, MdCancel } from 'react-icons/md'
import { FaFilter } from 'react-icons/fa'
import UltimateDatePicker from '@/common/UltimateDateFilter'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface ReturnDropdownStatus {
    value: string[]
    name: string[]
}

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const LOGISTIC_PARTNER = [
    { value: 'shiprocket', label: 'SHIPROCKET' },
    { value: 'shadowfax', label: 'SHADOWFAX' },
    { value: 'slikk', label: 'SLIKK' },
    { value: 'pidge', label: 'PIDGE' },
]
const SEARCHOPTIONS = [
    { label: 'RETURN ID', value: 'return_order_id' },
    { label: 'INVOICE', value: 'invoice_id' },
    { label: 'AWB', value: 'awb' },
]

const ReverseDelivery = () => {
    const [orders, setOrders] = useState<ReturnOrder[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [deliveryType, setDeliveryType] = useState<ReturnDropdownStatus>({
        value: [],
        name: [],
    })
    const [searchInput, setSearchInput] = useState<string>('')
    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState()
    const [dropdownStatus, setDropdownStatus] = useState<ReturnDropdownStatus>({
        value: [],
        name: [],
    })

    const [showFilter, setShowFilter] = useState(false)

    const fetchOrders = async (page: number, pageSize: number, from: string, to: string) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`

            let response

            let deliveryStatus = ''

            if (deliveryType?.value && deliveryType?.value.length > 0) {
                deliveryStatus = `&return_type=${deliveryType?.value}`
            }

            if (currentSelectedPage.value === 'return_order_id' && searchInput) {
                response = await axioisInstance.get(
                    `/merchant/return_orders?return_order_id=${searchInput.toUpperCase()}${status}${deliveryStatus}`,
                )
            } else if (currentSelectedPage.value === 'invoice_id' && searchInput) {
                response = await axioisInstance.get(
                    `/merchant/return_orders?invoice_id=${searchInput.toUpperCase()}${status}${deliveryStatus}`,
                )
            } else if (currentSelectedPage.value === 'awb' && searchInput) {
                response = await axioisInstance.get(`/merchant/return_orders?awb=${searchInput.toUpperCase()}${status}${deliveryStatus}`)
            } else {
                response = await axioisInstance.get(
                    `/merchant/return_orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${status}${deliveryStatus}`,
                )
            }

            const ordersData = response?.data?.data.results
            const orderCount = response?.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrders(page, pageSize, from, to)
    }, [page, pageSize, from, to, dropdownStatus, searchInput, deliveryType])

    const [partner, setPartner] = useState<{
        [key: string]: { value: string; label: string }
    }>({})
    console.log('PARTNER', partner)

    const columns = [
        {
            header: 'Return Order Id',
            accessorKey: 'return_order_id',
            cell: ({ row }: { row: { original: ReturnOrder } }) => {
                const referenceId = row.original.return_order_id

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
            accessorKey: 'return_order_delivery[0].tracking_url', // Adjust if you need to access tracking_url from an array
            cell: ({ getValue }: { getValue: () => string }) => {
                const url = getValue()
                return url ? (
                    <a href={url} target="_blank" rel="noreferrer">
                        <div className="flex justify-center">
                            <RiEBike2Fill className="text-xl" />
                        </div>
                    </a>
                ) : null
            },
        },
        { header: 'Return Type', accessorKey: 'return_type' },
        { header: 'STATUS', accessorKey: 'status' },
        {
            header: 'Runner Name',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => <span>{row.original.return_order_delivery[0]?.runner_name || ''}</span>,
        },
        {
            header: 'Runner Number',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => (
                <span>{row.original.return_order_delivery[0]?.runner_phone_number || ''}</span>
            ),
        },
        {
            header: 'Pickup Time',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => {
                const deliveryCreatedLog = row.original.return_order_delivery[0]?.log?.find(
                    (logEntry: any) => logEntry.status === 'DELIVERY_CREATED',
                )

                return deliveryCreatedLog ? <div>{moment(deliveryCreatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')}</div> : null
            },
        },
        {
            header: 'Drop Time',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => {
                const deliveryCreatedLog = row.original.return_order_delivery[0]?.log?.find(
                    (logEntry: any) => logEntry.status === 'DELIVERED',
                )

                return deliveryCreatedLog ? <div>{moment(deliveryCreatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')}</div> : null
            },
        },
        {
            header: 'AWB Code',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => <span>{row.original.return_order_delivery[0]?.awb_code || ''}</span>,
        },
        {
            header: 'Partner',
            accessorKey: 'return_order_delivery[0].partner',
            cell: ({ row }: { row: { original: ReturnOrder } }) => {
                const selectedPartner = partner[row.id]?.label || row.original.return_order_delivery[0]?.partner

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
                                    className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer z-50"
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
            header: 'CREATE TASK',
            accessorKey: 'return_order_delivery',
            cell: ({ row, getValue }: { row: { original: ReturnOrder }; getValue: () => string }) => (
                <button
                    onClick={() =>
                        handleCreateTask(
                            partner[row.id],
                            row.original.return_order_delivery.map((item) => item.partner).join(','),
                            row.original.return_order_id,
                        )
                    }
                >
                    <MdAssignmentTurnedIn className="border-none bg-none text-2xl flex justify-center items-center text-green-600" />
                </button>
            ),
        },
        {
            header: 'Cancel Task',
            accessorKey: 'order',
            cell: ({ row }: { row: { original: ReturnOrder } }) => (
                <button onClick={() => handleCancelTask(row.original.return_order_id)}>
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
        pageCount: Math.ceil(orderCount ?? 0 / pageSize),
        globalFilterFn: fuzzyFilter,
    })

    const handleCancelTask = async (return_order_id: any) => {
        try {
            const body = {
                action: 'cancel',
            }
            await axioisInstance.patch(`/merchant/logistic/returnorder/${return_order_id}`, body)
            notification.success({
                message: 'success',
                description: 'Return Order successfully cancelled',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to cancel order',
            })
        }
    }

    const handleInvoiceClick = (invoiceId: string) => {
        navigate(`/app/returnOrders/${invoiceId}`)
    }

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const handleFromChange = (date: Date | null) => {
        setFrom(date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
    }

    const handleToChange = (date: Date | null) => {
        setTo(date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
    }
    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }

    const handlePartnerSelect = (selectedValue: any, row: any) => {
        console.log('VALUE', selectedValue, row)
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''

        setPartner((prev) => ({
            ...prev,
            [row.id]: { value: selectedValue, label: selectedLabel },
        }))
    }

    const handleDropdownSelect = (selectedValue: string) => {
        if (dropdownStatus.value.includes(selectedValue)) {
            setDropdownStatus((prevState) => ({
                ...prevState,
                value: prevState.value.filter((item) => item !== selectedValue),
            }))
        } else {
            setDropdownStatus((prevState) => ({
                ...prevState,
                value: [...prevState.value, selectedValue],
            }))
        }
    }

    const handleCreateTask = async (partner: any, logistic_partner: any, return_order_id: any) => {
        try {
            const body = {
                action: 'create_reverse_pickup',
                re_create: 'yes',
                logistic_partner: partner?.value ? partner?.value : logistic_partner,
            }

            console.log('BODY', body)

            const response = await axioisInstance.patch(`merchant/return_order/${return_order_id}`, body)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Updated successfully.',
            })
        } catch (error: any) {
            console.error(error)
            const errorMessage = error.response?.data?.message || 'There was an error updating the return order status. Please try again.'
            notification.error({
                message: 'Error',
                description: errorMessage,
            })
        }
    }
    const handleDeliverySelect = (selectedValue: string) => {
        if (deliveryType.value.includes(selectedValue)) {
            setDeliveryType((prevState) => ({
                ...prevState,
                value: prevState.value.filter((item) => item !== selectedValue),
            }))
        } else {
            setDeliveryType((prevState) => ({
                ...prevState,
                value: [...prevState.value, selectedValue],
            }))
        }
    }

    const handleShowFilter = useCallback(() => {
        setShowFilter(true)
    }, [setShowFilter])

    const handleFilterClose = useCallback(() => {
        setShowFilter(false)
    }, [setShowFilter])

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }
    console.log('ssssssswddwdwdw', dropdownStatus)
    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 items-center gap-4">
                <div className="flex gap-2">
                    <div className="flex justify-start ">
                        <input
                            type="search"
                            name="search"
                            id=""
                            placeholder="search here"
                            value={searchInput}
                            className="xl:w-[250px] rounded-[10px] w-[130px]"
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="bg-gray-100 dark:bg-blue-600 dark:text-white  xl:text-md text-sm w-auto rounded-md">
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
                        />
                    </div>

                    <div className="mt-7">
                        <Button variant="new" size="sm" onClick={handleShowFilter} className="hidden xl:flex gap-2">
                            <CiFilter className="text-xl font-extrabold" /> Filter
                        </Button>

                        <Button variant="default" size="sm" onClick={handleShowFilter} className="flex xl:hidden">
                            <FaFilter className="text-xl font-extrabold" />
                        </Button>
                    </div>
                </div>
            </div>

            <Table className="scrollbar-hide">
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

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={orderCount} onChange={onPaginationChange} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => setPageSize(option?.value)}
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
            {showFilter && (
                <FilterReturnOrder
                    showFilter={showFilter}
                    handleFilterClose={handleFilterClose}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={handleDropdownSelect}
                    handleFromChange={handleFromChange}
                    handleToChange={handleToChange}
                    from={from}
                    to={to}
                    deliveryType={deliveryType}
                    handleDeliveryType={handleDeliverySelect}
                    handleDateChange={handleDateChange}
                    setFrom={setFrom}
                    setTo={setTo}
                />
            )}
        </div>
    )
}

export default ReverseDelivery

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
