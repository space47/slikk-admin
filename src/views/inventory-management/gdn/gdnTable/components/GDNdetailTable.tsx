import EasyTable from '@/common/EasyTable'
import moment from 'moment'
import React from 'react'

interface GDNdetailProps {
    data: any[]
}

const GDNdetailTable = ({ data }: GDNdetailProps) => {
    const columns = [
        {
            header: 'Updated By',
            accessorKey: 'last_updated_by.mobile',
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
            header: 'quantity sent',
            accessorKey: 'quantity_sent',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'quantity received',
            accessorKey: 'quantity_received',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'term completion count',
            accessorKey: 'term_completion_count',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'batch number',
            accessorKey: 'batch_number',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'synced to inventory',
            accessorKey: 'synced_to_inventory',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'create date',
            accessorKey: 'create_date',
            cell: ({ getValue }) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
        {
            header: 'update date',
            accessorKey: 'update_date',
            cell: ({ getValue }) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
    ]

    return (
        <div>
            <EasyTable mainData={data} columns={columns} noPage overflow />
        </div>
    )
}

export default GDNdetailTable
