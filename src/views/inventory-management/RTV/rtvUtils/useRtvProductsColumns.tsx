/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import moment from 'moment'
import { Rtv_Products } from '@/store/types/rtv.types'

export const useRtvProductsColumn = () => {
    return useMemo<ColumnDef<Rtv_Products>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }) => <span className="font-medium text-gray-800 dark:text-gray-200">{row.original.sku}</span>,
            },
            {
                header: 'Picker',
                accessorKey: 'picker',
                cell: ({ row }) => <span>{row.original.picker || '-'}</span>,
            },
            {
                header: 'Qty Required',
                accessorKey: 'quantity_required',
                cell: ({ row }) => <span className="text-center">{row.original.quantity_required}</span>,
            },
            {
                header: 'Qty Accepted',
                accessorKey: 'quantity_accepted',
                cell: ({ row }) => (
                    <span
                        className={`text-center ${
                            row.original.quantity_accepted < row.original.quantity_required ? 'text-yellow-600' : 'text-green-700'
                        }`}
                    >
                        {row.original.quantity_accepted}
                    </span>
                ),
            },
            {
                header: 'Picked',
                accessorKey: 'is_picked',
                cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                            row.original.is_picked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {row.original.is_picked ? 'Yes' : 'No'}
                    </span>
                ),
            },
            {
                header: 'Box No.',
                accessorKey: 'box_number',
                cell: ({ row }) => <span>{row.original.box_number || '-'}</span>,
            },

            {
                header: 'Created On',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Updated On',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [],
    )
}
