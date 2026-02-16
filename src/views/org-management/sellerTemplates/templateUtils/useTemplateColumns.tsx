import { SellerTemplateData } from '@/store/types/sellerTemplate.types'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface Props {
    handleViewTemplate: (x: string) => void
}

export const useTemplateColumns = ({ handleViewTemplate }: Props) => {
    const navigate = useNavigate()

    return useMemo<ColumnDef<SellerTemplateData>[]>(
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
                cell: ({ row }) => <div>{row.original.name || '-'}</div>,
            },
            {
                header: 'Subject',
                accessorKey: 'email_subject',
                cell: ({ row }) => <div className="font-semibold text-blue-600">{row.original.email_subject ?? '-'}</div>,
            },
            {
                header: 'Body',
                accessorKey: 'email_body',
                cell: ({ row }) => <div className="text-gray-700 line-clamp-3 max-w-md">{row.original.email_body || '-'}</div>,
            },
            {
                header: 'View',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <span>
                        <FaEye className="text-xl text-blue-500" onClick={() => handleViewTemplate(row?.original?.email_body)} />
                    </span>
                ),
            },
        ],
        [navigate],
    )
}
