/* eslint-disable @typescript-eslint/no-explicit-any */
import { RiderPayout } from '@/store/types/riderPayout.types'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'

const JsonCell = ({ data }: { data: any }) => {
    if (!data || typeof data !== 'object') {
        return <span className="text-gray-400">--</span>
    }

    const formatted = JSON.stringify(data, null, 2)

    return (
        <div
            className="max-w-[250px] max-h-[80px] overflow-hidden text-xs bg-gray-50 p-2 rounded border line-clamp-3 cursor-pointer"
            title={formatted} // hover tooltip
        >
            {formatted}
        </div>
    )
}

export const RiderPayoutColumns = () => {
    return useMemo<ColumnDef<RiderPayout>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <a
                        href={`/app/riderPayout/edit/${row?.original?.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center"
                    >
                        <FaEdit className="text-lg text-blue-500 hover:text-blue-700 transition" />
                    </a>
                ),
                size: 60,
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <div className="max-w-[180px] truncate" title={row.original.name}>
                        {row.original.name || '--'}
                    </div>
                ),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: ({ row }) => (
                    <div className="max-w-[220px] line-clamp-2 text-gray-600" title={row.original.description}>
                        {row.original.description || '--'}
                    </div>
                ),
            },
            {
                header: 'Currency',
                accessorKey: 'commercial_details.currency',
                cell: ({ row }) => <span className="font-medium">{row.original.commercial_details?.currency || '--'}</span>,
            },
            {
                header: 'Incentives',
                accessorKey: 'commercial_details.incentives',
                cell: ({ row }) => <JsonCell data={row.original.commercial_details?.incentives} />,
            },
            {
                header: 'Penalties',
                accessorKey: 'commercial_details.penalties',
                cell: ({ row }) => <JsonCell data={row.original.commercial_details?.penalties} />,
            },
            {
                header: 'Base Payout',
                accessorKey: 'commercial_details.base_payout',
                cell: ({ row }) => (
                    <span className="font-semibold text-green-600">{row.original.commercial_details?.base_payout ?? '--'}</span>
                ),
            },
            {
                header: 'Created By',
                accessorKey: 'created_by',
                cell: ({ row }) => <span>{row.original.created_by || '--'}</span>,
            },
            {
                header: 'Created Date',
                accessorKey: 'created_date',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-500">
                        {row.original.create_date ? moment(row.original.create_date).format('YYYY-MM-DD hh:mm a') : '--'}
                    </span>
                ),
            },
            {
                header: 'Updated Date',
                accessorKey: 'updated_date',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-500">
                        {row.original.update_date ? moment(row.original.update_date).format('YYYY-MM-DD hh:mm a') : '--'}
                    </span>
                ),
            },
        ],
        [],
    )
}
