/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { IoMdDownload } from 'react-icons/io'
import { notification } from 'antd'
import ImageMODAL from '@/common/ImageModal'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions, Stock } from './stockOverviewCommon'
import { Dropdown, Spinner } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useStockOverViewColumns } from './stockOverViewUtils/useStockOverViewColumns'
import FilterProductCommon from '@/common/FilterProductCommon'
import { commonDownload } from '@/common/commonDownload'

const FilterArray = [
    { label: 'SKU', value: 'sku' },
    { label: 'NAME', value: 'name' },
    { label: 'SKID', value: 'skid' },
    { label: 'BARCODE', value: 'barcode' },
]

const StockOverview = () => {
    const [data, setData] = useState<Stock[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: number]: number }>({})
    const [updatedLocation, setUpdatedLocation] = useState<{ [key: number]: string }>({})
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<any>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(FilterArray[0])
    const navigate = useNavigate()
    const [brandList, setBrandList] = useState([])
    const [typeFetch, setTypeFetch] = useState('')
    const [accessDenied, setAccessDenied] = useState(false)
    const [showDrawer, setShowDrawer] = useState(false)
    const locationInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const qtyInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const [isDownloading, setIsDownloading] = useState(false)
    const [stockCount, setStockCount] = useState(0)

    const fetchAndFilterData = async () => {
        try {
            let filterValue = ''
            if (globalFilter) {
                filterValue = `&${currentSelectedPage?.value}=${encodeURIComponent(globalFilter ?? '')}`
            }
            const response = await axiosInstance.get(`inventory?p=${page}&page_size=${pageSize}&${typeFetch}${filterValue}`)
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
            setStockCount(response?.data.stock_count)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
        }
    }

    useEffect(() => {
        fetchAndFilterData()
    }, [page, pageSize, globalFilter, typeFetch])

    const handleOpenModal = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setUpdatedQuantities((prevQuantity) => {
            if (prevQuantity[id] === newQuantity) return prevQuantity
            return { ...prevQuantity, [id]: newQuantity }
        })
        setTimeout(() => {
            qtyInputRef.current[id]?.focus()
        }, 0)
    }

    const handleLocationChange = (id: number, newLocation: string) => {
        setUpdatedLocation((prevLocations) => {
            if (prevLocations[id] === newLocation) return prevLocations
            return { ...prevLocations, [id]: newLocation }
        })
        setTimeout(() => {
            locationInputRef.current[id]?.focus()
        }, 0)
    }

    const handleFilter = () => {
        setShowDrawer(true)
    }

    const handleUpdate = async (id: any, originalQuantity: any, originalLocation: any) => {
        console.log(originalQuantity, originalLocation)
        const location = updatedLocation[id] || ''
        const quantity = updatedQuantities[id] != null ? Number(updatedQuantities[id]) : ''

        try {
            const body = {
                quantity: quantity,
                location: location,
            }

            const filteredObjects = Object.fromEntries(Object.entries(body).filter(([, val]) => val !== ''))
            const response = await axiosInstance.patch(`inventory/${id}`, filteredObjects)
            notification.success({
                message: 'SUCCESS',
                description: response?.data?.message || 'UPDATE SUCCESS',
            })
        } catch (error) {
            notification.error({ message: 'Field not set' })
            console.error(error)
        }
    }

    const columns = useStockOverViewColumns({
        handleUpdate,
        handleOpenModal,
        updatedLocation,
        handleLocationChange,
        locationInputRef,
        handleQuantityChange,
        qtyInputRef,
        updatedQuantities,
    })

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
        setIsDownloading(true)
        notification.info({
            message: 'Download in process',
        })
        try {
            let filterValue = ''
            if (globalFilter) {
                filterValue = `&${currentSelectedPage?.value}=${encodeURIComponent(globalFilter ?? '')}`
            }
            const response = await axiosInstance.get(`inventory?download=true&${typeFetch}${filterValue}`, {
                responseType: 'blob',
            })
            commonDownload(response, `All-StockOverview.csv`)
        } catch (error) {
            console.error('Error downloading the file:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleSelect = (value: any) => {
        const selected = FilterArray.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="p-6 shadow-2xl rounded-2xl bg-white dark:bg-gray-900 transition-all duration-300">
            <div className="flex flex-col xl:flex-row justify-between gap-5 mb-6">
                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                    <div className="relative w-full md:w-72">
                        <input
                            type="search"
                            placeholder="🔍 Search SKU / Name..."
                            value={globalFilter}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-200"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-52">
                        <Dropdown
                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 rounded-xl"
                            title={currentSelectedPage?.value ? currentSelectedPage.label : 'Select Category'}
                            onSelect={handleSelect}
                        >
                            {FilterArray?.map((item, key) => (
                                <DropdownItem key={key} eventKey={item.value}>
                                    <span>{item.label}</span>
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between xl:justify-end items-center gap-3">
                    <div className="flex gap-3">
                        <Button
                            variant="new"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md"
                            onClick={() => navigate(`/app/updateInventory`)}
                        >
                            Update Inventory
                        </Button>
                        <Button variant="new" onClick={handleFilter}>
                            Filter
                        </Button>
                    </div>

                    <button
                        className="hidden xl:flex bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-xl shadow-md items-center gap-2 transition-all"
                        disabled={isDownloading}
                        onClick={handleDownload}
                    >
                        <IoMdDownload className="text-xl" />
                        <span className="font-medium flex items-center gap-1">
                            Export {isDownloading && <Spinner size={18} color="blue" />}
                        </span>
                    </button>
                    <button
                        className="xl:hidden bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow-md flex items-center gap-2"
                        onClick={handleDownload}
                    >
                        <IoMdDownload className="text-lg" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl shadow-sm mb-5">
                <span className="text-gray-500 dark:text-gray-400 font-semibold text-base">Stock Count:</span>
                <span className="text-gray-900 dark:text-gray-100 text-lg font-bold">{stockCount || 0}</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-md">
                <EasyTable overflow mainData={data || []} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-6">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalData}
                    className="w-full md:w-auto"
                    onChange={onPaginationChange}
                />
                <div className="flex items-center gap-3">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-medium">Rows per page:</label>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        className="min-w-[100px]"
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
                <FilterProductCommon
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    setTypeFetch={setTypeFetch}
                    brandList={brandList}
                    setBrandList={setBrandList}
                />
            )}
        </div>
    )
}

export default StockOverview
