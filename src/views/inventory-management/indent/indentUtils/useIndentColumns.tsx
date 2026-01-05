/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { SINGLE_COMPANY_DATA, USER_PROFILE_DATA } from '@/store/types/company.types'
import { FcViewDetails } from 'react-icons/fc'
import moment from 'moment'
import { IndentResultType } from '@/store/types/indent.types'
import { useAppSelector } from '@/store'

interface IndentColumnsProps {
    storeList: USER_PROFILE_DATA['store']
    store_type?: string
    handleStatusClick: (id: number) => void
}

export const useIndentColumns = ({ storeList, handleStatusClick }: IndentColumnsProps) => {
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((state) => state.company.currCompany)
    const findStoreName = (storeId: number) => {
        const store = storeList.find((store) => store?.id === storeId)
        return store ? store.name : 'Unknown Store'
    }

    return useMemo<ColumnDef<IndentResultType>[]>(
        () => [
            {
                header: 'Indent No.',
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
                header: 'GDN Number',
                accessorKey: 'gdn_number',
                cell: ({ row }) => {
                    return row?.original?.gdn_id ? (
                        <a
                            className="w-[180px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                            href={`/app/goods/gdnDetails/${encodeURIComponent(row.original.gdn_id)}/${selectedCompany?.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {row.original.gdn_number}
                        </a>
                    ) : (
                        <span className="text-red-500">No GDN Found</span>
                    )
                },
            },
            {
                header: 'Shipment Id',
                accessorKey: 'shipment_id',
                cell: ({ row }) => {
                    return row?.original?.shipment_id ? (
                        <a
                            className="w-[180px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                            href={`/app/vendor/shipments/details/${row?.original?.shipment_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            SHIPMENT-{row.original.shipment_id}
                        </a>
                    ) : (
                        <span className="text-red-500">No Shipment Found</span>
                    )
                },
            },
            {
                header: 'GRN Number',
                accessorKey: 'grn_number',
                cell: ({ row }) => {
                    return row?.original?.grn_number ? (
                        <a
                            className="w-[150px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                            href={`/app/goods/received/${selectedCompany?.id}/${row.original.grn_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {row.original.grn_number}
                        </a>
                    ) : (
                        <span className="text-red-500">No GRN Found</span>
                    )
                },
            },
            {
                header: 'Document Id',
                accessorKey: 'document_id',
                cell: ({ row }) => <span>{row.original.document_id}</span>,
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
