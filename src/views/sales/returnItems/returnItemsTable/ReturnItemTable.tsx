import React, { useEffect, useState } from 'react'
import { FaDownload, FaFilter, FaSearch, FaSitemap } from 'react-icons/fa'
import { notification, Select, Spin } from 'antd'
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button, Input } from '@/components/ui'
import { returnOrderDataService } from '@/store/services/returnOrderService'
import { ReturnData } from '@/store/types/returnOrderData.types'
import { ReturnItemColumns } from '../returnItemsUtils/ReturnItemColumns'
import { RTLFilters, RTLFilterTypes, RTLStatusArray } from '../returnItemsUtils/returnItemcommons'
import { GenericCommonTypes } from '@/common/allTypesCommon'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { PiKeyReturnFill } from 'react-icons/pi'
import ImageMODAL from '@/common/ImageModal'
import { useAppDispatch, useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

const ReturnItemTable = () => {
    const dispatch = useAppDispatch()
    const [returnListData, setReturnListData] = useState<ReturnData[]>([])
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyCode, setCompanyCode] = useState('')
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [searchFilter, setSearchFilter] = useState('')
    const [statusData, setStatusData] = useState<string>('')
    const [selectedBrand, setSelectedBrand] = useState('')
    const [filterTypeData, setFilterTypeData] = useState<string>(RTLFilters.SKU)
    const [particularRowImage, setParticularROwImage] = useState<string>('')
    const [showImageModal, setShowImageModal] = useState(false)
    const returnListQuery = returnOrderDataService.useReturnManagementQuery({
        page,
        pageSize,
        status: statusData,
        scanType: filterTypeData ?? '',
        scanValue: searchFilter?.trim(),
        brand: selectedBrand || '',
        company_code: companyCode || '',
    })
    const [returnListDownload, returnListDownloadResponse] = returnOrderDataService.useLazyReturnManagementDownloadQuery()

    const loadingState = returnListQuery.isLoading || returnListQuery.isFetching

    useEffect(() => {
        if (filterTypeData === RTLFilters.BRAND) {
            dispatch(getAllBrandsAPI())
        }
    }, [dispatch, filterTypeData])

    useEffect(() => {
        if (returnListDownloadResponse.isSuccess) {
            const url = window.URL.createObjectURL(returnListDownloadResponse.data)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'return-data.csv')
            document.body.appendChild(link)
            link.click()
            link.remove()
        }
        if (returnListDownloadResponse.isError) {
            notification.error({ message: 'Failed to download' })
        }
    }, [returnListDownloadResponse.isSuccess, returnListDownloadResponse.isError])

    const handleDownload = () => {
        returnListDownload({
            status: statusData,
            scanType: filterTypeData ?? '',
            scanValue: searchFilter?.trim(),
            brand: selectedBrand || '',
            company_code: companyCode || '',
        })
    }

    const handleSearchChange = (e: GenericCommonTypes['InputEvent']) => {
        setSearchFilter(e.target.value)
        setPage(1)
    }

    const handleStatusChange = (value?: string) => {
        setStatusData(value ?? '')
        setPage(1)
    }
    const handleFilterChange = (value?: string) => {
        setFilterTypeData(value ?? '')
        setPage(1)
    }

    useEffect(() => {
        if (returnListQuery.isSuccess && returnListQuery.data) {
            setReturnListData(returnListQuery.data.data.results)
            setCount(returnListQuery.data.data.count || 0)
        }
    }, [returnListQuery.isSuccess, returnListQuery.data, returnListQuery.data?.data.count, searchFilter])

    const displayedData: ReturnData[] = returnListData

    const handleOpenModal = (img: string) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const columns = ReturnItemColumns({ handleOpenModal })

    return (
        <Spin spinning={loadingState}>
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
                            <PiKeyReturnFill className="text-2xl text-white" />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Return Item Management</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage and organize return items efficiently</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-end">
                        <Button
                            variant="new"
                            size="sm"
                            icon={<FaDownload />}
                            loading={returnListDownloadResponse.isLoading}
                            onClick={handleDownload}
                        >
                            Download Data
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                        {filterTypeData === RTLFilters.BRAND && (
                            <div className="space-y-2 xl:mt-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FaSitemap className="text-orange-500" />
                                    Brand
                                </label>
                                <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    value={selectedBrand || 'Select Brand'}
                                    placeholder="Select Division"
                                    options={brands?.brands?.map((item) => ({
                                        label: item.name,
                                        value: item.name,
                                    }))}
                                    onChange={(value) => {
                                        setSelectedBrand(value)
                                    }}
                                />
                            </div>
                        )}
                        {filterTypeData === RTLFilters.COMPANY_CODE && (
                            <div className="flex flex-col w-full xl:mt-3 ">
                                <label className="font-semibold text-gray-700 mb-1">Select Company</label>
                                <Select
                                    allowClear
                                    showSearch
                                    className="react-select-container"
                                    options={companyList?.map((item) => ({
                                        label: item.name,
                                        value: item.code,
                                    }))}
                                    value={companyCode || 'Select Company'}
                                    onChange={(newVal) => setCompanyCode(newVal)}
                                />
                            </div>
                        )}
                        {filterTypeData !== RTLFilters.COMPANY_CODE && filterTypeData !== RTLFilters.BRAND && (
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FaSearch className="text-green-500" />
                                    Search
                                </label>
                                <Input
                                    type="search"
                                    value={searchFilter}
                                    placeholder="Search here..."
                                    className="h-auto rounded-lg"
                                    onChange={handleSearchChange}
                                />
                            </div>
                        )}
                        <div className="space-y-2 xl:mt-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <FaFilter className="text-blue-500" />
                                Select Filter
                            </label>
                            <Select
                                allowClear
                                className="w-full"
                                value={filterTypeData || undefined}
                                placeholder="Select Status"
                                options={RTLFilterTypes}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="space-y-2 xl:mt-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <FaSitemap className="text-orange-500" />
                                Status
                            </label>
                            <Select
                                allowClear
                                className="w-full"
                                value={statusData || undefined}
                                placeholder="Select Status"
                                options={RTLStatusArray}
                                onChange={handleStatusChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                    {returnListQuery.isError && (
                        <div className="py-20">
                            <NotFoundData />
                        </div>
                    )}

                    {!!displayedData.length && (
                        <EasyTable overflow mainData={displayedData} columns={columns} page={page} pageSize={pageSize} />
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                        <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
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
        </Spin>
    )
}

export default ReturnItemTable
