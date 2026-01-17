/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import moment from 'moment'
import { Rtv_Products } from '@/store/types/rtv.types'
import { FaEdit } from 'react-icons/fa'

interface props {
    handleEditProducts: (x: Rtv_Products) => void
}

export const useRtvProductsColumn = ({ handleEditProducts }: props) => {
    return useMemo<ColumnDef<Rtv_Products>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'sku',
                cell: ({ row }) => (
                    <span>
                        <FaEdit className="text-blue-600 cursor-pointer text-xl" onClick={() => handleEditProducts(row?.original)} />
                    </span>
                ),
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }) => <span className="font-medium text-gray-800 dark:text-gray-200">{row.original.sku}</span>,
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ row }) => {
                    const imageUrl = row?.original?.images.split(',')[0]
                    return (
                        <>
                            <img src={imageUrl} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                        </>
                    )
                },
            },
            // {
            //     header: 'Picker',
            //     accessorKey: 'picker',
            //     cell: ({ row }) => <span>{row.original.picker || '-'}</span>,
            // },
            {
                header: 'Qty Required',
                accessorKey: 'quantity_required',
                cell: ({ row }) => <span className="text-center">{row.original.quantity_required}</span>,
            },
            {
                header: 'Qty Synced',
                accessorKey: 'synced_quantity',
                cell: ({ row }) => <span className="text-blue-600 font-semibold">{row?.original?.synced_quantity}</span>,
            },
            {
                header: 'Qty Accepted',
                accessorKey: 'quantity_accepted',
                cell: ({ row }) => (
                    <span
                        className={`text-center flex gap-4 items-center ${
                            row.original.quantity_accepted < row.original.quantity_required ? 'text-yellow-600' : 'text-green-700'
                        }`}
                    >
                        <span>{row.original.quantity_accepted}</span>{' '}
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
                cell: ({ row }) => <span>{JSON.stringify(row?.original?.box_locations || 'N/A')}</span>,
            },

            {
                header: 'Synced To Inventory',
                accessorKey: 'synced_to_inventory',
                cell: ({ row }) => <span className="italic text-gray-500">{row?.original?.synced_to_inventory ? 'Yes' : 'No'}</span>,
            },

            {
                header: 'Locations',
                accessorKey: 'locations',
                cell: ({ row }) => <span>{row.original.locations || '-'}</span>,
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
