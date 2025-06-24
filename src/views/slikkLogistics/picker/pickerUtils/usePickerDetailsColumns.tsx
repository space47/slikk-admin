/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export const usePickerDetailsColumns = () => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Invoice Id',
                accessorKey: 'invoice_id',
                cell: ({ getValue }: any) => (
                    <div
                        className="font-medium bg-red-600 p-1 rounded-xl text-white items-center justify-center flex cursor-pointer "
                        onClick={() => navigate(`/app/orders/${getValue()}`)}
                    >
                        {getValue()}
                    </div>
                ),
            },
            { header: 'Delivery Type', accessorKey: 'delivery_type' },
            { header: 'Items Count', accessorKey: 'items_count' },
            { header: 'Payment Mode', accessorKey: 'payment_mode' },
            { header: 'Status', accessorKey: 'status' },
            { header: 'total amount', accessorKey: 'total_amount' },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <div>{moment(getValue()).format(`YYYY-MM-DD HH:mm:ss a`)}</div>,
            },
        ],
        [],
    )
}
