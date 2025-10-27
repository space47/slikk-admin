/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import moment from 'moment'
import { Rtv_Data } from '@/store/types/rtv.types'
import { FaEdit } from 'react-icons/fa'

interface Props {
    storeList: USER_PROFILE_DATA['store']
}

export const useRtvColumns = ({ storeList }: Props) => {
    const findStoreName = (storeId: number) => {
        const store = storeList.find((store) => store?.id === storeId)
        return store ? store.name : 'Unknown Store'
    }

    return useMemo<ColumnDef<Rtv_Data>[]>(
        () => [
            {
                header: 'Edit RTV',
                accessorKey: 'rtv_id',
                cell: ({ row }) => (
                    <a href={`/app/goods/rtv/edit/${row.original.id}`} target="_blank" rel="noopener noreferrer">
                        <FaEdit className="text-xl text-blue-500" />
                    </a>
                ),
            },
            {
                header: 'RTV Number',
                accessorKey: 'rtv_number',
                cell: ({ row }) => (
                    <a
                        className="w-[180px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                        href={`/app/goods/rtvDetails/${row.original.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {row.original.rtv_number || 'N/A'}
                    </a>
                ),
            },
            {
                header: 'Document No.',
                accessorKey: 'document_number',
                cell: ({ row }) => <span>{row.original.document_number || '-'}</span>,
            },
            {
                header: 'Origin Address',
                accessorKey: 'origin_address',
                cell: ({ row }) => <span>{row.original.origin_address || '-'}</span>,
            },
            {
                header: 'Destination Address',
                accessorKey: 'destination_address',
                cell: ({ row }) => <span>{row.original.destination_address || '-'}</span>,
            },
            {
                header: 'Document Date',
                accessorKey: 'document_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Total SKU',
                accessorKey: 'total_sku',
                cell: ({ row }) => <span>{row.original.total_sku}</span>,
            },
            {
                header: 'Total Quantity',
                accessorKey: 'total_quantity',
                cell: ({ row }) => <span>{row.original.total_quantity}</span>,
            },
            {
                header: 'Store',
                accessorKey: 'store',
                cell: ({ row }) => <span>{findStoreName(row.original.store)}</span>,
            },
            {
                header: 'Created On',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Updated On',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [storeList],
    )
}
