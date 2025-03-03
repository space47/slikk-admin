/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { IoMdDownload } from 'react-icons/io'
import { notification } from 'antd'
import ImageMODAL from '@/common/ImageModal'
import { FaSync } from 'react-icons/fa'
import StockOverviewFilter from './stockOverviewComponents/StockOverviewFilter'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions, Stock } from './stockOverviewCommon'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'

const FilterArray = [
    { label: 'SKU', value: 'sku' },
    { label: 'NAME', value: 'name' },
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
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(FilterArray[0])
    const [searchType, setSearchType] = useState<string>('')
    const navigate = useNavigate()
    // FOR THE LISTS
    const [divisionList, setDivisionList] = useState<string[]>([])
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [productTypeList, setProductTypeList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [typeFetch, setTypeFetch] = useState('')
    const [accessDenied, setAccessDenied] = useState(false)
    const [showDrawer, setShowDrawer] = useState(false)

    const fetchAndFilterData = async () => {
        try {
            let filterValue = ''
            if (currentSelectedPage?.value === 'sku' && globalFilter) {
                filterValue = `&sku=${encodeURIComponent(globalFilter)}`
            }
            if (currentSelectedPage?.value === 'name' && globalFilter) {
                filterValue = `&name=${encodeURIComponent(globalFilter)}`
            }

            const response = await axiosInstance.get(`inventory?p=${page}&page_size=${pageSize}&${typeFetch}${filterValue}`)

            const data = response.data.data.results
            const total = response.data.data.count

            setData(data)
            setTotalData(total)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchAndFilterData()
    }, [page, pageSize, globalFilter, searchType, typeFetch])

    const columns = useMemo<ColumnDef<Stock>[]>(
        () => [
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
                    return (
                        <input
                            type="text"
                            className="rounded-xl w-[150px]"
                            value={location}
                            onChange={(e) => handleLocationChange(stockId, e.target.value)}
                        />
                    )
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
                cell: ({ getValue }) => <span>{getValue().toUpperCase()}</span>,
            },
            {
                header: 'Stock',
                accessorKey: 'quantity',
                cell: ({ row }) => {
                    const stockId = row.original.id
                    const quantity = updatedQuantities[stockId] ?? row.original.quantity
                    return (
                        <input
                            className="w-[70px] rounded-xl"
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
                        />
                    )
                },
            },
            //
            {
                header: 'Quantity Ordered',
                accessorKey: 'quantity_ordered',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity Received',
                accessorKey: 'quantity_received',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity Returned',
                accessorKey: 'quantity_returned',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity Sold',
                accessorKey: 'quantity_sold',
                cell: (info) => info.getValue(),
            },
            //
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
        setPage(1)
        setShowDrawer(false)
    }
    const handleUpdate = async (id: any, originalQuantity: any, originalLocation: any) => {
        const location = updatedLocation[id] ?? null
        const quantity = updatedQuantities[id] >= 0 ? updatedQuantities[id] : null

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

    const onPaginationChange = (page: number) => {
        const maxPages = Math.ceil(totalData / pageSize)
        if (page > maxPages) {
            setPage(1)
        } else {
            setPage(page)
        }
    }

    const onSelectChange = (value = 0) => {
        setPage(1)
        setPageSize(Number(value))
    }

    const handleDownload = async () => {
        try {
            let filterValue = ''
            if (currentSelectedPage?.value === 'sku' && globalFilter) {
                filterValue = `&sku=${encodeURIComponent(globalFilter)}`
            }
            if (currentSelectedPage?.value === 'name' && globalFilter) {
                filterValue = `&name=${encodeURIComponent(globalFilter)}`
            }
            const downloadUrl = `inventory?download=true&${typeFetch}${filterValue}`
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

    const handleSelect = (value: any) => {
        const selected = FilterArray.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const hanldeUpdateInventory = () => {
        navigate(`/app/updateInventory`)
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="p-4">
            <div className="upper flex flex-col md:flex-row justify-between mb-5 items-center">
                <button
                    className="xl:hidden bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg flex mb-4 justify-end items-end"
                    onClick={handleDownload}
                >
                    <IoMdDownload className="text-xl" />
                </button>
                <div className="flex gap-2">
                    <div className="mb-4 w-full md:w-auto">
                        <input
                            type="search"
                            placeholder="Search SKU/Name"
                            value={globalFilter}
                            onChange={(e) => {
                                console.log('final Value', e.target.value)
                                setGlobalFilter(e.target.value)
                            }}
                            className="p-2 border rounded shadow-md w-full md:w-auto"
                        />
                    </div>
                    <div>
                        <div className="bg-gray-100 items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                            <Dropdown
                                className=" text-xl text-black bg-gray-200 font-bold  "
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={handleSelect}
                            >
                                {FilterArray?.map((item, key) => {
                                    return (
                                        <DropdownItem key={key} eventKey={item.value}>
                                            <span>{item.label}</span>
                                        </DropdownItem>
                                    )
                                })}
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-7 xl:flex-row items-center xl:items-baseline ">
                    <div className="drop flex flex-row gap-5 w-full md:w-auto items-center">
                        <Button variant="new" onClick={hanldeUpdateInventory}>
                            Update Inventory
                        </Button>
                        <Button variant="new" onClick={hanldeFilter}>
                            Filter
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
            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} overflow />
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
