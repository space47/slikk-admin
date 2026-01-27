import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import { ReturnData } from '@/store/types/returnOrderData.types'

export const ReturnItemColumns = () => {
    return useMemo<ColumnDef<ReturnData>[]>(
        () => [
            {
                header: 'Item ID',
                accessorKey: 'return_order_item',
                cell: ({ row }) => <div>{row.original.return_order_item || '-'}</div>,
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }) => <div>{row.original.sku || '-'}</div>,
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
                cell: ({ row }) => <div>{row.original.quantity}</div>,
            },
            {
                header: 'QC Passed',
                accessorKey: 'qc_passed',
                cell: ({ row }) => <div>{row.original.qc_passed}</div>,
            },
            {
                header: 'QC Failed',
                accessorKey: 'qc_failed',
                cell: ({ row }) => <div>{row.original.qc_failed}</div>,
            },
            {
                header: 'Refurbished',
                accessorKey: 'refurbished',
                cell: ({ row }) => <div>{row.original.refurbished}</div>,
            },
            {
                header: 'Synced Qty',
                accessorKey: 'synced_quantity',
                cell: ({ row }) => <div>{row.original.synced_quantity}</div>,
            },
            {
                header: 'Inventory Sync Error',
                accessorKey: 'inventory_sync_error',
                cell: ({ row }) => (
                    <div>{row.original.inventory_sync_error?.length > 0 ? row.original.inventory_sync_error.length : '-'}</div>
                ),
            },
            // {
            //     header: 'Last Updated By',
            //     accessorKey: 'last_updated_by',
            //     cell: ({ row }) => {
            //         const updater = row.original.last_updated_by
            //         return <div>{updater && Object.keys(updater).length > 0 ? Object.values(updater).join(', ') : '-'}</div>
            //     },
            // },
            {
                header: 'Created At',
                accessorKey: 'create_date',
                cell: ({ row }) => (
                    <div>{row.original.create_date ? moment(row.original.create_date).format('DD MMM YYYY, hh:mm A') : '-'}</div>
                ),
            },
            {
                header: 'Updated At',
                accessorKey: 'update_date',
                cell: ({ row }) => (
                    <div>{row.original.update_date ? moment(row.original.update_date).format('DD MMM YYYY, hh:mm A') : '-'}</div>
                ),
            },
        ],
        [],
    )
}
