/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    useGlobalFilter
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import type { FilterFn } from '@tanstack/react-table'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown } from '@/components/ui'
import { RETURN_ORDERS } from '@/views/category-management/orderlist/commontypes'

interface ReturnOrderItem {
    order_item: number
    return_amount: string
    quantity: string
    return_reason: string
    create_date: string
    update_date: string
}

interface ReturnOrder {
    amount: string
    create_date: string
    return_order_delivery: any[]
    return_order_id: string
    return_order_items: ReturnOrderItem[]
    return_type: string
    status: string
    uuid: string
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' }
]

const OrderList = () => {
    const [orders, setOrders] = useState<ReturnOrder[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState()
    const [dropdownStatus, setDropdownStatus] = useState<
        Record<string, string>
    >(RETURN_ORDERS[0])

    const fetchOrders = async (
        page: number,
        pageSize: number,
        from: string,
        to: string,
        filter: string = ''
    ) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status =
                dropdownStatus?.value === 'ALL'
                    ? ''
                    : `&status=${dropdownStatus?.value}`
            const response = await axiosInstance.get(
                `/merchant/return_orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${status}&name=${filter}`
                //
            )

            const ordersData = response.data?.data.results
            const orderCount = response.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrders(page, pageSize, from, to, globalFilter)
    }, [page, pageSize, from, to, dropdownStatus, globalFilter])

    const columns = useMemo(
        () => [
            {
                header: 'Return_Order Id',
                accessorKey: 'return_order_id',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <div
                        className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                        onClick={() => handleRemoveClick(getValue())}
                    >
                        {getValue()}
                    </div>
                )
            },
            {
                header: 'Order Date',
                accessorKey: 'return_order_items.create_date',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <span>{moment(getValue()).format('YYYY-MM-DD')}</span>
                )
            },
            {
                header: 'Return Type',
                accessorKey: 'return_type',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <span>{getValue()}</span>
                )
            },
            {
                header: 'Total Amount',
                accessorKey: 'amount',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <span>{getValue()}</span>
                )
            },
            {
                header: 'Return Reason',
                accessorKey: 'return_order_items',
                cell: ({ row }: { row: { original: ReturnOrder } }) => (
                    <span>
                        {row.original.return_order_items[0]?.order_item || ''}
                    </span>
                )
            },
            {
                header: 'Return Reason',
                accessorKey: 'return_order_items',
                cell: ({ row }: { row: { original: ReturnOrder } }) => (
                    <span>
                        {row.original.return_order_items[0]?.quantity || ''}
                    </span>
                )
            },
            {
                header: 'Return Reason',
                accessorKey: 'return_order_items',
                cell: ({ row }: { row: { original: ReturnOrder } }) => (
                    <span>
                        {row.original.return_order_items[0]?.return_reason ||
                            ''}
                    </span>
                )
            },
            {
                header: 'Order Total',
                accessorKey: 'amount',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <span>{getValue()}</span>
                )
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <span>{getValue()}</span>
                )
            },
            {
                header: 'Last Update',
                accessorKey: 'return_order_items.update_date',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <span>{moment(getValue()).format('YYYY-MM-DD')}</span>
                )
            },
            {
                header: 'UUID',
                accessorKey: 'uuid',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <span>{getValue()}</span>
                )
            }
        ],
        []
    )

    const table = useReactTable({
        data: orders,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize
            },
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(orderCount ?? 0 / pageSize)
    })

    const handleRemoveClick = (return_order_id: string) => {
        // navigate(`/app/orders/${invoiceId}`)
        navigate(`/app/returnOrders/${return_order_id}`)
    }

    const onPaginationChange = (page: number) => {
        setPage(page)

        console.log('sssssssssssssssssssss', page)
        // setPageSize(pageSize)
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

    const handleDropdownSelect = (a: any) => {
        setDropdownStatus({
            value: a,
            name: RETURN_ORDERS.find((item) => item.value == a)?.name || ''
        })
    }
    console.log('ssssssswddwdwdw', dropdownStatus)
    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between mb-10 items-center ">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>

                <div className="flex gap-10 items-center justify-between">
                    <div className="relative w-50 bg-gray-100 items-center flex justify-center">
                        <Dropdown
                            className="w-full px-4 py-2 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                            title={dropdownStatus.name}
                            onSelect={handleDropdownSelect}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {RETURN_ORDERS?.map((item: any, key: any) => {
                                    return (
                                        <DropdownItem
                                            key={key}
                                            eventKey={item.value}
                                            className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                        >
                                            <span>{item.name}</span>
                                        </DropdownItem>
                                    )
                                })}
                            </div>
                        </Dropdown>
                    </div>

                    <div className="flex gap-5">
                        <div>
                            <div className="mb-1 font-semibold text-sm">
                                FROM DATE:
                            </div>
                            <DatePicker
                                inputPrefix={
                                    <HiOutlineCalendar className="text-lg" />
                                }
                                defaultValue={new Date()}
                                value={new Date(from)}
                                onChange={handleFromChange}
                            />
                        </div>
                        <div>
                            <div className="mb-1 font-semibold text-sm">
                                TO DATE:
                            </div>
                            <DatePicker
                                inputSuffix={
                                    <TbCalendarStats className="text-xl" />
                                }
                                defaultValue={new Date()}
                                value={new Date(to)}
                                onChange={handleToChange}
                                minDate={moment(from).add(1, 'day').toDate()}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            }
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <Sorter
                                                sort={header.column.getIsSorted()}
                                            />
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
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={orderCount}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find(
                            (option) => option.value === pageSize
                        )}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                        className="flex justify-end"
                    />
                </div>
            </div>
        </div>
    )
}

export default OrderList

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
