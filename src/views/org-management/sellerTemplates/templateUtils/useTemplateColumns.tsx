import { NotificationConfigData } from '@/store/types/sellerTemplate.types'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface Props {
    handleViewTemplate: (x: string) => void
}

export const useTemplateColumns = ({ handleViewTemplate }: Props) => {
    const navigate = useNavigate()

    return useMemo<ColumnDef<NotificationConfigData>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button
                        onClick={() => navigate(`/app/sellerTemplate/${row?.original?.id}`)}
                        className="border-none bg-transparent hover:opacity-80"
                    >
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => <div>{row.original.event_name || '-'}</div>,
            },
            {
                header: 'Title',
                accessorKey: 'title',
                cell: ({ row }) => <div>{row.original.title || '-'}</div>,
            },
            {
                header: 'Notification Type',
                accessorKey: 'email_subject',
                cell: ({ row }) => <div className="font-semibold text-blue-600">{row.original.notification_type ?? '-'}</div>,
            },
            {
                header: 'Body Message',
                accessorKey: 'message',
                cell: ({ row }) => <div className="text-gray-700 line-clamp-3 max-w-md">{row.original.message || '-'}</div>,
            },
            {
                header: 'Is Active',
                accessorKey: 'is_active',
                cell: ({ row }) => <div className="text-gray-700 line-clamp-3 max-w-md">{row.original.is_active ? 'YES' : 'NO'}</div>,
            },
            {
                header: 'View',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <span>
                        <FaEye className="text-xl text-blue-500" onClick={() => handleViewTemplate(row?.original?.message)} />
                    </span>
                ),
            },
        ],
        [navigate],
    )
}
