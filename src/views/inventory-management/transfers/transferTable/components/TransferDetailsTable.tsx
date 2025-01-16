import EasyTable from '@/common/EasyTable'
import moment from 'moment'
import React from 'react'

interface GDNdetailProps {
    data: any[]
}

const TransferDetailsTable = ({ data }: GDNdetailProps) => {
    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'SKU',
            accessorKey: 'sku',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Size',
            accessorKey: 'size',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'quantity ',
            accessorKey: 'quantity',
        },
        {
            header: 'Inventory Transfer',
            accessorKey: 'inventory_transfer',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'synced to inventory',
            accessorKey: 'synced_to_inventory',
        },
        {
            header: 'create date',
            accessorKey: 'created_at',
            cell: ({ getValue }) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
        {
            header: 'update date',
            accessorKey: 'update_at',
            cell: ({ getValue }) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
    ].filter((column) => column.header && column.accessorKey)

    return (
        <div>
            <EasyTable mainData={data} columns={columns} noPage overflow />
        </div>
    )
}

export default TransferDetailsTable
