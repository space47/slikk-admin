/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { FcViewDetails } from 'react-icons/fc'
import moment from 'moment'

interface props {
    storeList: USER_PROFILE_DATA['store']
    store_type?: string
    handleStatusClick: (id: number) => void
}

export const useRtvColumns = ({ storeList, handleStatusClick }: props) => {
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
                    <a
                        className="w-[230px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                        href={`/app/goods/indentDetails/${row.original.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {row.original.intent_number}
                    </a>
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
            {
                header: 'Create Update',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Last Update',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Status',
                accessorKey: 'intent_number',
                cell: ({ row }) => (
                    <button onClick={() => handleStatusClick(row.original.id)}>
                        <FcViewDetails className="text-2xl" />
                    </button>
                ),
            },
        ],
        [storeList],
    )
}
