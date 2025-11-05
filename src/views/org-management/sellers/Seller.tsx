/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import { Product } from './sellerCommon'
import { useSellerColumns } from './sellerUtils/useSellerColumns'
import { Button, Input, Spinner } from '@/components/ui'
import { FaDownload } from 'react-icons/fa'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import { escapeCsvValue, handleDownloadCsv } from '@/common/allTypesCommon'
import { ColumnDef } from '@tanstack/react-table'
import { useAppDispatch, useAppSelector } from '@/store'
import { setVendorList, VendorStateType, setCount, setPage, setPageSize } from '@/store/slices/vendorsSlice/vendors.slice'
import { vendorService } from '@/store/services/vendorService'
import PageCommon from '@/common/PageCommon'
import { HiSearch } from 'react-icons/hi'

const Seller = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [globalFilter, setGlobalFilter] = useState('')
    const [isDownloading, setIsDownloading] = useState(false)
    const { count, page, pageSize, vendorList } = useAppSelector<VendorStateType>((state) => state.vendor)
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const { data, isLoading, isError, isSuccess, error } = vendorService.useGetVendorListQuery(
        {
            page,
            name: searchOnEnter,
            pageSize,
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setVendorList(data?.data?.results))
            dispatch(setCount(data?.data?.count))
        }
        if (isError) {
            if (error && 'status' in error && error?.status === 403) {
                notification.error({ message: 'Access Denied' })
            } else {
                notification.error({ message: 'Error in fetching data' })
            }
        }
    }, [dispatch, isSuccess, data])

    const columns = useSellerColumns()

    const convertToCSV = (data: Product[], columns: ColumnDef<Product>[]) => {
        const filteredColumns = columns?.filter((item) => item.header !== 'Edit')

        const header = filteredColumns.map((col) => escapeCsvValue(col.header)).join(',')

        const rows = data
            .map((row: any) => {
                return filteredColumns.map((col: any) => escapeCsvValue(row[col.accessorKey])).join(',')
            })
            .join('\n')

        return `${header}\n${rows}`
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        notification.info({ message: 'Download in process' })
        let userData = []
        try {
            const filterValue = globalFilter ? `&name=${globalFilter}` : ''
            const response = await axioisInstance.get(`merchant/company?download=true&p=1&page_size=1000${filterValue}`)
            userData = response.data?.data?.results
            handleDownloadCsv(userData, columns, convertToCSV, 'Sellers.csv')
            notification.success({ message: 'Download complete' })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || error?.message || 'Error downloading CSV' })
            }
        } finally {
            setIsDownloading(false)
        }
    }

    const handleSearchWithIcon = () => {
        setSearchOnEnter(globalFilter)
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center mb-7">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center order-2 lg:order-1 w-full lg:w-auto">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md w-full sm:w-auto">
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search here..."
                            value={globalFilter}
                            className="w-full sm:w-[180px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    setSearchOnEnter(e.target.value)
                                }
                            }}
                        />
                        <div className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer" onClick={handleSearchWithIcon}>
                            <HiSearch className="text-white text-xl" />
                        </div>
                    </div>
                </div>
                <div className="flex items-end gap-2 justify-end mb-4 order-first xl:order-1">
                    <Button variant="new" className="flex gap-2 items-center" onClick={() => handleDownload()}>
                        {isDownloading ? <Spinner color="white" size={30} /> : <FaDownload className="text-lg" />}
                        Export
                    </Button>
                    <button
                        className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                        onClick={() => navigate('/app/sellers/addnew')}
                    >
                        ADD NEW SELLER
                    </button>
                </div>
            </div>
            {isLoading && (
                <div className="flex items-center justify-center">
                    <Spinner size={30} />
                </div>
            )}
            <EasyTable mainData={vendorList} columns={columns} page={page} pageSize={pageSize} />
            <PageCommon dispatch={dispatch} page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
        </div>
    )
}

export default Seller
