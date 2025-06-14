/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { Product } from '../brandCatalogCommon'

interface props {
    handleOpenModal: (image: string) => void
}

export const useBrandCatalogColumns = ({ handleOpenModal }: props) => {
    return useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'Barcode',
                accessorKey: 'barcode',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Product Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ getValue, row }: { getValue: any; row: any }) =>
                    row.original.image && (
                        <img
                            src={getValue().split(',')[0]}
                            alt="Image"
                            className="w-18 h-20 object-cover cursor-pointer"
                            onClick={() => handleOpenModal(row.original.image)}
                        />
                    ),
            },
            {
                header: 'Price',
                accessorKey: 'mrp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Selling Price',
                accessorKey: 'sp',
                cell: (info) => info.getValue(),
            },
            // {
            //     header: 'Active',
            //     accessorKey: 'is_active',
            //     cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            // },
            {
                header: 'Division',
                accessorKey: 'division',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Sub Category',
                accessorKey: 'sub_category',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Product Type',
                accessorKey: 'product_type',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Try & Buy',
                accessorKey: 'is_try_and_buy',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            // {
            //     header: 'Trends',
            //     accessorKey: 'trends',
            //     cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            // },
            // {
            //     header: 'Action',
            //     accessorKey: 'action',
            //     cell: ({ row }) => (
            //         <Button onClick={() => handleActionClick(row.original)}>
            //             EDIT
            //         </Button>
            //     ),
            // },
        ],
        [],
    )
}
