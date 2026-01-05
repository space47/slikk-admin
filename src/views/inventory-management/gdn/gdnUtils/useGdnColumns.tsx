import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { GDN_TYPES } from '../commonGdn'
import moment from 'moment'

interface props {
    handleDeleteClick: (x: number) => void
}

export const useGdnColumns = ({ handleDeleteClick }: props) => {
    return useMemo<ColumnDef<GDN_TYPES>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none">
                        <a href={`/app/goods/gdn/${encodeURIComponent(row.original.document_number)}`} target="_blank" rel="noreferrer">
                            {' '}
                            <FaEdit className="text-xl text-blue-500" />
                        </a>
                    </button>
                ),
            },
            {
                header: 'Document Number',
                accessorKey: 'document_number',
                cell: ({ row }) => (
                    <div className="cursor-pointer bg-gray-200 px-2 py-2 items-center flex justify-center rounded-md text-black font-semibold">
                        <a
                            href={`/app/goods/gdnDetails/${encodeURIComponent(row.original.id)}/${row?.original?.company}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {row.original.document_number}
                        </a>
                    </div>
                ),
            },
            {
                header: 'GDN Number',
                accessorKey: 'gdn_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Document Date',
                accessorKey: 'document_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Received At',
                accessorKey: 'received_address',
                cell: (info) => info.getValue(),
            },
            {
                header: 'dispatched_by',
                accessorKey: 'dispatched_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Total QTY',
                accessorKey: 'total_quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Total SKU',
                accessorKey: 'total_sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Updated On',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => handleDeleteClick(row.original.id)}>
                        <FaTrash className="text-xl text-red-500" />
                    </button>
                ),
            },
        ],
        [handleDeleteClick],
    )
}
