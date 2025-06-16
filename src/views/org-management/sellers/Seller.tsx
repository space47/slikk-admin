import React, { useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { useNavigate } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions, Product } from './sellerCommon'
import AccessDenied from '@/views/pages/AccessDenied'
import { useSellerColumns } from './sellerUtils/useSellerColumns'
import { useFetchApi } from '@/commonHooks/useFetchApi'

const Seller = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const queryParam = useMemo(() => {
        const filterValue = globalFilter ? `&name=${globalFilter}` : ''
        return `merchant/company?p=${page}&page_size=${pageSize}${filterValue}`
    }, [page, pageSize, globalFilter])

    const { data, totalData, responseStatus } = useFetchApi<Product[]>({ url: queryParam })

    const columns = useSellerColumns()

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
                <div className="flex items-end justify-end mb-4 order-first xl:order-1">
                    <button
                        className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                        onClick={() => navigate('/app/sellers/addnew')}
                    >
                        ADD NEW SELLER
                    </button>{' '}
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
