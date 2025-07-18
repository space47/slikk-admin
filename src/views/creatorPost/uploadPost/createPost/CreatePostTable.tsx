/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import EasyTable from '@/common/EasyTable'

type ProductTableProps = {
    data: {
        sku: string
        barcode: string
        product: string
        image: string[]
        brand: string
        name: string
    }[]
    handleActionClick: (e: any) => void
}

const CreatePostTable = ({ data, handleActionClick }: ProductTableProps) => {
    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',
            },
            {
                header: 'Barcode',
                accessorKey: 'barcode',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Product',
                accessorKey: 'product_type',
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ getValue }: any) => (
                    <div className="flex gap-2">
                        <img src={getValue().split(',')[0]} alt="Image" className="w-[100px] h-[100px]" />
                    </div>
                ),
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
            },
            {
                header: 'Stocks',
                accessorKey: 'inventory_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'ADD',
                accessorKey: '',
                cell: ({ row }) => (
                    <button
                        type="button"
                        onClick={() => handleActionClick(row.original.barcode)}
                        className="text-white bg-green-700 px-3 py-1 rounded-lg hover:bg-green-500"
                    >
                        <span className="text-sm">ADD</span>
                    </button>
                ),
            },
        ],
        [],
    )

    return (
        <div className="overflow-x-auto overflow-y-scroll scrollbar-hide">
            <EasyTable noPage overflow mainData={data} columns={columns} />
        </div>
    )
}

export default CreatePostTable
