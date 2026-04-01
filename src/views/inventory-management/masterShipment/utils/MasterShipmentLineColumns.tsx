/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShipmentLineItems } from '@/store/types/masterShipment.types'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export const MasterShipmentLineColumns = () => {
    return useMemo<ColumnDef<ShipmentLineItems>[]>(
        () => [
            {
                header: 'SKU',
                name: 'sku',
                cell: ({ row }) => {
                    return <div>{row?.original.sku}</div>
                },
            },
            {
                header: 'Barcode',
                name: 'barcode',
                cell: ({ row }) => {
                    return <div>{row?.original.barcode || 'N/A'}</div>
                },
            },
            {
                header: 'Quantity Sent',
                name: 'quantity_sent',
                cell: ({ row }) => {
                    return <div>{row?.original.quantity_sent || 0}</div>
                },
            },
            {
                header: 'Quantity Received',
                name: 'quantity_received',
                cell: ({ row }) => {
                    return <div>{row?.original.quantity_received || 0}</div>
                },
            },
            {
                header: 'Catalog Available',
                name: 'catalog_available',
                cell: ({ row }) => {
                    return <div>{row?.original.catalog_available ? 'true' : 'false'}</div>
                },
            },
            {
                header: 'Box',
                name: 'box_number',
                cell: ({ row }) => {
                    const box =
                        typeof row?.original?.box_number === 'object'
                            ? JSON.stringify(row?.original?.box_number || {})
                            : row?.original?.box_number
                    return <div>{box}</div>
                },
            },
            {
                header: 'Create Date',
                name: 'create_date',
                cell: ({ row }) => {
                    return <div>{dayjs(row?.original.create_date).format('YYYY-MM-DD HH:mm:ss a')}</div>
                },
            },
            {
                header: 'Update Date',
                name: 'update_date',
                cell: ({ row }) => {
                    return <div>{dayjs(row?.original.update_date).format('YYYY-MM-DD HH:mm:ss a')}</div>
                },
            },

            {
                header: 'Last Updated By',
                name: 'last_updated_by',
                cell: ({ row }) => {
                    return <div>{row?.original.last_updated_by || 'N/A'}</div>
                },
            },
        ],
        [],
    )
}
