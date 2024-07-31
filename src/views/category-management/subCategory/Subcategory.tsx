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
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

type Product = {
    id: number
    name: string
    category_name: string
    title: string
    description: string
    image: string
    footer: string | null
    quick_filter_tags: string
    position: number
    gender: string
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    last_updated_by: string | null
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

const Subcategory = () => {
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('') //1

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axiosInstance.get(
                `sub-category?p=${page}&page_size=${pageSize}`,
            )

            const data = response.data.data
            const total = response.data
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize])

    const handleActionClick = (id: any) => {
        navigate(`/app/category/subCategory/${id}`)
    }

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Category Name',
                accessorKey: 'category_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: (info) => (
                    <img
                        src={info.getValue()}
                        alt="Image"
                        className="w-24 h-20 object-cover"
                    />
                ),
            },
            {
                header: 'Footer',
                accessorKey: 'footer',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quick_Filter',
                accessorKey: 'quick_filter_tags',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Position',
                accessorKey: 'position',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Gender',
                accessorKey: 'gender',
                cell: (info) => info.getValue(),
            },

            {
                header: 'ACTIVE',
                accessorKey: 'is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Create DATE',
                accessorKey: 'create_date',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                ),
            },
            {
                header: 'Update DATE',
                accessorKey: 'create_date',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                ),
            },
            {
                header: 'Try_&_Buys',
                accessorKey: 'is_try_and_buy',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Last Updated By',
                accessorKey: 'last_updated_by',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },

            {
                header: 'Action',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <Button onClick={() => handleActionClick(row.original.id)}>
                        EDIT
                    </Button>
                ),
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
    const navigate = useNavigate()

    const handleSeller = () => {
        navigate('/app/category/subCategory/addNew')
    }

    return (
        <div>
            <div className="flex items-end justify-end mb-2">
                <button
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                    onClick={handleSeller}
                >
                    ADD Category
                </button>{' '}
                <br />
                <br />
            </div>
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
                <THead className="items-center">
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

export default Subcategory
