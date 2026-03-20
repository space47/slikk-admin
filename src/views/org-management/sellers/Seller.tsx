/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import { useSellerColumns } from './sellerUtils/useSellerColumns'
import { Button, Input, Spinner } from '@/components/ui'
import { FaDownload, FaPlus } from 'react-icons/fa'
import { notification, Select } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { setVendorList, VendorStateType, setCount, setPage, setPageSize, setFilterValue } from '@/store/slices/vendorsSlice/vendors.slice'
import { vendorService } from '@/store/services/vendorService'
import PageCommon from '@/common/PageCommon'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { FaShop } from 'react-icons/fa6'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import moment from 'moment'

const SellerSearchType = [
    { label: 'Name', value: 'name' },
    { label: 'Code', value: 'code' },
]

const Seller = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { count, page, pageSize, vendorList, filterValue } = useAppSelector<VendorStateType>((state) => state.vendor)
    const { debounceFilter } = useDebounceInput({ globalFilter: filterValue, delay: 500 })
    const [searchType, setSearchType] = useState('name')
    const { data, isLoading, isError, isSuccess, error, isFetching } = vendorService.useGetVendorListQuery(
        {
            page,
            name: searchType === 'name' ? debounceFilter : '',
            code: searchType === 'code' ? debounceFilter : '',
            pageSize,
        },
        { refetchOnMountOrArgChange: true },
    )

    const [sellersDownload, sellersDownloadResponse] = vendorService.useLazyVendorsDownloadQuery()

    useEffect(() => {
        if (isSuccess) {
            dispatch(setVendorList(data?.data?.results))
            dispatch(setCount(data?.data?.count))
        }
        if (isError) {
            if (error && 'status' in error && error?.status === 403) {
                notification.error({ message: 'Access Denied' })
            } else {
                const errorMessage = getApiErrorMessage(error)
                notification.error({ message: errorMessage || 'Failed to load' })
            }
        }
    }, [dispatch, isSuccess, data?.data])

    const columns = useSellerColumns()

    useEffect(() => {
        if (sellersDownloadResponse.isSuccess) {
            const url = window.URL.createObjectURL(sellersDownloadResponse.data)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `sellers-${moment().format('YYYY-MM-DD HH:mm:ss a')}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        }
        if (sellersDownloadResponse.isError) {
            notification.error({ message: 'Failed to download' })
        }
    }, [sellersDownloadResponse.isSuccess, sellersDownloadResponse.isError, sellersDownloadResponse.data])

    const handleDownload = async () => {
        sellersDownload({
            name: searchType === 'name' ? debounceFilter : '',
            code: searchType === 'code' ? debounceFilter : '',
        })
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <FaShop className="text-2xl text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">Vendor Management</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-md">Manage and organize Slikk Vendors</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center mb-7">
                <div>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center order-2 lg:order-1 w-full lg:w-auto">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md w-full sm:w-auto">
                            <Input
                                type="search"
                                placeholder="Search here..."
                                value={filterValue}
                                className=" w-full p-4 border border-gray-300 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                onChange={(e) => dispatch(setFilterValue(e.target.value))}
                            />
                        </div>
                        <div>
                            <Select
                                className="w-auto"
                                value={searchType}
                                placeholder="Select Search Type"
                                options={SellerSearchType}
                                onChange={(value) => {
                                    setSearchType(value)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-end gap-2 justify-end mb-4 order-first xl:order-1">
                    <Button
                        size="sm"
                        variant="new"
                        icon={<FaDownload className="text-lg" />}
                        loading={sellersDownloadResponse.isLoading}
                        disabled={sellersDownloadResponse.isLoading}
                        onClick={() => handleDownload()}
                    >
                        Export
                    </Button>
                    <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate('/app/sellers/addnew')}>
                        ADD NEW SELLER
                    </Button>
                </div>
            </div>
            {(isLoading || isFetching) && (
                <div className="flex items-center justify-center mt-2 mb-8">
                    <Spinner size={30} />
                </div>
            )}
            {isError && <NotFoundData />}
            {vendorList && vendorList?.length > 0 && !isError && (
                <>
                    <EasyTable mainData={vendorList} columns={columns} page={page} pageSize={pageSize} />
                    <PageCommon
                        dispatch={dispatch}
                        page={page}
                        pageSize={pageSize}
                        setPage={setPage}
                        setPageSize={setPageSize}
                        totalData={count}
                    />
                </>
            )}
        </div>
    )
}

export default Seller
