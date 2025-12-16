/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useMemo } from 'react'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { IoMdDownload } from 'react-icons/io'
import { notification } from 'antd'
import ImageMODAL from '@/common/ImageModal'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import EasyTable from '@/common/EasyTable'
import { Stock } from './stockOverviewCommon'
import { useStockOverViewColumns } from './stockOverViewUtils/useStockOverViewColumns'
import FilterProductCommon from '@/common/FilterProductCommon'
import { commonDownload } from '@/common/commonDownload'
import { HiFilter, HiRefresh, HiSearch } from 'react-icons/hi'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { BsBoxSeam } from 'react-icons/bs'
import { FiGrid, FiPlusCircle } from 'react-icons/fi'
import { Button } from '@/components/ui'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import PageCommon from '@/common/PageCommon'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useAppSelector } from '@/store'
import { FaStore } from 'react-icons/fa'

const FilterArray = [
    { label: 'SKU', value: 'sku' },
    { label: 'NAME', value: 'name' },
    { label: 'SKID', value: 'skid' },
    { label: 'BARCODE', value: 'barcode' },
]

const StockOverview = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: number]: number }>({})
    const [updatedLocation, setUpdatedLocation] = useState<{ [key: number]: string }>({})
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<any>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(FilterArray[0])
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const navigate = useNavigate()
    const [brandList, setBrandList] = useState([])
    const [typeFetch, setTypeFetch] = useState('')
    const [showDrawer, setShowDrawer] = useState(false)
    const locationInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const qtyInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const [isDownloading, setIsDownloading] = useState(false)
    const [stockCount, setStockCount] = useState(0)
    const [searchTrigger, setSearchTrigger] = useState(0)
    const [store, setStore] = useState<number[]>([])

    const query = useMemo(() => {
        const filterValue = searchOnEnter ? `&${currentSelectedPage?.value}=${encodeURIComponent(searchOnEnter ?? '')}` : ''
        const storeId = store?.length ? `&store_id=${store?.join(',')}` : ''
        return `inventory?p=${page}&page_size=${pageSize}&${typeFetch}${filterValue}${storeId}`
    }, [page, pageSize, searchOnEnter, typeFetch, currentSelectedPage, searchTrigger, store])

    const { data, responseData, totalData, responseStatus, refetch, loading } = useFetchApi<Stock>({ url: query, initialData: [] })

    useEffect(() => {
        if (responseData) setStockCount(responseData?.stock_count)
    }, [responseData])

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

    const handleUpdate = async (id: any, originalQuantity: any, originalLocation: any) => {
        console.log(originalQuantity, originalLocation)
        const location = updatedLocation[id] || ''
        const quantity = updatedQuantities[id] != null ? Number(updatedQuantities[id]) : ''
        try {
            const body = { quantity: quantity, location: location }
            const filteredObjects = Object.fromEntries(Object.entries(body).filter(([, val]) => val !== ''))
            const response = await axiosInstance.patch(`inventory/${id}`, filteredObjects)
            successMessage(response)
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error || 'Failed to Update')
            }
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

    const handleSearch = () => {
        setSearchOnEnter(globalFilter)
        setPage(1)
        setSearchTrigger((prev) => prev + 1)
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        notification.info({ message: 'Download in process' })
        try {
            let filterValue = ''
            if (globalFilter) filterValue = `&${currentSelectedPage?.value}=${encodeURIComponent(globalFilter ?? '')}`
            const response = await axiosInstance.get(`inventory?download=true&${typeFetch}${filterValue}`, { responseType: 'blob' })
            commonDownload(response, `All-StockOverview.csv`)
        } catch (error) {
            console.error('Error downloading the file:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const renderButtonUI = () => {
        return (
            <div className="flex flex-wrap gap-3">
                <div>
                    <Button variant="blue" icon={<FiPlusCircle className="text-lg" />} onClick={() => navigate(`/app/updateInventory`)}>
                        Update Inventory
                    </Button>
                </div>
                <Button variant="gray" icon={<HiFilter className="text-lg" />} onClick={() => setShowDrawer(true)}>
                    Filters
                </Button>
                <Button
                    disabled={isDownloading}
                    icon={<IoMdDownload className="text-lg" />}
                    loading={isDownloading}
                    onClick={handleDownload}
                >
                    Export Data
                </Button>
            </div>
        )
    }

    const renderSearchUI = () => {
        return (
            <div className="flex flex-col lg:flex-row gap-5 mb-3">
                <div className="flex-1 flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="Search by SKU, product name..."
                                value={globalFilter}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleSearch()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="blue" icon={<HiSearch className="text-lg" />} onClick={handleSearch}></Button>
                        <div className="min-w-[160px]">
                            <Select
                                size="sm"
                                isSearchable={true}
                                value={FilterArray.find((option) => currentSelectedPage?.value === option?.value)}
                                options={FilterArray}
                                className="w-full"
                                onChange={(option) => {
                                    if (option) setCurrentSelectedPage(option)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (responseStatus === 403) {
        return <AccessDenied />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
            <div className="max-w-screen-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <BsBoxSeam className="text-blue-600 dark:text-blue-400" />
                        Stock Overview
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track Slikk inventory</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6">
                    {renderSearchUI()}
                    <div className="mb-4 mt-4 flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                        <div className="w-full xl:w-1/2 md:w-1/2">
                            <div className="flex items-center gap-2 mb-1">
                                <FaStore className="text-blue-600 text-lg" />
                                <h2 className="text-lg font-semibold text-gray-800">Store Selection</h2>
                            </div>
                            <Select
                                isClearable
                                isMulti
                                options={storeList}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id?.toString()}
                                onChange={(selectedOptions) => {
                                    setStore(selectedOptions?.map((opt) => opt.id) || [])
                                }}
                            />
                        </div>
                        {renderButtonUI()}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border border-blue-100 dark:border-gray-700 rounded-xl p-5 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <FiGrid className="text-2xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Stock Count</p>
                                    <p className="xl:md:text-3xl text-md  font-bold text-gray-900 dark:text-white mt-1">
                                        {stockCount?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="  md:block">
                                <Button icon={<HiRefresh className="text-lg" />} size="sm" onClick={() => refetch()}>
                                    <span className="xl:block md:block hidden">Refresh Data</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Loading inventory data...</p>
                        </div>
                    )}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                        <EasyTable overflow mainData={data || []} columns={columns} page={page} pageSize={pageSize} />
                    </div>
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
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
                        typeFetch={typeFetch}
                    />
                )}
            </div>
        </div>
    )
}

export default StockOverview
