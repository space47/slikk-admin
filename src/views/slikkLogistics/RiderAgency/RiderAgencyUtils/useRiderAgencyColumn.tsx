import { DeliveryAgency } from '@/store/types/deliveryAgencyTypes'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'

interface Props {
    setStoreId: (x: number) => void
    setAgencyAction: (x: 'add' | 'edit' | null) => void
}

export const useRiderAgencyColumn = ({ setAgencyAction, setStoreId }: Props) => {
    return useMemo<ColumnDef<DeliveryAgency>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => {
                    return (
                        <div
                            onClick={() => {
                                setStoreId(row?.original?.id)
                                setAgencyAction('edit')
                            }}
                        >
                            <FaEdit className="text-xl text-blue-500 cursor-pointer" />
                        </div>
                    )
                },
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Delivery Type',
                accessorKey: 'delivery_type',
            },
            {
                header: 'Active Status',
                accessorKey: 'is_active',
                cell: ({ row }) => <span>{row?.original?.is_active ? 'Active' : 'In-Active'}</span>,
            },
            {
                header: 'Client Id',
                accessorKey: 'client_id',
            },
            // {
            //     header: 'Client Secret',
            //     accessorKey: 'client_secret',
            // },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ row }) => <div>{moment(row?.original?.create_date).format('YYYY-MM-DD HH:mm:ss a')}</div>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ row }) => <div>{moment(row?.original?.update_date).format('YYYY-MM-DD HH:mm:ss a')}</div>,
            },
        ],
        [],
    )
}
