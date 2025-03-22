import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { Spinner } from '@/components/ui'
import { IoMdDownload } from 'react-icons/io'
import moment from 'moment'
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

const BrandCatalog = () => {
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [filterInput, setFilterInput] = useState('')
    const [showSpinner, setShowSpinner] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState([])

    console.log('ssssssssssssss', selectedCompany)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            setShowSpinner(true)
            const response = await axiosInstance.get(
                `merchant/products?dashboard=true&p=${page}&page_size=${pageSize}&company_id=${selectedCompany.id}`,
            )
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
            setShowSpinner(false)
        } catch (error) {
            console.error(error)
            setShowSpinner(false)
        }
    }

    const filter = async (page: number, pageSize: number, filter: string = '') => {
        try {
            let searchInputType = `&sku=${filter}`
            setFilterInput(searchInputType)
            let response = await axiosInstance.get(
                `merchant/products?dashboard=true&p=${page}&page_size=${pageSize}${searchInputType}&company_id=${selectedCompany.id}`,
            )

            if (response.data.data.results.length === 0) {
                searchInputType = `&name=${filter}`
                setFilterInput(searchInputType)
                response = await axiosInstance.get(
                    `merchant/products?dashboard=true&p=${page}&page_size=${pageSize}${searchInputType}&company_id=${selectedCompany.id}`,
                )
            }

            const data = response.data.data.results
            const total = response.data.data.count

            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize, selectedCompany])
    useEffect(() => {
        if (globalFilter) {
            filter(page, pageSize, globalFilter)
        }
    }, [page, pageSize, globalFilter])

    const getFirstImageUrl = (images: string) => {
        const img = images.length > 0 ? images.split(',') : ''
        return img[0]
    }

    const handleActionClick = (id: any) => {
        console.log('OK', id)
    }

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'Barcode',
                accessorKey: 'barcode',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
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
            {
                header: 'Product Type',
                accessorKey: 'product_type',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Try & Buy',
                accessorKey: 'is_try_and_buy',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            // {
            //     header: 'Trends',
            //     accessorKey: 'trends',
            //     cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            // },
            // {
            //     header: 'Action',
            //     accessorKey: 'action',
            //     cell: ({ row }) => (
            //         <Button onClick={() => handleActionClick(row.original)}>
            //             EDIT
            //         </Button>
            //     ),
            // },
        ],
        [],
    )

    const handleOpenModal = (img: any) => {
        console.log('sdsds', img)
        setParticularROwImage(img)
        setShowImageModal(true)
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

    const date = new Date()

    const onSelectChange = (value: number) => {
        setPageSize(Number(value))
    }
    const handleDownload = async () => {
        try {
            const downloadUrl = `merchant/products?download=true&p=${page}&page_size=${pageSize}&company_id=${selectedCompany.id}`
            const response = await axiosInstance.get(downloadUrl, {
                responseType: 'blob',
            })
            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${selectedCompany.name}_Catalog-${moment(date).format('YYYY-MM-DD')}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="shadow-xl p-4 rounded-xl">
            {showSpinner ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner size="40px" />
                </div>
            ) : (
                <>
                    <div className="flex xl:justify-between xl:flex-row gap-4 flex-col mb-4 items-center  ">
                        <div className="">
                            <input
                                type="text"
                                placeholder="Search here"
                                value={globalFilter}
                                className="p-2  rounded-xl"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </div>
                        <div className="flex order-first xl:order-none">
                            <button
                                className="bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg flex "
                                onClick={handleDownload}
                            >
                                <IoMdDownload className="text-xl" />
                                Export
                            </button>
                        </div>
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
                                onChange={(option) => onSelectChange(option?.value || 0)}
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
                </>
            )}
        </div>
    )
}

export default BrandCatalog
