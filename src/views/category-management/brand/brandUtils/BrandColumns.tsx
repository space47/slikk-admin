/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import moment from 'moment'
import { useMemo } from 'react'
import { FaEdit, FaSync } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

interface BrandColumnProps {
    handleSyncBrand: (name: string) => void
    handleDeleteBrand: (id: number) => void
}

export const BrandColumns = ({ handleDeleteBrand, handleSyncBrand }: BrandColumnProps) => {
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }: any) => (
                    <Button className="bg-none border-none">
                        <a href={`/app/category/brand/${row.original.id}`}>
                            {' '}
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </Button>
                ),
            },
            {
                header: 'Sync',
                accessorKey: 'name',
                cell: ({ row }: any) => (
                    <Button className="bg-none border-none" onClick={() => handleSyncBrand(row?.original?.name)}>
                        <FaSync className="text-yellow-500 text-xl" />
                    </Button>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Logo',
                accessorKey: 'logo',
                cell: (info) => <img src={info.getValue() as string} alt="product" width="50" />,
            },
            {
                header: 'Top',
                accessorKey: 'is_top',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Exclusive',
                accessorKey: 'is_exclusive',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Private',
                accessorKey: 'is_private',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
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
                header: 'Try and Buy',
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
                accessorKey: '',
                cell: ({ row }: any) => {
                    return (
                        <div>
                            <button onClick={() => handleDeleteBrand(row?.original?.id)}>
                                <MdDelete className="text-xl text-red-600" />
                            </button>
                        </div>
                    )
                },
            },
        ],
        [],
    )
}
