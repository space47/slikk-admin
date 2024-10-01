/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { IoMdDownload } from 'react-icons/io'
import { notification } from 'antd'
import ImageMODAL from '@/common/ImageModal'
import { DROPDOWNARRAY } from '@/views/category-management/catalog/CommonType'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { TfiExchangeVertical } from 'react-icons/tfi'
import { FaSync } from 'react-icons/fa'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import StockOverviewFilter from './stockOverviewComponents/StockOverviewFilter'

interface LastUpdatedBy {
    name: string
    mobile: string
    email: string
}

interface Product {
    barcode: string
    brand_name: string
    color: string
    id: number
    name: string
    size: string
    sku: string
    variant_id: string
    image: string
}

interface Stock {
    product: Product
    store: number
    quantity: any
    last_updated_by: LastUpdatedBy
    show_out_of_stock: boolean
    is_active: boolean
    offer_is_active: boolean
    expiry_date: string
    batch_number: string
    create_date: string
    update_date: string
    grn: any
    from: string
    to: string
    id: any
    location: string
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

const StockOverview = () => {
    const [data, setData] = useState<Stock[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [filterInput, setFilterInput] = useState('')
    const [updatedQuantities, setUpdatedQuantities] = useState<{
        [key: number]: number
    }>({})
    const [updatedLocation, setUpdatedLocation] = useState<{
        [key: number]: string
    }>({})
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>()
    const [searchType, setSearchType] = useState<string>('')

    // FOR THE LISTS
    const [divisionList, setDivisionList] = useState<string[]>([])
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [productTypeList, setProductTypeList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [typeFetch, setTypeFetch] = useState('')

    const [showDrawer, setShowDrawer] = useState(false)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axiosInstance.get(
                `inventory?p=${page}&page_size=${pageSize}&${typeFetch}`, // /rowId(patch)...........body me quantity: {numberic value}, //location : text
            )
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    const filter = async (page: number, pageSize: number, filter: string = '') => {
        try {
            let searchInputType = `&sku=${filter}`
            setFilterInput(searchInputType)
            let response = await axiosInstance.get(`inventory?p=${page}&page_size=${pageSize}&${typeFetch}${searchInputType}`)

            if (response?.data?.data?.results?.length === 0) {
                searchInputType = `&name=${filter}`
                setFilterInput(searchInputType)
                response = await axiosInstance.get(`inventory?p=${page}&page_size=${pageSize}&${typeFetch}${searchInputType}`)
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
    }, [page, pageSize, currentSelectedPage, searchType, typeFetch])

    useEffect(() => {
        filter(page, pageSize, globalFilter)
    }, [page, pageSize, globalFilter, searchType])

    const columns = useMemo<ColumnDef<Stock>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'product.sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Product Name',
                accessorKey: 'product.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'product.image',
                cell: ({ getValue, row }) => (
                    <img
                        src={getValue().split(',')[0]}
                        alt="Image"
                        className="w-24 h-20 object-cover cursor-pointer"
                        onClick={() => handleOpenModal(row.original.product.image)}
                    />
                ),
            },
            {
                header: 'Store Number',
                accessorKey: 'store',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: ({ row }) => {
                    const stockId = row.original.id
                    const location = updatedLocation[stockId] ?? row.original.location
                    return <input type="text" value={location} onChange={(e) => handleLocationChange(stockId, e.target.value)} />
                },
            },
            {
                header: 'Brand',
                accessorKey: 'product.brand_name',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Color',
                accessorKey: 'product.color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Size',
                accessorKey: 'product.size',
                cell: (info) => info.getValue().toUpperCase(),
            },
            {
                header: 'Stock',
                accessorKey: 'quantity',
                cell: ({ row }) => {
                    const stockId = row.original.id
                    const quantity = updatedQuantities[stockId] ?? row.original.quantity
                    return (
                        <input
                            className="w-[100px]"
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
                        />
                    )
                },
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
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Updated',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'GRN number',
                accessorKey: 'grn',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Update Row',
                accessorKey: 'id',
                cell: ({ getValue, row }) => (
                    <button
                        onClick={() => handleUpdate(row.original.id, row.original.quantity, row.original.location)}
                        className="px-4 py-2 bg-none text-2xl rounded font-bold text-green-600"
                    >
                        <FaSync />
                    </button>
                ),
            },
        ],
        [updatedQuantities, updatedLocation],
    )

    const handleOpenModal = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setUpdatedQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: newQuantity,
        }))
    }

    const handleLocationChange = (id: number, newLocation: string) => {
        setUpdatedLocation((prev) => ({
            ...prev,
            [id]: newLocation,
        }))
    }

    // Filters.................

    const hanldeFilter = () => {
        setShowDrawer(true)
    }

    const handleCloseDrawer = () => {
        setShowDrawer(false)
    }

    const handleMultiSelect = (fieldName: string, selectedValues: any) => {
        if (fieldName === 'division') {
            setDivisionList(selectedValues)
        } else if (fieldName === 'category') {
            setCategoryList(selectedValues)
        } else if (fieldName === 'sub_category') {
            setSubCategoryList(selectedValues)
        } else if (fieldName === 'product_type') {
            setProductTypeList(selectedValues)
        } else if (fieldName === 'brand') {
            setBrandList(selectedValues)
        }
    }

    const handleApply = () => {
        let query = ''

        if (divisionList.length > 0) {
            const divisionIds = divisionList.map((item: any) => item).join(',')
            query += `division=${divisionIds}`
        }

        if (categoryList.length > 0) {
            const categoryIds = categoryList.map((item: any) => item).join(',')
            if (query) query += '&'
            query += `category=${categoryIds}`
        }

        if (subCategoryList.length > 0) {
            const subCategoryIds = subCategoryList.map((item: any) => item).join(',')
            if (query) query += '&'
            query += `sub_category=${subCategoryIds}`
        }
        if (productTypeList.length > 0) {
            const productTypeIds = productTypeList.map((item: any) => item).join(',')
            if (query) query += '&'
            query += `Product_type=${productTypeIds}`
        }
        if (brandList.length > 0) {
            const brandIds = brandList.map((item: any) => item).join(',')
            if (query) query += '&'
            query += `brand=${brandIds}`
        }

        setTypeFetch(query)
        setShowDrawer(false)
    }

    //...........................

    const handleUpdate = async (id: any, originalQuantity: any, originalLocation: any) => {
        const location = updatedLocation[id] ?? null
        const quantity = updatedQuantities[id] >= 0 ? updatedQuantities[id] : null

        console.log('Quantity', quantity)

        try {
            const body = {
                quantity: quantity >= 0 ? quantity : originalQuantity,
                location: location ? location : originalLocation,
            }

            console.log('BODY', body)

            const response = await axiosInstance.patch(`inventory/${id}`, body)
            notification.success({
                message: 'SUCCESS',
                description: response?.data?.message || 'UPDATE SUCCESS',
            })
        } catch (error) {
            console.error(error)
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
            let filterParam = ''
            if (filterInput.includes('&name=')) {
                filterParam = `&name=${globalFilter}`
            } else if (filterInput.includes('&sku=')) {
                filterParam = `&sku=${globalFilter}`
            }
            const downloadUrl = `inventory?download=true&${typeFetch}${filterParam}`
            const response = await axiosInstance.get(downloadUrl, {
                responseType: 'blob',
            })
            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = searchType ? `${searchType}-stockOverView.csv` : `All-StockOverview.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading the file:', error)
        }
    }

    return (
        <div className="overflow-x-auto p-4">
            <div className="upper flex flex-col md:flex-row justify-between mb-5 items-center">
                <button
                    className="xl:hidden bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg flex mb-4 justify-end items-end"
                    onClick={handleDownload}
                >
                    <IoMdDownload className="text-xl" />
                </button>
                <div className="mb-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search SKU/Name"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded shadow-md w-full md:w-auto"
                    />
                </div>
                <div className="flex flex-col gap-7 xl:flex-row items-center xl:items-baseline ">
                    <div className="drop flex flex-row gap-5 w-full md:w-auto items-center">
                        <Button variant="new" onClick={hanldeFilter}>
                            Category Filter
                        </Button>
                    </div>

                    <div>
                        <button
                            className="hidden xl:flex bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg items-center "
                            onClick={handleDownload}
                        >
                            <IoMdDownload className="text-xl" />
                            Export
                        </button>
                    </div>
                </div>
            </div>
            <Table className="w-full">
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
            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalData}
                    onChange={onPaginationChange}
                    className="w-[400px] md:w-auto mb-4 md:mb-0 "
                />
                <div className="flex flex-row items-center justify-between xl:justify-normal w-full md:w-auto xl:gap-5">
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                        className="w-1/2 md:w-auto"
                    />
                    {/* <button className="bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg " onClick={handleDownload}>
                        <IoMdDownload className="text-xl" />
                    </button> */}
                </div>
            </div>
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}

            {showDrawer && (
                <StockOverviewFilter
                    showDrawer={showDrawer}
                    handleCloseDrawer={handleCloseDrawer}
                    handleMultiSelect={handleMultiSelect}
                    handleApply={handleApply}
                    subCategoryList={subCategoryList}
                    divisionList={divisionList}
                    categroyList={categoryList}
                    brandList={brandList}
                    productTypeList={productTypeList}
                    setBrandList={setBrandList}
                    setCategoryList={setCategoryList}
                    setDivisionList={setDivisionList}
                    setProductTypeList={setProductTypeList}
                    setSubCategoryList={setSubCategoryList}
                    setTypeFetch={setTypeFetch}
                />
            )}
        </div>
    )
}

export default StockOverview
