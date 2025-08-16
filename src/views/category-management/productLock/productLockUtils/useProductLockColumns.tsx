/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export const useProductLockColumns = () => {
    const navigate = useNavigate()

    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'edit',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-transparent"
                        onClick={() => navigate(`/app/category/productLock/Edit/${row.original.id}`)}
                    >
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'Product Filter',
                accessorKey: 'product_filter',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Start Date',
                accessorKey: 'start_date',
                cell: ({ row }: any) => moment(row.original.start_date).format('YYYY-MM-DD HH:mm'),
            },
            {
                header: 'End Date',
                accessorKey: 'end_date',
                cell: ({ row }: any) => moment(row.original.end_date).format('YYYY-MM-DD HH:mm'),
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
            {
                header: 'Error Barcodes',
                accessorKey: 'error_barcodes',
                cell: ({ row }: any) =>
                    Object.keys(row.original.error_barcodes || {}).length > 0 ? JSON.stringify(row.original.error_barcodes) : '-',
            },
            {
                header: 'Products Count',
                accessorKey: 'products_count',
            },
            {
                header: 'Created At',
                accessorKey: 'create_date',
                cell: ({ row }: any) => moment(row.original.create_date).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                header: 'Updated At',
                accessorKey: 'update_date',
                cell: ({ row }: any) => moment(row.original.update_date).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                header: 'Locked By',
                accessorKey: 'locked_by',
            },
        ],
        [navigate],
    )
}
