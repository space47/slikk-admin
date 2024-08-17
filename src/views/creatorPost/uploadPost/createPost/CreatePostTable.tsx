/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table'

type ProductTableProps = {
    data: {
        sku: string
        barcode: string
        product: string
        image: string[]
        brand: string
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
                header: 'Product',
                accessorKey: 'product_type',
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ getValue }) => (
                    <div className="flex gap-2">
                        <img
                            src={getValue() as string}
                            alt=""
                            className="w-[100px] h-[100px]"
                        />
                    </div>
                ),
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button
                        type="button"
                        onClick={() => handleActionClick(row.original.barcode)}
                        className="text-blue-500 hover:underline"
                    >
                        ADD
                    </button>
                ),
            },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-2 border-b text-sm text-gray-700"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CreatePostTable
