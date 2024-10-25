/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'

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
import moment from 'moment'
import type { FilterFn } from '@tanstack/react-table'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppSelector } from '@/store'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { Spinner } from '@/components/ui'
import { useParams } from 'react-router-dom'

interface ReturnOrderItem {
    order_item: number
    return_amount: string
    quantity: string
    return_reason: string
    create_date: string
    update_date: string
}

export interface ReturnOrder {
    amount: string
    order: any
    create_date: string
    return_order_delivery: any[]
    return_order_id: string
    return_order_items: ReturnOrderItem[]
    return_type: string
    status: string
    uuid: string
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

export const DELEIVERYRETRUNOPTIONS = [
    { label: 'User_Initiated', value: 'USER_INITIATED' },
    { label: 'Dashboard_Cancelled', value: 'DASHBOARD_CANCELLED' },
    { label: 'Try&Buy', value: 'TRY_AND_BUY' },
]

const CartReturnOrders = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)
    const { mobile } = useParams()

    const user = customerData?.profile?.mobile

    console.log('MOBILE', user)

    const [orders, setOrders] = useState<ReturnOrder[]>([])
    const [pageSize, setPageSize] = useState(100)

    const [page, setPage] = useState(1)
    const [orderCount, setOrderCount] = useState()
    const [showSpinner, setShowSpinner] = useState(false)

    const fetchOrders = async (page: number, pageSize: number) => {
        try {
            setShowSpinner(true)
            const returnUrl = `merchant/return_orders?p=${page}&page_size=${pageSize}&mobile=${mobile}`

            const response = await axioisInstance.get(returnUrl)

            const ordersData = response?.data?.data.results
            const orderCount = response?.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
            setShowSpinner(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (customerData) {
            fetchOrders(page, pageSize)
        }
    }, [])

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
                        className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                    >
                        {getValue()}
                    </a>
                ),
            },
            {
                header: 'Order Date',
                accessorKey: 'return_order_items.create_date',
                cell: ({ getValue }: { getValue: () => string }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Return Type',
                accessorKey: 'return_type',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
            },
            {
                header: 'Total Amount',
                accessorKey: 'amount',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
            },
            {
                header: 'Return Order Item',
                accessorKey: 'return_order_items',
                cell: ({ row }: { row: { original: ReturnOrder } }) => <span>{row.original.return_order_items[0]?.order_item || ''}</span>,
            },
            {
                header: 'Return QTY',
                accessorKey: 'return_order_items',
                cell: ({ row }: { row: { original: ReturnOrder } }) => <span>{row.original.return_order_items[0]?.quantity || ''}</span>,
            },
            {
                header: 'Return Reason',
                accessorKey: 'return_order_items',
                cell: ({ row }: { row: { original: ReturnOrder } }) => (
                    <span>{row.original.return_order_items[0]?.return_reason || ''}</span>
                ),
            },
            {
                header: 'Order Total',
                accessorKey: 'amount',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
            },
            {
                header: 'Last Update',
                accessorKey: 'return_order_items.update_date',
                cell: ({ getValue }: { getValue: () => string }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'UUID',
                accessorKey: 'uuid',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
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
        },
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(orderCount ?? 0 / pageSize),
    })

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center h-1/3">
                <Spinner size={40} />
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
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
    )
}

export default CartReturnOrders

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
