/* eslint-disable @typescript-eslint/no-explicit-any */
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
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

type BRANDTYPES = {
    image: string
    name: string
    title: string
}

type DIVTYPES = {
    image: string
    name: string
    description: string
}

interface BannerType {
    id: number
    name: string
    section_heading: string
    parent_banner: string | null
    quick_filter_tags: string[]
    brand: BRANDTYPES[]
    division: DIVTYPES[]
    category: DIVTYPES[]
    sub_category: DIVTYPES[]
    product_type: DIVTYPES[]
    type: string | null
    image_web: string
    image_mobile: string
    offers: boolean
    offer_id: string
    page: string
    from_date: string
    to_date: string
    uptooff: string
    tags: string[]
    footer: string | null
    coupon_code: string | null
    is_clickable: boolean
    section_background_web: string
    section_background_mobile: string
    max_price: number
    min_price: number
    barcodes: string
    redirection_url: string | null
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

const AppBanners = () => {
    const [data, setData] = useState<BannerType[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const navigate = useNavigate()

    const fetchData = async (
        page: number,
        pageSize: number,
        filter: string,
    ) => {
        try {
            const response = await axiosInstance.get(
                `/banners?p=${page}&page_size=${pageSize}&filter=${filter}`,
            )
            const data = response.data.data.results

            const total = response.data.data.count
            setData(data)
            setTotalData(total)

            const count = response.data.data.count
            setData(data)
            setTotalData(count)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize, globalFilter)
    }, [page, pageSize, globalFilter])

    const columns = useMemo(
        () => [
            { header: 'ID', accessorKey: 'id' },
            { header: 'Name', accessorKey: 'name' },
            { header: 'Section Heading', accessorKey: 'section_heading' },
            { header: 'Parent Banner', accessorKey: 'parent_banner' },
            {
                header: 'Quick Filter Tags',
                accessorKey: 'quick_filter_tags',
                cell: (info: any) => info.getValue().join(', '),
            },
            {
                header: 'Brand Name',
                accessorKey: 'brand.name',
                cell: (info: any) =>
                    info.row.original.brand.map((item: any, key: number) => (
                        <div key={key}>{item.name}</div>
                    )),
            },
            {
                header: 'Brand TITLE',
                accessorKey: 'brand.title',
                cell: (info: any) =>
                    info.row.original.brand.map((item: any, key: number) => (
                        <div key={key}>{item.title}</div>
                    )),
            },
            {
                header: 'Brand Image',
                accessorKey: 'brand.image',
                cell: (info) =>
                    info.row.original.brand.map((item: any, key: number) => (
                        <img
                            src={item.image}
                            alt=""
                            key={key}
                            className="w-[100px] h-[60px]"
                        />
                    )),
            },
            {
                header: 'DIVISION Name',
                accessorKey: 'division',
                cell: (info: any) =>
                    info.row.original.division.map((item: any, key: number) => (
                        <div key={key}>{item.name}</div>
                    )),
            },
            {
                header: 'DIVISION Description',
                accessorKey: 'division.description',
                cell: (info: any) =>
                    info.row.original.division.map((item: any, key: number) => (
                        <div key={key}>{item.description}</div>
                    )),
            },
            {
                header: 'Division Image',
                accessorKey: 'division.image',
                cell: (info) =>
                    info.row.original.division.map((item: any, key: number) =>
                        item.image ? (
                            <img
                                src={item.image}
                                alt=""
                                key={key}
                                className="w-[100px] h-[60px]"
                            />
                        ) : (
                            ''
                        ),
                    ),
            },
            {
                header: 'Category Name',
                accessorKey: 'category.name',
                cell: (info) =>
                    info.row.original.category.map((item: any, key: number) => (
                        <div key={key}>{item.name}</div>
                    )),
            },
            {
                header: 'Category Description',
                accessorKey: 'category.description',
                cell: (info) =>
                    info.row.original.category.map((item: any, key: number) => (
                        <div key={key}>{item.description}</div>
                    )),
            },
            {
                header: 'Category Image',
                accessorKey: 'category.image',
                cell: (info: any) =>
                    info.row.original.category.map((item: any, key: number) =>
                        item.image ? (
                            <img
                                src={item.image}
                                alt=""
                                key={key}
                                className="w-[100px] h-[60px]"
                            />
                        ) : (
                            ''
                        ),
                    ),
            },
            {
                header: 'Sub Category Name',
                accessorKey: 'sub_category',
                cell: (info: any) =>
                    info.row.original.sub_category.map(
                        (item: any, key: number) => (
                            <div key={key}>{item.name}</div>
                        ),
                    ),
            },
            {
                header: 'Sub Category Description',
                accessorKey: 'sub_category.description',
                cell: (info: any) =>
                    info.row.original.sub_category.map(
                        (item: any, key: number) => (
                            <div key={key}>{item.description}</div>
                        ),
                    ),
            },
            {
                header: 'Sub Category Image',
                accessorKey: 'sub_category.image',
                cell: (info) =>
                    info.row.original.sub_category.map(
                        (item: any, key: number) =>
                            item.image ? (
                                <img
                                    src={item.image}
                                    alt=""
                                    key={key}
                                    className="w-[100px] h-[60px]"
                                />
                            ) : (
                                ''
                            ),
                    ),
            },
            {
                header: 'Product Type Name',
                accessorKey: 'product_type',
                cell: (info: any) =>
                    info.row.original.product_type.map(
                        (item: any, key: number) => (
                            <div key={key}>{item.name}</div>
                        ),
                    ),
            },
            {
                header: 'Product Type Description',
                accessorKey: 'product_type.description',
                cell: (info: any) =>
                    info.row.original.product_type.map(
                        (item: any, key: number) => (
                            <div key={key}>{item.description}</div>
                        ),
                    ),
            },
            {
                header: 'Product Type Image',
                accessorKey: 'product_type.image',
                cell: (info) =>
                    info.row.original.product_type.map(
                        (item: any, key: number) =>
                            item.image ? (
                                <img
                                    src={item.image}
                                    alt=""
                                    key={key}
                                    className="w-[100px] h-[60px]"
                                />
                            ) : (
                                ''
                            ),
                    ),
            },
            {
                header: 'Image (WEB)',
                accessorKey: 'image_web',
                cell: ({ getValue }) => <img src={getValue()} alt="" />,
            },
            {
                header: 'Image (Mobile)',
                accessorKey: 'image_mobile',
                cell: ({ getValue }) => <img src={getValue()} alt="" />,
            },

            { header: 'Offers', accessorKey: 'offers' },
            { header: 'Offer ID', accessorKey: 'offer_id' },
            { header: 'Page', accessorKey: 'page' },
            {
                header: 'From Date',
                accessorKey: 'from_date',
                cell: ({ getValue }) => (
                    <span>{moment(getValue()).format('YYYY-MM-DD')}</span>
                ),
            },
            {
                header: 'To Date',
                accessorKey: 'to_date',
                cell: ({ getValue }) => (
                    <span>{moment(getValue()).format('YYYY-MM-DD')}</span>
                ),
            },
            { header: 'Upto Off', accessorKey: 'uptoff' },
            {
                header: 'Tags',
                accessorKey: 'tags',
                cell: (info: any) => info.getValue().join(', '),
            },
            { header: 'Footer', accessorKey: 'footer' },
            { header: 'Coupon Code', accessorKey: 'coupon_code' },
            { header: 'Is Clickable', accessorKey: 'is_clickable' },
            {
                header: 'Section Background Web',
                accessorKey: 'section_background_web',
            },
            {
                header: 'Section Background Mobile',
                accessorKey: 'section_background_mobile',
            },
            { header: 'Max Price', accessorKey: 'max_price' },
            { header: 'Min Price', accessorKey: 'min_price' },
            { header: 'Barcodes', accessorKey: 'barcodes' },
            { header: 'Redirection URL', accessorKey: 'redirection_url' },
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

    const handleActionClick = (id: number) => {
        navigate(`/app/appSettings/banners/${id}`)
    }

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

    // const onPaginationChange = (page: number) => {
    //     setPage(page)
    // }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleBanner = () => {
        navigate('/app/appSettings/banners/addNew')
    }

    return (
        <div>
            <div className="flex justify-between mb-2">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                <div className="flex gap-3 items-center justify-center">
                    <div className="flex items-end justify-end mb-2">
                        <button
                            className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                            onClick={handleBanner}
                        >
                            ADD NEW BANNER
                        </button>
                    </div>
                </div>
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
                    onChange={(page) => setPage(page)}
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

export default AppBanners
