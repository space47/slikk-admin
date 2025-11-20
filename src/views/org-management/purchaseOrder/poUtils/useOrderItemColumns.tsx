/* eslint-disable @typescript-eslint/no-explicit-any */
import { PurchaseOrderItem } from '@/store/types/po.types'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'

interface Props {
    handleEditRow: (x: PurchaseOrderItem) => void
}

export const useOrderItemColumns = ({ handleEditRow }: Props) => {
    return useMemo<ColumnDef<PurchaseOrderItem>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => <div>{<FaEdit onClick={() => handleEditRow(row?.original)} />}</div>,
            },
            {
                header: 'vendor Sku',
                accessorKey: 'vendor_sku',
                cell: ({ row }) => <div>{row.original.vendor_sku || '-'}</div>,
            },

            {
                header: 'Slikk Sku',
                accessorKey: 'slikk_sku',
                cell: ({ row }) => <div>{row.original.slikk_sku || '-'}</div>,
            },

            {
                header: 'Item Name',
                accessorKey: 'title',
                cell: ({ row }) => <div>{row.original.title || '-'}</div>,
            },

            {
                header: 'Category',
                accessorKey: 'category',
                cell: ({ row }) => <div>{row.original.category || '-'}</div>,
            },

            {
                header: 'HSN',
                accessorKey: 'hsn_code',
                cell: ({ row }) => <div className="max-w-[250px]">{row.original.hsn_code || '-'}</div>,
            },

            {
                header: 'Quantity',
                accessorKey: 'quantity',
                cell: ({ row }) => <div className="font-semibold text-blue-600">{row.original.quantity || '-'}</div>,
            },

            {
                header: 'Unit Price',
                accessorKey: 'item_value',
                cell: ({ row }) => <div>{row.original.item_value || '-'}</div>,
            },

            {
                header: 'Tax Type',
                accessorKey: 'tax_type',
                cell: ({ row }) => <div>{row.original.tax_type || '-'}</div>,
            },

            {
                header: 'Tax %',
                accessorKey: 'tax_percentage',
                cell: ({ row }) => <div>{row.original.tax_percentage || '-'}</div>,
            },

            {
                header: 'Total Amount',
                accessorKey: 'total_value',
                cell: ({ row }) => <div>₹ {row.original.total_value || '0.00'}</div>,
            },
        ],
        [],
    )
}
