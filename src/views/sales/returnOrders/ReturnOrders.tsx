/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import type { FilterFn } from '@tanstack/react-table'
import { Button, Dropdown, Input } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { IoMdDownload } from 'react-icons/io'
import { notification } from 'antd'
import { CiFilter } from 'react-icons/ci'
import FilterReturnOrder from './filter/FilterReturnOrder'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { FaFilter } from 'react-icons/fa'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { returnOrderApi } from '@/services/ReturnOrders.services'
import { HiSearch } from 'react-icons/hi'

interface ReturnOrderItem {
    order_item: number
    return_amount: string
    quantity: string
    return_reason: string
    create_date: string
    update_date: string
}

interface ReturnDropdownStatus {
    value: string[]
    name: string[]
}

interface EventArray {
    status: string
    timestamp: string
}

export interface ReturnOrder {
    amount: string
    order: any
    create_date: string
    return_order_delivery: any[]
    return_order_id: string
    return_order_items: ReturnOrderItem[]
    pickup_schedule_slot: number
    pickup_schedule_date: string
    return_type: string
    status: string
    uuid: string
    log: EventArray[]
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const SEARCHOPTIONS = [
    { label: 'RETURN_ID', value: 'return_order_id' },
    { label: 'INVOICE', value: 'invoice_id' },
]

export const DELEIVERYRETRUNOPTIONS = [
    { label: 'User_Initiated', value: 'USER_INITIATED' },
    { label: 'Dashboard_Cancelled', value: 'DASHBOARD_CANCELLED' },
    { label: 'Try&Buy', value: 'TRY_AND_BUY' },
]

const scheduleSlots: any = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}

const ReturnOrders = () => {
    const location = useLocation()
    const { var1, var2 } = location.state || {}
    const [orders, setOrders] = useState<ReturnOrder[]>([])
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [invoiceFilter, setInvoiceFilter] = useState('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [deliveryType, setDeliveryType] = useState<ReturnDropdownStatus>({
        value: [],
        name: [],
    })
    const [searchInput, setSearchInput] = useState<string>('')
    const [page, setPage] = useState(1)

    const [from, setFrom] = useState(var1 ? var1 : null)
    const [to, setTo] = useState(var2 ? var2 : null)
    const [orderCount, setOrderCount] = useState()
    const [dropdownStatus, setDropdownStatus] = useState<{ name: string; value: string[] }>({
        name: 'PICKUP CREATED',
        value: ['PICKUP_CREATED'],
    })
    const [showFilter, setShowFilter] = useState(false)

    const fetchOrders = async (page: number, pageSize: number, from: string, to: string) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            let status = ''
            if (!searchInput) {
                status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`
            }

            let deliveryStatus = ''
            if (deliveryType?.value && deliveryType?.value.length > 0) {
                deliveryStatus = `&return_type=${deliveryType?.value}`
            }

            let searwiseDownload = ''
            if (currentSelectedPage.value === 'return_order_id' && searchInput) {
                searwiseDownload = `&return_order_id=${searchInput.toUpperCase()}`
            } else if (currentSelectedPage.value === 'invoice_id' && searchInput) {
                searwiseDownload = `&invoice_id=${searchInput.toUpperCase()}`
            }
            let fromToParams = ''
            if (from && to && !searchInput) {
                fromToParams = `&from=${from}&to=${To_Date}`
            }

            const response = await returnOrderApi(page, pageSize, searwiseDownload, status, fromToParams, deliveryStatus)

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

    const columns = useMemo(
        () => [
            {
                header: 'Order Id',
                accessorKey: 'order',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <a
                        href={`/app/orders/${getValue()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-red-600 flex items-center justify-center py-1 px-4 rounded-[7px] font-semibold cursor-pointer"
                    >
                        {getValue()}
                    </a>
                ),
            },
            {
                header: 'Return_Order Id',
                accessorKey: 'return_order_id',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <a
                        href={`/app/returnOrders/${getValue()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white w-[70%] bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                    >
                        {getValue()}
                    </a>
                ),
            },
            {
                header: 'Order Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: { getValue: () => string }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Return Type',
                accessorKey: 'return_type',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
            },

            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
            },
            {
                header: 'Scheduled Date',
                accessorKey: 'pickup_schedule_date',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const log = row?.original?.pickup_schedule_date

                    return <div>{log}</div>
                },
            },
            {
                header: 'Scheduled Slot',
                accessorKey: 'pickup_schedule_slot',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const log = row?.original?.pickup_schedule_slot

                    const schedule = scheduleSlots[log]

                    return <div>{schedule ? `${schedule.start} - ${schedule.end}` : 'Not Scheduled'}</div>
                },
            },

            {
                header: 'Last Update',
                accessorKey: 'return_order_items',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const log = row?.original?.log
                    const updatedLog = log && log.length > 0 ? log.at(-1) : undefined

                    return (
                        <div>
                            {updatedLog
                                ? moment(updatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')
                                : moment(row?.original?.create_date).format('YYYY-MM-DD hh:mm:ss a')}
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const table = useReactTable({
        data: orders,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
            globalFilter,
        },
        onGlobalFilterChange: setInvoiceFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(orderCount ?? 0 / pageSize),
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
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

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleFromChange = (date: Date | null) => {
        if (date) {
            setFrom(moment(date).format('YYYY-MM-DD'))
        } else {
            setFrom(moment().format('YYYY-MM-DD'))
        }
    }

    const handleToChange = (date: Date | null) => {
        if (date) {
            setTo(moment(date).format('YYYY-MM-DD'))
        } else {
            setTo(moment().format('YYYY-MM-DD'))
        }
    }

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    const handleDropdownSelect = (selectedValue: string) => {
        setDropdownStatus((prevState) => {
            const currentValue = prevState.value
            if (currentValue.includes(selectedValue)) {
                return {
                    ...prevState,
                    value: currentValue.filter((item) => item !== selectedValue),
                }
            } else {
                return {
                    ...prevState,
                    value: [...currentValue, selectedValue],
                }
            }
        })
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

    const handleDownload = async () => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`

            let deliveryStatus = ''

            if (deliveryType?.value && deliveryType?.value.length > 0) {
                deliveryStatus = `&return_type=${deliveryType?.value}`
            }

            let searwiseDownload = ''

            if (currentSelectedPage.value === 'return_order_id' && searchInput) {
                searwiseDownload = `&return_order_id=${searchInput.toUpperCase()}`
            } else if (currentSelectedPage.value === 'invoice_id' && searchInput) {
                searwiseDownload = `&invoice_id=${searchInput.toUpperCase()}`
            }

            const downloadUrl = `merchant/return_orders?download=true${searwiseDownload}${status}&from=${from}&to=${To_Date}${deliveryStatus}`

            const response = await axioisInstance.get(downloadUrl, {
                responseType: 'blob',
            })

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = 'ReturnOrders.csv'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            notification.success({
                message: 'SUCCESS',
                description: 'File successfully downloaded',
            })
        } catch (error) {
            console.error('Error downloading the file:', error)
        }
    }

    const handleShowFilter = useCallback(() => {
        setShowFilter(true)
    }, [setShowFilter])

    const handleFilterClose = useCallback(() => {
        setShowFilter(false)
    }, [setShowFilter])

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end">
                <button
                    className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200 rounded-lg mb-2 md:mb-0 md:mr-2 flex gap-1 xl:hidden dark:bg-slate-700 dark:text-gray-200"
                    onClick={handleDownload}
                >
                    <IoMdDownload className="text-xl md:text-xl" />
                </button>
            </div>
            <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 items-center gap-3">
                <div className="flex gap-2">
                    <div className="flex justify-start ">
                        {/* <input
                            type="search"
                            name="search"
                            id=""
                            placeholder="search here"
                            value={searchInput}
                            className=" xl:w-[250px] rounded-[10px] w-[130px] dark:bg-gray-900"
                            onChange={handleSearch}
                        /> */}
                        <Input
                            type="search"
                            name="search"
                            placeholder="search here"
                            value={searchInput}
                            className="xl:w-[250px] rounded-[10px] w-[130px] dark:bg-gray-900"
                            prefix={<HiSearch className="text-xl items-center flex justify-center" />}
                            onChange={handleSearch}
                        />
                    </div>
                    <div>
                        <div className="bg-gray-100   xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                            <Dropdown
                                className=" text-xl text-black bg-gray-200 font-bold  "
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

                <div className="flex gap-4">
                    <div className="flex flex-col md:flex-row items-end justify-end ">
                        <button
                            className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200 rounded-lg mb-2 md:mb-0 md:mr-2 hidden xl:flex xl:gap-1"
                            onClick={handleDownload}
                        >
                            <IoMdDownload className="text-xl md:text-xl xl:font-extrabold" />
                            EXPORT
                        </button>
                    </div>

                    <div className="flex gap-2 items-center xl:mt-1">
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
                        <div className="xl:mt-7">
                            <Button variant="new" size="sm" onClick={handleShowFilter} className="hidden xl:flex gap-2">
                                <CiFilter className="text-xl font-extrabold" /> FILTER
                            </Button>

                            <Button variant="default" size="sm" onClick={handleShowFilter} className="flex xl:hidden mt-5">
                                <FaFilter className="text-xl font-extrabold" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border p-2 border-gray-300 rounded-md">
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
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={orderCount} onChange={onPaginationChange} />
                <div className="min-w-[130px] flex gap-5">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                        className="w-full"
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

export default ReturnOrders

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
