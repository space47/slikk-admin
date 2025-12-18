import { LiveZones } from '@/store/types/riderZone.type'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface props {
    handleDelete: (x: number) => void
}

export const useRiderZoneColumns = ({ handleDelete }: props) => {
    const navigate = useNavigate()

    return useMemo<ColumnDef<LiveZones>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <span>
                        <FaEdit className="text-xl text-blue-500" onClick={() => navigate(`/app/riderZone/${row?.original?.id}`)} />
                    </span>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => row.original.name,
            },
            {
                header: 'Code',
                accessorKey: 'code',
                cell: ({ row }) => row.original.code,
            },
            {
                header: 'Is Active',
                accessorKey: 'is_active',
                cell: ({ row }) => <span>{row.original.is_active ? 'Active' : 'Inactive'}</span>,
            },
            {
                header: 'Created By',
                accessorKey: 'created_by',
                cell: ({ row }) => row.original.created_by,
            },
            {
                header: 'Updated By',
                accessorKey: 'updated_by',
                cell: ({ row }) => row.original.updated_by,
            },
            {
                header: 'Created Date',
                accessorKey: 'created_at',
                cell: ({ row }) => <span>{moment(row.original.created_at).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Updated Date',
                accessorKey: 'updated_at',
                cell: ({ row }) => <span>{moment(row.original.updated_at).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Delete Zone',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <div onClick={() => handleDelete(row?.original?.id)}>
                        <FaTrash className="text-xl text-red-400" />
                    </div>
                ),
            },
        ],
        [],
    )
}
