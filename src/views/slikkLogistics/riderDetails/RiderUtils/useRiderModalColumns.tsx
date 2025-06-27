/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export const useRiderModalColumnsForOrders = () => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Order Id',
                accessorKey: 'client_order_id',
                cell: ({ row }: any) => {
                    return (
                        <div
                            className="p-2 rounded-xl bg-red-500 text-white flex justify-center items-center"
                            onClick={() => navigate(`/app/orders/${row.original.client_order_id}`)}
                        >
                            {row.original.client_order_id ?? 'N/A'}
                        </div>
                    )
                },
            },
            {
                header: 'Cash Collect',
                accessorKey: 'client_order_details.cash_to_be_collected',
                cell: ({ row }: any) => {
                    return <div>{row.original.client_order_details.cash_to_be_collected ?? 'N/A'}</div>
                },
            },
            {
                header: 'Cash Collect',
                accessorKey: 'client_order_details.payment_mode',
                cell: ({ row }: any) => {
                    return <div>{row.original.client_order_details.payment_mode ?? 'N/A'}</div>
                },
            },
            {
                header: 'Address',
                accessorKey: 'drop_details.address',
                cell: ({ row }: any) => {
                    return <div>{row.original.drop_details.address ?? 'N/A'}</div>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }: any) => {
                    return <div>{row.original.status ?? 'N/A'}</div>
                },
            },
            {
                header: 'Task Type',
                accessorKey: 'task_type',
                cell: ({ row }: any) => {
                    return <div>{row.original.task_type ?? 'N/A'}</div>
                },
            },
        ],
        [],
    )
}

export const useRiderModalColumns = () => {
    return useMemo(
        () => [
            {
                header: 'Checkin Date',
                accessorKey: 'checkin_date',
                cell: ({ row }: any) => {
                    return <div>{row.original.checkin_date ?? 'N/A'}</div>
                },
            },
            {
                header: 'Checkin Time',
                accessorKey: 'checkin_time',
                cell: ({ row }: any) => {
                    return <div>{row.original.checkin_time ?? 'N/A'}</div>
                },
            },
            {
                header: 'Checkout Time',
                accessorKey: 'checkout_time',
                cell: ({ row }: any) => {
                    return <div>{row.original.checkout_time ?? 'N/A'}</div>
                },
            },
            {
                header: 'Active Time',
                accessorKey: 'active_time',
                cell: ({ row }: any) => {
                    return <div>{row.original.active_time ?? 'N/A'}mins</div>
                },
            },
            {
                header: 'Type',
                accessorKey: 'user_type',
                cell: ({ row }: any) => {
                    return <div>{row.original.user_type ?? 'N/A'}</div>
                },
            },
        ],
        [],
    )
}
