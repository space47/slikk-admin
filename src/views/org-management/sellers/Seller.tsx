/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { useNavigate } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions, Product } from './sellerCommon'
import AccessDenied from '@/views/pages/AccessDenied'
import { useSellerColumns } from './sellerUtils/useSellerColumns'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { Button, Spinner } from '@/components/ui'
import { FaDownload } from 'react-icons/fa'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import { handleDownloadCsv } from '@/common/allTypesCommon'
import { ColumnDef } from '@tanstack/react-table'

const Seller = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [isDownloading, setIsDownloading] = useState(false)

    const queryParam = useMemo(() => {
        const filterValue = globalFilter ? `&name=${globalFilter}` : ''
        return `merchant/company?p=${page}&page_size=${pageSize}${filterValue}`
    }, [page, pageSize, globalFilter])

    const { data, totalData, responseStatus } = useFetchApi<Product[]>({ url: queryParam })
    const columns = useSellerColumns()

    const convertToCSV = (data: Product[], columns: ColumnDef<Product>[]) => {
        const header = columns
            ?.filter((item) => item.header !== 'Edit')
            .map((col) => col.header)
            .join(',')
        const rows = data
            .map((row: any) => {
                return columns
                    ?.filter((item) => item.header !== 'Edit')
                    .map((col: any) => {
                        return row[col.accessorKey] || ''
                    })
                    .join(',')
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

    if (responseStatus === '403') {
        return <AccessDenied />
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        className="p-2 border rounded"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
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
            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            if (option?.value) {
                                setPage(1)
                                setPageSize(option?.value)
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Seller
