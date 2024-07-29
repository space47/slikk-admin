import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    useGlobalFilter,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'

interface LastUpdatedBy {
    name: string
    mobile: string
    email: string
}

interface Product {
    product: number
    store: number
    quantity: number
    last_updated_by: LastUpdatedBy
    show_out_of_stock: boolean
    is_active: boolean
    offer_is_active: boolean
    expiry_date: string
    batch_number: string
    create_date: string
    update_date: string
    grn: any
    id: number
}

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const BrandStock = () => {
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    // const [cid,setCId] = useState<Product>()

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axiosInstance.get(
                `inventory?p=${page}&page_size=${pageSize}`,
            )
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize])

    const getUploadStatus = (is_active: any) => {
        if (is_active == true) {
            return 'Yes'
        } else {
            return 'No'
        }
    }

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'Product ID',
                accessorKey: 'product',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Store Number',
                accessorKey: 'store',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QTY',
                accessorKey: 'quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Name',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Email',
                accessorKey: 'last_updated_by.email',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Ph. No',
                accessorKey: 'last_updated_by.mobile',
                cell: (info) => info.getValue(),
            },
            {
                header: ' In Stock',
                accessorKey: 'show_out_of_stock',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Active',
                accessorKey: 'is_active',
                cell: (info) => getUploadStatus(info.getValue()),
            },
            {
                header: 'Offer Active',
                accessorKey: ' offer_is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
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
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                ),
            },
            {
                header: 'Updated',
                accessorKey: 'update_date',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                ),
            },
            {
                header: 'GRN number',
                accessorKey: 'grn',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(totalData / pageSize),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
            globalFilter,
        },
        onPaginationChange: ({ pageIndex, pageSize }) => {
            setPage(pageIndex + 1)
            setPageSize(pageSize)
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search here"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalData}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find(
                            (option) => option.value === pageSize,
                        )}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default BrandStock
