/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit } from 'react-icons/fa'

type ItemType = {
    intent_note: number
    sku: string
    company: number
    quantity_required: number
    quantity_accepted: number
    notes: string
}

interface props {
    store_type?: string
    handleUpdate: (item: any) => void
}

export const useItemsColumns = ({ handleUpdate }: props) => {
    return useMemo<ColumnDef<ItemType, any>[]>(
        () => [
            {
                header: 'Intent Note',
                accessorKey: 'intent_note',
            },
            {
                header: 'SKU / Description',
                accessorKey: 'sku',
                cell: ({ row }) => <span className="font-medium text-gray-800">{row?.original?.sku || 'N/A'} </span>,
            },
            {
                header: 'Company',
                accessorKey: 'company',
                cell: ({ row }) => <span className="text-gray-600">#{row?.original?.company || 'N/A'}</span>,
            },
            {
                header: 'Qty Required',
                accessorKey: 'quantity_required',
                cell: ({ row }) => <span className="text-blue-600 font-semibold">{row?.original?.quantity_required}</span>,
            },
            {
                header: 'Qty Accepted',
                accessorKey: 'quantity_accepted',
                cell: ({ row }) => <span className="text-green-600 font-semibold">{row?.original?.quantity_accepted}</span>,
            },
            {
                header: 'Notes',
                accessorKey: 'notes',
                cell: ({ row }) => <span className="italic text-gray-500">{row?.original?.notes || 'N/A'}</span>,
            },
            {
                header: 'Update',
                accessorKey: '',
                cell: ({ row }) => {
                    return (
                        <button className="flex justify-center  items-center" onClick={() => handleUpdate(row?.original)}>
                            <FaEdit className="text-2xl text-green-600" />
                        </button>
                    )
                },
            },
        ],
        [],
    )
}
