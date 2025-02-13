/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import PageCommon from '@/common/PageCommon'

interface props {
    nameInput: string
    handleActionClick: any
}

const MoreDataTable = ({ nameInput, handleActionClick }: props) => {
    const [productData, setProductData] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)

    const fetchProuctData = async () => {
        try {
            const response = await axioisInstance.get(`merchant/products?dashboard=true&name=${nameInput}&p=${page}&page_size=${pageSize}`)
            const data = response.data.data
            setProductData(data?.results)
            setTotalCount(data?.count)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (nameInput) {
            fetchProuctData()
        }
    }, [nameInput, page, pageSize])

    const columns = useMemo(
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
                cell: ({ getValue }) => (
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
                cell: ({ row }: any) => (
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

    const table = useReactTable({
        data: productData,
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
            <div>
                <PageCommon page={page} pageSize={pageSize} totalData={totalCount} setPage={setPage} setPageSize={setPageSize} />
            </div>
        </div>
    )
}

export default MoreDataTable
