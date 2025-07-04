/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Product } from '../CommonType'
import { FaEdit, FaEye } from 'react-icons/fa'

interface props {
    handleOpenModal: (img: any) => void
    handleViewProducts: (row: any) => void
}

export const useProductColumns = ({ handleOpenModal, handleViewProducts }: props) => {
    return useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none">
                        <a href={`/app/catalog/products/${row.original.barcode}`} target="_blank" rel="noreferrer">
                            {' '}
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </button>
                ),
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => handleViewProducts(row?.original)}>
                        <FaEye className="text-xl text-yellow-500" />
                    </button>
                ),
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Barcode',
                accessorKey: 'barcode',
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
                cell: ({ row }: any) => {
                    const imageUrl = row?.original?.thumbnail ? row?.original?.thumbnail.split(',')[0] : row?.original?.image.split(',')[0]
                    return (
                        <>
                            <img
                                src={imageUrl}
                                alt="Image"
                                className="w-24 h-20 object-cover cursor-pointer"
                                onClick={() => handleOpenModal(row.original.image)}
                            />
                        </>
                    )
                },
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
                header: 'Stocks',
                accessorKey: 'inventory_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'COLOR',
                accessorKey: 'color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'COLOR Family',
                accessorKey: 'filter_tags.colorfamily',
                cell: ({ getValue }: any) => {
                    return (
                        <div>
                            {getValue()
                                ?.map((item: any) => item)
                                .join(',') ?? 'N/A'}
                        </div>
                    )
                },
            },
            {
                header: 'SIZE',
                accessorKey: 'size',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    )
}
