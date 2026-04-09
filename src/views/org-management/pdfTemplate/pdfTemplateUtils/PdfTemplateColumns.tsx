/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface Props {
    handleViewTemplate: (x: string) => void
}

export const PdfTemplateColumns = ({ handleViewTemplate }: Props) => {
    const navigate = useNavigate()

    return useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button
                        onClick={() => navigate(`/app/pdfTemplate/${row?.original?.id}`)}
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
                header: 'Description',
                accessorKey: 'description',
                cell: ({ row }) => <div>{row.original.description || '-'}</div>,
            },
            {
                header: 'Body Message',
                accessorKey: 'template_data',
                cell: ({ row }) => <div className="text-gray-700 line-clamp-3 max-w-md">{row.original.template_data || '-'}</div>,
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
                        <FaEye className="text-xl text-blue-500" onClick={() => handleViewTemplate(row?.original?.template_data)} />
                    </span>
                ),
            },
        ],
        [navigate],
    )
}
