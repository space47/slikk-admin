import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { Product } from '../sellerCommon'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export const useSellerColumns = () => {
    const navigate = useNavigate()
    return useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button onClick={() => navigate(`/app/sellers/${row?.original?.id}`)} className="border-none bg-none">
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Seller Code',
                accessorKey: 'code',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Registered Name',
                accessorKey: 'registered_name',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Alternate Contact Number',
                accessorKey: 'alternate_contact_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'GSTIN',
                accessorKey: 'gstin',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC',
                accessorKey: 'poc',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC Email',
                accessorKey: 'poc_email',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Contact Number',
                accessorKey: 'contact_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Address',
                accessorKey: 'address',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },

            {
                header: 'Is Active',
                accessorKey: 'is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },

            {
                header: 'Segment',
                accessorKey: 'segment',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
        ],
        [],
    )
}
