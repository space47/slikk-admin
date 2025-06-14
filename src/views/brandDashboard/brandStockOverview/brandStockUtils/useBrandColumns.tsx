import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { Stock } from '../brandStockCommon'
import moment from 'moment'

export const useBrandColumns = () => {
    return useMemo<ColumnDef<Stock>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'product.sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Product Name',
                accessorKey: 'product.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Brand',
                accessorKey: 'product.brand_name',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Color',
                accessorKey: 'product.color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Size',
                accessorKey: 'product.size',
                cell: (info) => info.getValue().toUpperCase(),
            },
            {
                header: ' Stock',
                accessorKey: 'quantity',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Expiry',
                accessorKey: 'expiry_date',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Batch Num',
                accessorKey: 'batch_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Created',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Updated',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
        ],
        [],
    )
}
