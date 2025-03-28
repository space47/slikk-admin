/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'

export const InwardColumns = () => {
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button className="border-none bg-none">
                        <a href={`/app/goods/received/edit/${row.original.grn_number}`} target="_blank" rel="noreferrer">
                            {' '}
                            <FaEdit className="text-xl text-blue-500" />
                        </a>
                    </button>
                ),
            },
            {
                header: 'GRN Number',
                accessorKey: 'grn_number',
                cell: ({ row }: any) => (
                    <div
                        // onClick={() => handleGRNClick(row.original.grn_number, row.original.company)}
                        className="cursor-pointer bg-gray-200 px-3 py-3 rounded-md text-black font-semibold"
                    >
                        <a href={`/app/goods/received/${row.original.company}/${row.original.grn_number}`} target="_blank" rel="noreferrer">
                            {row.original.grn_number}
                        </a>
                    </div>
                ),
            },
            {
                header: 'Document Number',
                accessorKey: 'document_number',
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
                cell: (info) => info.getValue(),
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
                header: 'Received By',
                accessorKey: 'received_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Slikk Owned',
                accessorKey: 'slikk_owned',
                cell: (info) => (info.getValue() ? 'YES' : 'NO'),
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
        ],
        [],
    )
}
