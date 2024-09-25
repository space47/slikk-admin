/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    // useGlobalFilter,
    PaginationState,
    Updater,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

interface Product {
    barcode: string
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    trends: any | null
    styles: any | null
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    variants: any[]
}

interface Post {
    id: number
    url: string
    products: Product[]
    post_id: string
    caption: string
    type: string
    latitude: string
    longitude: string
    likes_count: number
    comments_count: number
    clicks_count: number
    unique_clicks_count: number
    views_count: number
    thumbnail_url: string
    low_res_url: string
    video_url: string
    video_low_bandwidth_url: string
    video_low_res_url: string
    is_active: boolean
    create_date: string
    update_date: string
    approval_status: string
    owner: string
}

type Option = {
    value: number
    label: string
}

interface PendingProps {
    data: Post[]
    totalData: number | undefined
    page: number
    pageSize: number
    setPage: (page: number) => void
    setPageSize: (size: number) => void
    globalFilter: string
    setGlobalFilter: (name: string) => void
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const Accepted: React.FC<PendingProps> = ({ data, totalData, page, pageSize, setPage, setPageSize, globalFilter, setGlobalFilter }) => {
    const navigate = useNavigate()

    const handlePostClick = (id: number, post_id: string, owner: any) => {
        navigate(`/app/postApproval/approved/${id}?post_id=${post_id}&owner=${owner}`)
    }

    const columns = useMemo<ColumnDef<Post>[]>(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Post ID',
                accessorKey: 'post_id',
                cell: ({ row, getValue }) => (
                    <div
                        className="cursor-pointer bg-gray-300 px-4 py-1 rounded-xl text-gray-500 font-semibold"
                        onClick={() => handlePostClick(row.original.id, getValue() as string, row.original.owner)}
                    >
                        {getValue() as string}
                    </div>
                ),
            },
            {
                header: 'URL',
                accessorKey: 'url',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Caption',
                accessorKey: 'caption',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Thumbnail',
                accessorKey: 'thumbnail_url',
                cell: (info) => <img src={info.getValue() as string} alt="Thumbnail" />,
            },
            // Counts..................................................................................................
            {
                header: 'Likes Count',
                accessorKey: 'likes_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Comments Count',
                accessorKey: 'comments_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Clicks Count',
                accessorKey: 'clicks_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Unique Clicks Count',
                accessorKey: 'unique_clicks_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Views Count',
                accessorKey: 'views_count',
                cell: (info) => info.getValue(),
            },

            // ........................................................................................................
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },

            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                header: 'Approval Status',
                accessorKey: 'approval_status',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Owner',
                accessorKey: 'owner',
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
        pageCount: Math.ceil((totalData ?? 0) / pageSize),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
            globalFilter,
        },
        onPaginationChange: (updater: Updater<PaginationState>) => {
            const newPagination = typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater

            setPage(newPagination.pageIndex + 1) // Adjust for zero-based index
            setPageSize(newPagination.pageSize)
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
                    placeholder="Search by post_Id"
                    value={globalFilter}
                    className="p-2 border rounded"
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={onPaginationChange} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Accepted
