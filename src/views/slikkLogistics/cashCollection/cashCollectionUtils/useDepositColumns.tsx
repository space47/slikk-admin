/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { FaMoneyBillWave } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface props {
    handleDepositClick: any
}

export const useDepositColumns = ({ handleDepositClick }: props) => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Deposit',
                accessorKey: 'id',
                cell: ({ row }: any) => (
                    <button
                        className="flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-sm"
                        onClick={() => handleDepositClick(row?.original)}
                    >
                        <FaMoneyBillWave className="text-lg" />
                        Deposit
                    </button>
                ),
            },
            {
                header: 'Order ID',
                accessorKey: 'client_order_id',
                cell: ({ row }: any) => {
                    const id = row.original.client_order_id
                    const isReturnOrder = id?.startsWith('R')
                    const link = isReturnOrder ? `/app/returnOrders/${id}` : `/app/orders/${id}`

                    return (
                        <button
                            onClick={() => navigate(link)}
                            className="px-3 py-1 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-sm"
                        >
                            {id ?? 'N/A'}
                        </button>
                    )
                },
            },
            {
                header: 'Cash To Be Collected',
                accessorKey: 'client_order_details.cash_to_be_collected',
                cell: ({ row }: any) => <span>{row.original.client_order_details.cash_to_be_collected ?? 'N/A'}</span>,
            },
            {
                header: 'Cash Collected',
                accessorKey: 'client_order_details.cash_to_be_collected',
                cell: ({ row }: any) => <span>{row.original.client_order_details.cash_collected ? 'Yes' : 'No'}</span>,
            },
            {
                header: 'Payment Mode',
                accessorKey: 'client_order_details.payment_mode',
                cell: ({ row }: any) => <span>{row.original.client_order_details.payment_mode ?? 'N/A'}</span>,
            },
            {
                header: 'Deposit Amount',
                accessorKey: 'deposit_amount',
                cell: ({ row }: any) => <span>{row.original.deposit_amount ?? 'N/A'}</span>,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }: any) => <span>{row.original.status ?? 'N/A'}</span>,
            },
            {
                header: 'Task Type',
                accessorKey: 'task_type',
                cell: ({ row }: any) => <span>{row.original.task_type ?? 'N/A'}</span>,
            },
        ],
        [navigate],
    )
}
