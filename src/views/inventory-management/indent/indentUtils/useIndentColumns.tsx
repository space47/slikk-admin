/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { USER_PROFILE_DATA } from '@/store/types/company.types'

interface IndentColumnsProps {
    storeList: USER_PROFILE_DATA['store']
    store_type?: string
}

export const useIndentColumns = ({ storeList, store_type }: IndentColumnsProps) => {
    const navigate = useNavigate()

    const findStoreName = (storeId: number) => {
        const store = storeList.find((store) => store?.id === storeId)
        return store ? store.name : 'Unknown Store'
    }

    return useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: 'Intent No.',
                accessorKey: 'intent_number',
                cell: ({ row }) => (
                    <div
                        className="p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                        onClick={() =>
                            navigate(`/app/goods/indentDetails/${row.original.id}`, {
                                state: {
                                    store_type: store_type,
                                },
                            })
                        }
                    >
                        {row.original.intent_number}
                    </div>
                ),
            },
            {
                header: 'Source Store',
                accessorKey: 'source_store',
                cell: ({ row }) => <span>{findStoreName(row.original.source_store)}</span>,
            },
            {
                header: 'Target Store',
                accessorKey: 'target_store',
                cell: ({ row }) => <span>{findStoreName(row.original.target_store)}</span>,
            },
            {
                header: 'Notes',
                accessorKey: 'notes',
                cell: ({ row }) => <span>{row.original.notes || '-'}</span>,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                            row.original.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : row.original.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {row.original.status}
                    </span>
                ),
            },
        ],
        [storeList],
    )
}
