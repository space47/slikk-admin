/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Button } from '@/components/ui'

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

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const UploadPost = () => {
    const navigate = useNavigate()
    const [totalData, setTotalData] = useState(0)
    const [tableData, setTableData] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const handlePostClick = (id: number, post_id: string) => {
        navigate(`/app/postApproval/approved/${id}?post_id=${post_id}`)
    }

    const fetchData = async (page = 1, pageSize = 10, filter: string = '') => {
        try {
            const response = await axiosInstance.get(`userposts/approval?status=APPROVED&p=${page}&page_size=${pageSize}&name=${filter}`)
            const data = response.data.data.results
            const total = response.data.data.count
            setTableData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize, globalFilter)
    }, [page, pageSize, globalFilter])

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
                        onClick={() => handlePostClick(row.original.id, getValue() as string)}
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
        data: tableData,
        columns,
        state: {
            globalFilter,
            pagination: {
                pageIndex: page - 1,
                pageSize,
            },
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalData / pageSize),
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value: any) => {
        setPageSize(value)
    }

    const handleCreatePost = () => {
        navigate(`/app/uploadPost/createPost`)
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between mb-10 items-center">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>

                <div>
                    <Button className="bg-gray-800 text-white px-4 py-2" onClick={handleCreatePost} variant="new">
                        Create Post
                    </Button>
                </div>
            </div>

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </div>
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
                                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={onPaginationChange} />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                        className="flex justify-end"
                    />
                </div>
            </div>
        </div>
    )
}

export default UploadPost
