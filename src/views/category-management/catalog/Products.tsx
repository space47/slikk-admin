/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import { IoMdDownload } from 'react-icons/io'
import ImageMODAL from '@/common/ImageModal'
import { FaEdit, FaFacebook, FaFacebookF, FaFilter } from 'react-icons/fa'
import StockOverviewFilter from '@/views/inventory-management/stock-overview/stockOverviewComponents/StockOverviewFilter'
import EasyTable from '@/common/EasyTable'
import ProductFilterNest from './ProductFilter'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { notification } from 'antd'
import DialogConfirm from '@/common/DialogConfirm'

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
    sku: string
    filter_to_display_map: any
}

type Option = {
    value: number
    label: string
}

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
    const [filterInput, setFilterInput] = useState('')
    const [searchType, setSearchType] = useState<string>('')
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<string[]>([])

    const [divisionList, setDivisionList] = useState<string[]>([])
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [productTypeList, setProductTypeList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [typeFetch, setTypeFetch] = useState('')
    const [filteredCategories, setFilteredCategories] = useState([])
    const [filteredSubCategories, setFilteredSubCategories] = useState([])
    const [filteredProductTypes, setFilteredProductTypes] = useState([])
    const [showFacebookDialog, setShowFacebookDialog] = useState(false)

    const [showDrawer, setShowDrawer] = useState(false)

    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)

    const fetchData = async (page: number, pageSize: number, filter: string = '') => {
        try {
            let searchInputType = ''

            if (filter) {
                searchInputType = `&sku=${filter}`
                setFilterInput(searchInputType)
                let response = await axiosInstance.get(
                    `merchant/products?dashboard=true&p=${page}&page_size=${pageSize}&${typeFetch}${searchInputType}`,
                )

                if (response.data.data.results.length === 0) {
                    searchInputType = `&name=${filter}`
                    setFilterInput(searchInputType)
                    response = await axiosInstance.get(
                        `merchant/products?dashboard=true&p=${page}&page_size=${pageSize}&${typeFetch}${searchInputType}`,
                    )
                }

                const data = response.data.data.results
                const total = response.data.data.count

                setData(data)
                setTotalData(total)
            } else {
                const response = await axiosInstance.get(`merchant/products?dashboard=true&p=${page}&page_size=${pageSize}&${typeFetch}`)

                const data = response.data.data.results
                const total = response.data.data.count

                setData(data)
                setTotalData(total)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize, globalFilter)
    }, [page, pageSize, typeFetch, globalFilter, searchType])

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
        let query = '&'

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
                cell: ({ getValue, row }: any) => (
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
                header: 'Stocks',
                accessorKey: 'inventory_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'COLOR',
                accessorKey: 'color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'COLOR Family',
                accessorKey: 'filter_tags.colorfamily',
                cell: ({ getValue }: any) => {
                    return (
                        <div>
                            {getValue()
                                ?.map((item: any) => item)
                                .join(',')}
                        </div>
                    )
                },
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
                    <button className="border-none bg-none">
                        <a href={`/app/catalog/products/${row.original.barcode}`} target="_blank" rel="noreferrer">
                            {' '}
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </button>
                ),
            },
        ],
        [],
    )

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
            console.log('filterParam', filterParam)
            const downloadUrl = `merchant/products?download=true${typeFetch}${filterParam}`

            const response = await axiosInstance.get(downloadUrl, {
                responseType: 'blob',
            })

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
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

    const handleFacebookSync = async () => {
        notification.info({
            message: 'SYNC IN PROCESS',
        })
        const body = {
            task_name: 'update_facebook_catalog_full',
        }
        setShowFacebookDialog(false)
        try {
            const response = await axiosInstance.post(`/backend/task/process`, body)
            notification.success({
                message: response?.data?.message || 'SYNCED TO FB',
            })
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: error.response?.data?.message || 'FAILED TO SYNC TO FB',
            })
        }
    }

    const handleProduct = () => {
        navigate('/app/catalog/products/addNew')
    }

    const handleOpenModal = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-center xl:justify-between mb-4 gap-4">
                <div className="w-full md:w-1/3 flex justify-between gap-3">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 w-full md:w-[70%] border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="bg-gray-100 text-black px-4 py-2 flex items-center gap-2 xl:hidden hover:bg-gray-200 rounded-lg"
                        onClick={handleDownload}
                    >
                        <IoMdDownload className="text-xl" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex gap-3">
                        <button
                            className=" px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-blue-600 rounded-lg text-white bg-blue-700"
                            onClick={() => setShowFacebookDialog(true)}
                        >
                            <span className="font-bold">Sync</span> <FaFacebook className="text-xl" />
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-green-400 rounded-lg font-bold"
                            onClick={handleDownload}
                        >
                            <IoMdDownload className="text-xl" /> Export
                        </button>

                        <Button
                            variant="new"
                            onClick={hanldeFilter}
                            className=" text-white px-4 py-2 hidden items-center gap-2 xl:flex rounded-lg font-bold "
                        >
                            <FaFilter className="text-md" /> Filter
                        </Button>
                    </div>

                    <div className="flex gap-3 w-full justify-between md:w-auto">
                        <Button variant="new" onClick={hanldeFilter} className=" text-white flex items-center gap-2 xl:hidden rounded-lg ">
                            <FaFilter className="text-md" />
                        </Button>
                        <button
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 w-full md:w-auto text-center font-bold"
                            onClick={handleProduct}
                        >
                            + Product
                        </button>
                    </div>
                </div>
            </div>

            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
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
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
            {showDrawer && (
                <ProductFilterNest
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
                    filteredCategories={filteredCategories}
                    filteredProductTypes={filteredProductTypes}
                    filteredSubCategories={filteredSubCategories}
                    setFilteredCategories={setFilteredCategories}
                    setFilteredProductTypes={setFilteredProductTypes}
                    setFilteredSubCategories={setFilteredSubCategories}
                    options={divisions.divisions}
                />
            )}
            {showFacebookDialog && (
                <DialogConfirm
                    IsOpen={showFacebookDialog}
                    setIsOpen={setShowFacebookDialog}
                    onDialogOk={handleFacebookSync}
                    IsConfirm
                    headingName="SYNC TO FACEBOOK"
                />
            )}
        </div>
    )
}

export default Products
