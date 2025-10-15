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
                filterValue = `${currentSelectedPage?.value}=${encodeURIComponent(globalFilter ?? '')}`
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
                filterValue = `${currentSelectedPage?.value}=${encodeURIComponent(globalFilter ?? '')}`
            }
            const downloadUrl = `inventory?download=true&${typeFetch}${filterValue}`
            const response = await axiosInstance.get(downloadUrl, {
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
        <div className="p-2 shadow-xl rounded-xl ">
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
                            className="p-2 border rounded shadow-md w-full md:w-auto"
                            onChange={(e) => {
                                console.log('final Value', e.target.value)
                                setGlobalFilter(e.target.value)
                            }}
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
                        <Button variant="new" onClick={() => navigate(`/app/updateInventory`)}>
                            Update Inventory
                        </Button>
                        <Button variant="new" onClick={handleFilter}>
                            Filter
                        </Button>
                    </div>

                    <div>
                        <button
                            className="hidden xl:flex bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg items-center "
                            disabled={isDownloading}
                            onClick={handleDownload}
                        >
                            <IoMdDownload className="text-xl" />
                            <span className="flex gap-1 items-center">EXPORT {isDownloading && <Spinner size={20} color="blue" />}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex mb-7 items-center gap-2 p-3  rounded-lg shadow-sm">
                <span className="text-gray-500 text-lg font-bold">Stock Count:</span>
                <span className="text-gray-900 font-normal  text-lg">{stockCount || 0}</span>
            </div>
            <EasyTable overflow mainData={data || []} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    className="w-[400px] md:w-auto mb-4 md:mb-0 "
                    total={totalData}
                    onChange={onPaginationChange}
                />
                <div className="flex flex-row items-center justify-between xl:justify-normal w-full md:w-auto xl:gap-5">
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        className="w-1/2 md:w-auto"
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
