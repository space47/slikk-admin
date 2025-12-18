/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit } from 'react-icons/fa'
import { IndentDetailsTypes } from '@/store/types/indent.types'
import { MdOutlineEditOff } from 'react-icons/md'
import { Tooltip } from '@/components/ui'

type ItemType = {
    intent_note: number
    sku: string
    company: number
    quantity_required: number
    quantity_accepted: number
    notes: string
    is_picked: boolean
    picker: {
        first_name: string
        last_name: string
        mobile?: string
    }
    box_mapping: any
    locations: string
}

interface props {
    store_type?: string
    handleUpdate: (item: any) => void
    data: IndentDetailsTypes
}

export const useItemsColumns = ({ handleUpdate, data }: props) => {
    const currentStatus = data?.status
    console.log('currentStatus', currentStatus, 'and data is', data)
    return useMemo<ColumnDef<ItemType, any>[]>(
        () => [
            {
                header: 'Indent Note',
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
                header: 'Picker Name',
                accessorKey: 'picker',
                cell: ({ row }) => (
                    <span className="text-gray-600 font-semibold flex gap-2">
                        {row?.original?.picker?.first_name} {row?.original?.picker?.last_name}
                    </span>
                ),
            },
            {
                header: 'Picker Phone',
                accessorKey: 'picker',
                cell: ({ row }) => <span className="text-gray-600 font-semibold flex gap-2">{row?.original?.picker?.mobile}</span>,
            },
            {
                header: 'Notes',
                accessorKey: 'notes',
                cell: ({ row }) => <span className="italic text-gray-500">{row?.original?.notes || 'N/A'}</span>,
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: ({ row }) => <span className="italic text-gray-500">{row?.original?.locations || 'N/A'}</span>,
            },
            {
                header: 'Box',
                accessorKey: 'box_mapping',
                cell: ({ row }) => <span className="italic text-gray-500">{JSON.stringify(row?.original?.box_mapping) || 'N/A'}</span>,
            },
            {
                header: 'Is Picked',
                accessorKey: 'is_picked',
                cell: ({ row }) => <span className="italic text-gray-500">{row?.original?.is_picked ? 'Yes' : 'No'}</span>,
            },
            {
                header: 'Update',
                accessorKey: '',
                cell: ({ row }) => {
                    console.log('currentStatus', currentStatus)
                    return currentStatus === 'approved' ? (
                        <>
                            <Tooltip title="Approved Items cannot be edited">
                                <MdOutlineEditOff className="text-2xl text-gray-600" />
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <button className="flex justify-center  items-center" onClick={() => handleUpdate(row?.original)}>
                                <FaEdit className="text-2xl text-green-600" />
                            </button>
                        </>
                    )
                },
            },
        ],
        [],
    )
}

export const useItemsPickerColumns = () => {
    return useMemo<ColumnDef<any, any>[]>(
        () => [
            {
                header: 'Picker Number',
                accessorKey: 'picker',
                cell: ({ row }) => <span className="text-gray-600 font-semibold flex gap-2">{row?.original?.picker}</span>,
            },
            {
                header: 'Total Required',
                accessorKey: 'total_required',
                cell: ({ row }) => <span className="text-gray-600">{row?.original?.total_required || 'N/A'}</span>,
            },
            {
                header: 'Total Accepted',
                accessorKey: 'total_accepted',
                cell: ({ row }) => <span className="text-gray-600">{row?.original?.total_accepted || 'N/A'}</span>,
            },
        ],
        [],
    )
}
