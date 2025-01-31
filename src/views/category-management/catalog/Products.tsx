/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import { IoMdDownload } from 'react-icons/io'
import ImageMODAL from '@/common/ImageModal'
import { FaEdit, FaFacebook, FaFacebookF, FaFilter } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import ProductFilterNest from './ProductFilter'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { notification } from 'antd'
import DialogConfirm from '@/common/DialogConfirm'
import axios from 'axios'

import { FILTER_STATE } from '@/store/types/filters.types'
import { Dropdown } from '@/components/ui'
import { ProductFilterArray } from './ProductCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import LoadingSpinner from '@/common/LoadingSpinner'
import { Option, pageSizeOptions, ProductVariant } from './CommonType'

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
const Products = () => {
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const navigate = useNavigate()
    const [searchType, setSearchType] = useState<string>('')
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<any[]>([])
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
    const [showRandomizeDialog, setShowRandomizeDialog] = useState(false)
    const [selectFilterString, setFilterString] = useState('')
    const [showDrawer, setShowDrawer] = useState(false)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(ProductFilterArray[0])
    const [showSpinner, setShowSpinner] = useState(false)

    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            let searchInputType = ''
            let pageAndSize = `&p=${page}&page_size=${pageSize}`

            if (globalFilter) {
                pageAndSize = ''
            }

            // setShowSpinner(true)
            if (currentSelectedPage.value === 'sku' && globalFilter) {
                searchInputType = `&sku=${globalFilter}`
            } else if (currentSelectedPage.value === 'name' && globalFilter) {
                searchInputType = `&name=${globalFilter}`
            }
            const response = await axiosInstance.get(`merchant/products?dashboard=true${pageAndSize}&${typeFetch}${searchInputType}`)

            const data = response.data?.data?.results
            const total = response.data?.data?.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setShowSpinner(false)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
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

    const handleApply = (values: any) => {
        console.log('value inside  apply', values)
        let query = ''

        if (brandList?.length > 0 && !selectFilterString) {
            const brandIds = brandList.join(',')
            if (query) query += '&'
            query += `brand=${brandIds}`
        }
        if (selectFilterString && brandList?.length === 0) {
            query += `&${selectFilterString}`
        }
        if (selectFilterString && brandList?.length > 0) {
            const brandIds = brandList.join(',')
            const data = selectFilterString
                ?.split('=')
                ?.filter((item) => item !== 'brand')
                ?.join('')
            if (selectFilterString.includes('brand')) {
                query += `&brand=${brandIds},${data},`
            } else {
                query += `&${selectFilterString}&brand=${brandIds}`
            }
        }

        setTypeFetch(query)
        setShowDrawer(false)
    }

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
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
                                .join(',') ?? 'N/A'}
                        </div>
                    )
                },
            },
            {
                header: 'SIZE',
                accessorKey: 'size',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    )

    const handleProductSelect = (value: any) => {
        const selected = ProductFilterArray.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const handleDownload = async () => {
        try {
            let searchInputType = ''

            if (currentSelectedPage.value === 'sku' && globalFilter) {
                searchInputType = `&sku=${globalFilter}`
            } else if (currentSelectedPage.value === 'name' && globalFilter) {
                searchInputType = `&name=${globalFilter}`
            }
            const downloadUrl = `merchant/products?download=true&${typeFetch}${searchInputType}`

            const response = await axiosInstance.get(downloadUrl)

            console.log('response is  ssss', response?.data)

            notification.success({
                message: response?.data?.message,
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed ti export',
            })
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
            const response = await axiosInstance.post(`/backend/task/create`, body)
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
    const handleRandomize = async () => {
        notification.info({
            message: 'SYNC IN PROCESS',
        })
        const body = {
            task_name: 'randomize_product_listing',
        }
        setShowRandomizeDialog(false)
        try {
            const response = await axiosInstance.post(`/backend/task/create`, body)
            notification.success({
                message: response?.data?.message || 'product is randomized',
            })
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: error.response?.data?.message || 'FAILED TO ranodmize product',
            })
        }
    }

    const handleGenerateSiteMap = async () => {
        notification.info({
            message: 'SiteMap generate in process',
        })
        try {
            const response = await axios.get('https://zgvm8zgvld.execute-api.ap-south-1.amazonaws.com/api/generate-sitemap')

            if (response.status === 200) {
                notification.success({
                    message: response?.data?.message || 'Successfully Created sitemap',
                })
            } else {
                notification.error({
                    message: 'Failed to Created sitemap',
                })
            }
        } catch (error) {
            console.error('Error generating site map:', error)
        }
    }

    const handleProduct = () => {
        navigate('/app/catalog/products/addNew')
    }

    const handleOpenModal = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-center xl:justify-between mb-4 gap-4">
                <div className="w-full md:w-1/3 flex justify-between gap-3">
                    <div className="flex gap-2">
                        <input
                            type="search"
                            placeholder="Search here"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="p-2 w-full md:w-[70%] border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="bg-gray-100 xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white font-bold">
                            <Dropdown
                                className="text-black bg-gray-200 font-bold px-4 py-2 rounded-md"
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={handleProductSelect}
                            >
                                {ProductFilterArray?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>
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
                            className=" px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-purple-600 rounded-lg text-white bg-purple-700"
                            onClick={() => setShowRandomizeDialog(true)}
                        >
                            <span className="font-bold">Randomize</span>
                        </button>
                        <button
                            className=" px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-yellow-500 rounded-lg text-white bg-yellow-600"
                            onClick={handleGenerateSiteMap}
                        >
                            <span className="font-bold">SiteMap</span>
                        </button>
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
            {!globalFilter && (
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
            )}
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
                    filters={filters}
                    setFilterString={setFilterString}
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
            {showRandomizeDialog && (
                <DialogConfirm
                    IsOpen={showRandomizeDialog}
                    setIsOpen={setShowRandomizeDialog}
                    onDialogOk={handleRandomize}
                    IsConfirm
                    headingName="Randomize Product Listing"
                />
            )}
        </div>
    )
}

export default Products
