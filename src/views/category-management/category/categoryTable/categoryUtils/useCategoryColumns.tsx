import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { categoryItem } from '../categoryCommon'
import { Button } from '@/components/ui'
import { FaEdit, FaTrash } from 'react-icons/fa'
import moment from 'moment'

interface props {
    handleDeleteClick: (id: number) => void
}

export const useCategoryColumns = ({ handleDeleteClick }: props) => {
    return useMemo<ColumnDef<categoryItem>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <Button className="bg-none border-none">
                        <a href={`/app/category/category/${row.original.id}`}>
                            {' '}
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </Button>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: (info) => <img src={info.getValue() as string} alt="product" width="50" />,
            },
            {
                header: 'Division',
                accessorKey: 'division_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Product Count',
                accessorKey: 'count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Division Name',
                accessorKey: 'division_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Footer',
                accessorKey: 'footer',
                cell: (info) => {
                    return (
                        <div className="w-[200px] h-[70px] overflow-hidden">
                            <div
                                className="text-ellipsis whitespace-wrap line-clamp-3 overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: info.getValue() as string }}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Quick Filter Tags',
                accessorKey: 'quick_filter_tags',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Position',
                accessorKey: 'position',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Gender',
                accessorKey: 'gender',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Active',
                accessorKey: 'is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Try_&_Buy',
                accessorKey: 'is_try_and_buy',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Last Updated By',
                accessorKey: 'last_updated_by',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => handleDeleteClick(row.original.id)}>
                        <FaTrash className="text-xl text-red-600" />
                    </button>
                ),
            },
        ],
        [],
    )
}
