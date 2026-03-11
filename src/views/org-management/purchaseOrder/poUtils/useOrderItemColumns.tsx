/* eslint-disable @typescript-eslint/no-explicit-any */
import { PurchaseOrderItem } from '@/store/types/po.types'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'

interface Props {
    handleEditRow?: (x: PurchaseOrderItem) => void
}

export const useOrderItemColumns = ({ handleEditRow }: Props) => {
    return useMemo<ColumnDef<PurchaseOrderItem>[]>(() => {
        const baseColumns: ColumnDef<PurchaseOrderItem>[] = [
            {
                header: 'sku',
                accessorKey: 'sku',
                cell: ({ row }) => <div>{row.original.sku || '-'}</div>,
            },
            {
                header: 'name',
                accessorKey: 'name',
                cell: ({ row }) => <div>{row.original.name || '-'}</div>,
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
                cell: ({ row }) => <div className="font-semibold text-blue-600">{row.original.quantity ?? 0}</div>,
            },
            {
                header: 'Available',
                accessorKey: 'available_quantity',
                cell: ({ row }) => <div>{row.original.available_quantity ?? 0}</div>,
            },
            {
                header: 'Fulfilled',
                accessorKey: 'fulfilled_quantity',
                cell: ({ row }) => <div>{row.original.fulfilled_quantity ?? 0}</div>,
            },
            {
                header: 'Pending',
                accessorKey: 'pending_quantity',
                cell: ({ row }) => <div>{row.original.pending_quantity ?? 0}</div>,
            },
            {
                header: 'Supplier MRP',
                accessorKey: 'supplier_mrp',
                cell: ({ row }) => <div>₹ {row.original.supplier_mrp ?? '0.00'}</div>,
            },
            {
                header: 'Item Value',
                accessorKey: 'item_value',
                cell: ({ row }) => <div>₹ {row.original.item_value ?? '0.00'}</div>,
            },
            {
                header: 'Tax %',
                accessorKey: 'tax_percentage',
                cell: ({ row }) => <div>{row.original.tax_percentage ?? 0}%</div>,
            },
            {
                header: 'Tax Amount',
                accessorKey: 'tax_amount',
                cell: ({ row }) => <div>₹ {row.original.tax_amount ?? '0.00'}</div>,
            },
            {
                header: 'Total Value',
                accessorKey: 'total_value',
                cell: ({ row }) => <div className="font-semibold">₹ {row.original.total_value ?? '0.00'}</div>,
            },
        ]

        if (handleEditRow) {
            baseColumns.unshift({
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => <FaEdit className="text-xl text-blue-500 cursor-pointer" onClick={() => handleEditRow(row.original)} />,
            })
        }

        return baseColumns
    }, [handleEditRow])
}
