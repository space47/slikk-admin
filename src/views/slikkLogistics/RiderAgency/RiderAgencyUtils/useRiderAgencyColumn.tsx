import { DeliveryAgency } from '@/store/types/deliveryAgencyTypes'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'

export const useRiderAgencyColumn = () => {
    return useMemo<ColumnDef<DeliveryAgency>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <a
                        href={`/app/riderAgency/edit/${row?.original?.id}`}
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
                header: 'Agency Name',
                accessorKey: 'name',
            },
            {
                header: 'Registered Name',
                accessorKey: 'registered_name',
                cell: ({ row }) => row.original.registered_name || '-',
            },
            {
                header: 'Domains',
                accessorKey: 'agency_domains',
                cell: ({ row }) => row.original.agency_domains || '-',
            },
            {
                header: 'POC Name',
                accessorKey: 'poc_name',
                cell: ({ row }) => row.original.poc_name || '-',
            },
            {
                header: 'POC Mobile',
                accessorKey: 'poc_mobile',
                cell: ({ row }) => row.original.poc_mobile || '-',
            },
            {
                header: 'POC Email',
                accessorKey: 'poc_email',
                cell: ({ row }) => row.original.poc_email || '-',
            },
            {
                header: 'GSTIN',
                accessorKey: 'gstin',
                cell: ({ row }) => row.original.gstin || '-',
            },
            {
                header: 'CIN',
                accessorKey: 'cin',
                cell: ({ row }) => row.original.cin || '-',
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                            row.original.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {row.original.is_active ? 'Active' : 'Inactive'}
                    </span>
                ),
            },
            {
                header: 'Created At',
                accessorKey: 'create_date',
                cell: ({ row }) => (row.original.create_date ? moment(row.original.create_date).format('YYYY-MM-DD HH:mm:ss') : '-'),
            },
            {
                header: 'Updated At',
                accessorKey: 'update_date',
                cell: ({ row }) => (row.original.update_date ? moment(row.original.update_date).format('YYYY-MM-DD HH:mm:ss') : '-'),
            },
            {
                header: 'Last Updated By',
                accessorKey: 'last_updated_by',
                cell: ({ row }) => row.original.last_updated_by || '-',
            },
        ],
        [],
    )
}
