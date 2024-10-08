/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table'

type ProductTableProps = {
    data: any
    handleActionClick: (e: any) => void
}

const PageSettingsPostTable = ({ data, handleActionClick }: ProductTableProps) => {
    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: 'Name',
                accessorKey: 'caption',
            },
            {
                header: 'Creator Name',
                accessorKey: 'creator.name',
            },
            {
                header: 'Handle',
                accessorKey: 'creator.handle',
            },
            {
                header: 'Type',
                accessorKey: 'type',
            },
            {
                header: 'Image',
                accessorKey: 'thumbnail_url',
                cell: ({ getValue }) => (
                    <div className="flex gap-2">
                        <img src={getValue().split(',')[0]} alt="Image" className="w-[100px] h-[100px]" />
                    </div>
                ),
            },
            {
                header: 'Post Id',
                accessorKey: 'post_id',
            },
            // {
            //     header: 'Stocks',
            //     accessorKey: 'inventory_count',
            //     cell: (info) => info.getValue(),
            // },
            {
                header: 'ADD',
                accessorKey: '',
                cell: ({ row }) => (
                    <button
                        type="button"
                        onClick={() => handleActionClick(row.original.post_id)}
                        className="text-white bg-green-700 px-3 py-1 rounded-lg hover:bg-green-500"
                    >
                        <span className="text-sm">ADD</span>
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
        <div className="overflow-x-auto overflow-y-scroll scrollbar-hide">
            <table className="min-w-full bg-white">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-2 border-b text-sm text-gray-700">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PageSettingsPostTable
