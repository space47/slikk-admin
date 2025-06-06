/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { CustomerEventData } from '@/store/types/orderUserSummary.types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface props {
    customerEvents: CustomerEventData[]
}

const CustomerEvents = ({ customerEvents }: props) => {
    const navigate = useNavigate()

    const columns = [
        {
            header: 'Order Id',
            accessorKey: 'order',
            cell: ({ row }: any) => (
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    onClick={() => navigate(`/app/orders/${row.original.order}`)}
                >
                    {row.original.order}
                </button>
            ),
        },
        {
            header: 'Code',
            accessorKey: 'event_code',
            cell: ({ row }: any) => <span className="text-gray-800">{row.original.event_code}</span>,
        },
        {
            header: 'Conditions Accepted',
            accessorKey: 'other_conditions_accepted',
            cell: ({ row }: any) => (
                <span className="text-sm font-medium text-green-700">{row.original.other_conditions_accepted ? 'Yes' : 'No'}</span>
            ),
        },
        {
            header: 'T&C Accepted',
            accessorKey: 'terms_and_conditions_accepted',
            cell: ({ row }: any) => (
                <span className="text-sm font-medium text-blue-700">{row.original.terms_and_conditions_accepted ? 'Yes' : 'No'}</span>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }: any) => (
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded 
          ${row.original.status === 'REDEEMED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
                >
                    {row.original.status}
                </span>
            ),
        },
    ]

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-6 mt-10 xl:mt-5 mb-10">
            <div className="text-xl font-bold">Events List</div>
            <EasyTable overflow columns={columns} mainData={customerEvents} />
        </div>
    )
}

export default CustomerEvents
