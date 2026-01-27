import React, { useEffect, useMemo, useState } from 'react'
import { FaSitemap } from 'react-icons/fa'
import { Select, Spin } from 'antd'
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Input } from '@/components/ui'
import { returnOrderDataService } from '@/store/services/returnOrderService'
import { ReturnData } from '@/store/types/returnOrderData.types'
import { ReturnItemColumns } from '../returnItemsUtils/ReturnItemColumns'
import { RTLStatusArray } from '../returnItemsUtils/returnItemcommons'
import { GenericCommonTypes } from '@/common/allTypesCommon'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { PiKeyReturnFill } from 'react-icons/pi'

const ReturnItemTable = () => {
    const [returnListData, setReturnListData] = useState<ReturnData[]>([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [searchFilter, setSearchFilter] = useState('')
    const [statusData, setStatusData] = useState<string>('')
    const returnListQuery = returnOrderDataService.useReturnManagementQuery({ page, pageSize, status: statusData })
    const [getReturnDetails, returnDetailsQuery] = returnOrderDataService.useLazyReturnItemDetailsQuery()

    const loadingState =
        returnListQuery.isLoading || returnListQuery.isFetching || returnDetailsQuery.isLoading || returnDetailsQuery.isFetching

    const handleSearchChange = (e: GenericCommonTypes['InputEvent']) => {
        setSearchFilter(e.target.value)
        setPage(1)
    }

    const handleStatusChange = (value?: string) => {
        setStatusData(value ?? '')
        setPage(1)
    }
    useEffect(() => {
        if (!searchFilter) return
        const debouncedData = setTimeout(() => {
            getReturnDetails({ return_item_id: searchFilter.trim() })
        }, 500)

        return () => clearTimeout(debouncedData)
    }, [searchFilter, getReturnDetails])

    useEffect(() => {
        if (!searchFilter && returnListQuery.isSuccess && returnListQuery.data) {
            setReturnListData(returnListQuery.data.data.results)
            setCount(returnListQuery.data.data.count || 0)
        }
    }, [returnListQuery.isSuccess, returnListQuery.data, returnListQuery.data?.data.count, searchFilter])

    const displayedData: ReturnData[] = searchFilter ? (returnDetailsQuery.isSuccess ? [returnDetailsQuery.data.data] : []) : returnListData

    const totalCount = useMemo(() => {
        return searchFilter ? 0 : count
    }, [searchFilter, count])

    const columns = ReturnItemColumns()

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                            <Input
                                type="search"
                                value={searchFilter}
                                placeholder="Search by Return Item ID"
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="space-y-2 xl:mt-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <FaSitemap className="text-orange-500" />
                                Status
                            </label>
                            <Select
                                allowClear
                                showSearch
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

                    {!searchFilter && (
                        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                            <PageCommon
                                page={page}
                                pageSize={pageSize}
                                setPage={setPage}
                                setPageSize={setPageSize}
                                totalData={totalCount}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Spin>
    )
}

export default ReturnItemTable
