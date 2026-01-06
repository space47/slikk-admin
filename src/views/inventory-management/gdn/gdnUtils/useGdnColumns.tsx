import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import { GDNDetails } from '@/store/types/gdn.types'

interface props {
    handleDeleteClick: (x: number) => void
}

export const useGdnColumns = ({ handleDeleteClick }: props) => {
    return useMemo<ColumnDef<GDNDetails>[]>(
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
                header: 'Indent No.',
                accessorKey: 'intent_number',
                cell: ({ row }) =>
                    row?.original?.indent_id ? (
                        <>
                            <a
                                className="w-[230px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                                href={`/app/goods/indentDetails/${row.original.indent_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {row.original.indent_number}
                            </a>
                        </>
                    ) : (
                        <span className="text-red-500">No Indent Found</span>
                    ),
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
