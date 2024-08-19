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
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import { IoMdDownload } from 'react-icons/io'
import { DROPDOWNARRAY } from './CommonType'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import ImageMODAL from '@/common/ImageModal'

type ProductVariant = {
    name: string
    variant_type: string
    color_code_link: string
    size: string[]
    barcode: string
    sku: string
    mrp: string
    sp: string
    inventory_count: number
}

type Product = {
    barcode: string
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    trends: boolean
    styles: any
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    variants: ProductVariant[]
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

const Products = () => {
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const navigate = useNavigate()
    const [currentSelectedPage, setCurrentSelectedPage] =
        useState<Record<string, string>>()

    const [filterInput, setFilterInput] = useState('')
    const [searchType, setSearchType] = useState<string>('')
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState([])

    const fetchData = async (page: number, pageSize: number) => {
        try {
            let type = ''
            if (currentSelectedPage?.label && searchType) {
                type = `&${currentSelectedPage.value}=${searchType}`
            }

            const response = await axiosInstance.get(
                `search/product?dashboard=true&p=${page}&page_size=${pageSize}${type}`,
            )

            const data = response.data.results
            const total = response.data.count

            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const filter = async (
        page: number,
        pageSize: number,
        filter: string = '',
    ) => {
        try {
            let type = ''
            if (currentSelectedPage?.label && searchType) {
                type = `&${currentSelectedPage.value}=${searchType}`
            }

            const response = await axiosInstance.get(
                `search/product?dashboard=true&p=${page}&page_size=${pageSize}${type}&sku=${filter}`,
            )

            const data = response.data.results
            const total = response.data.count

            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize, currentSelectedPage, searchType])

    useEffect(() => {
        filter(page, pageSize, globalFilter)
    }, [page, pageSize, globalFilter, searchType])

    const handleActionClick = (barcode: any) => {
        navigate(`/app/catalog/products/${barcode}`)
    }

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
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
                cell: ({ getValue, row }) => (
                    <img
                        src={getValue().split(',')[0]}
                        alt="Image"
                        className="w-24 h-20 object-cover cursor-pointer"
                        onClick={() => handleOpenModal(row.original.image)}
                    />
                ),
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

            // {
            //     header: 'Active',
            //     accessorKey: 'is_active',
            //     cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            // },
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
            // {
            //     header: 'Product Type',
            //     accessorKey: 'product_type',
            //     cell: (info) => info.getValue(),
            // },
            {
                header: 'COLOR',
                accessorKey: 'color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SIZE',
                accessorKey: 'size',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <Button
                        onClick={() => handleActionClick(row.original.barcode)}
                    >
                        EDIT
                    </Button>
                ),
            },
        ],
        [],
    )

    const handleSelect = (value: any) => {
        const selected = DROPDOWNARRAY.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
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

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleDownload = async () => {
        try {
            const response = await axiosInstance.get(
                'merchant/products?download=true',
                {
                    responseType: 'blob', // This is important to correctly handle binary data
                },
            )

            const urlToBeDownloaded = window.URL.createObjectURL(
                new Blob([response.data]),
            )
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = 'Product.csv'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading the file:', error)
        }
    }

    const handleProduct = () => {
        navigate('/app/catalog/products/addNew')
    }

    const handleSearchType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchType(event.target.value)
    }

    const handleOpenModal = (img: any) => {
        console.log('sdsds', img)
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    console.log('Images', particularRowImage)

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
                {/*  */}
                <div className="drop border  bg-gray-200 text-black text-lg font-semibold flex gap-5 w-[100px] mb-6 ">
                    <input
                        type="text"
                        placeholder="Search Type here"
                        value={searchType}
                        onChange={handleSearchType}
                        className="p-2 border rounded"
                    />
                    <Dropdown
                        className=" text-xl text-black "
                        title={
                            currentSelectedPage?.value
                                ? currentSelectedPage.label
                                : 'SELECT'
                        }
                        onSelect={handleSelect}
                    >
                        {DROPDOWNARRAY?.map((item, key) => {
                            return (
                                <DropdownItem key={key} eventKey={item.value}>
                                    <span>{item.label}</span>
                                </DropdownItem>
                            )
                        })}
                    </Dropdown>
                </div>

                <div className="flex gap-3 items-center justify-center">
                    <div>
                        <div className="flex items-end justify-end mb-2">
                            <button
                                className="bg-gray-100 text-black px-5 py-3  hover:bg-gray-200 rounded-lg"
                                onClick={handleDownload}
                            >
                                <IoMdDownload className="text-3xl" />
                            </button>{' '}
                            <br />
                            <br />
                        </div>
                    </div>

                    <div className="flex items-end justify-end mb-2">
                        <button
                            className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                            onClick={handleProduct}
                        >
                            ADD NEW PRODUCT
                        </button>{' '}
                        <br />
                        <br />
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
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
        </div>
    )
}

export default Products
