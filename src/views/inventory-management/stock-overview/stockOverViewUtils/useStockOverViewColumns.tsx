/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { Stock } from '../stockOverviewCommon'
import { FaSync } from 'react-icons/fa'
import moment from 'moment'

interface props {
    handleUpdate: (id: any, originalQuantity: any, originalLocation: any) => Promise<void>
    handleOpenModal: (img: string) => void
    updatedLocation: {
        [key: number]: string
    }
    handleLocationChange: (id: number, newLocation: string) => void
    locationInputRef: React.MutableRefObject<{
        [key: number]: HTMLInputElement | null
    }>
    updatedQuantities: {
        [key: number]: number
    }
    handleQuantityChange: (id: number, X: number) => void
    qtyInputRef: React.MutableRefObject<{
        [key: number]: HTMLInputElement | null
    }>
}

export const useStockOverViewColumns = ({
    handleUpdate,
    handleOpenModal,
    updatedLocation,
    handleLocationChange,
    locationInputRef,
    handleQuantityChange,
    qtyInputRef,
    updatedQuantities,
}: props) => {
    return useMemo<ColumnDef<Stock>[]>(
        () => [
            {
                header: 'Update Row',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button
                        onClick={() => handleUpdate(row.original.id, row.original.quantity, row.original.location)}
                        className="px-4 py-2 bg-none text-2xl rounded font-bold text-green-600"
                    >
                        <FaSync />
                    </button>
                ),
            },
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
                header: 'Image',
                accessorKey: 'product.image',
                cell: ({ getValue, row }: any) => (
                    <img
                        src={getValue().split(',')[0]}
                        alt="Image"
                        className="w-24 h-20 object-cover cursor-pointer"
                        onClick={() => handleOpenModal(row.original.product.image)}
                    />
                ),
            },
            {
                header: 'Store Number',
                accessorKey: 'store',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: ({ row }) => {
                    const stockId = row.original.id
                    return (
                        <input
                            type="text"
                            className="rounded-xl w-[150px]"
                            value={updatedLocation[stockId] ?? row.original.location}
                            onChange={(e) => handleLocationChange(stockId, e.target.value)}
                            ref={(el) => (locationInputRef.current[stockId] = el)}
                        />
                    )
                },
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
                cell: ({ getValue }: any) => <span>{getValue()?.toUpperCase() || 'N/A'}</span>,
            },
            {
                header: 'Stock',
                accessorKey: 'quantity',
                cell: ({ row }) => {
                    const stockId = row.original.id
                    return (
                        <input
                            className="w-[70px] rounded-xl"
                            type="number"
                            value={updatedQuantities[stockId] ?? row.original.quantity}
                            onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
                            ref={(el) => (qtyInputRef.current[stockId] = el)}
                        />
                    )
                },
            },
            //
            {
                header: 'Quantity Ordered',
                accessorKey: 'quantity_ordered',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity Received',
                accessorKey: 'quantity_received',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity Returned',
                accessorKey: 'quantity_returned',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity Sold',
                accessorKey: 'quantity_sold',
                cell: (info) => info.getValue(),
            },
            //
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
            {
                header: 'GRN number',
                accessorKey: 'grn',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue(),
            },
        ],
        [updatedQuantities, updatedLocation],
    )
}
