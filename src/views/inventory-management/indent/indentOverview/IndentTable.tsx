/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Pagination, Select, Tabs } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { indentService } from '@/store/services/indentService'
import { IndentStateType, setCount, setIndentData, setPage, setPageSize } from '@/store/slices/indentSlice/indentSlice'
import React, { useEffect, useState } from 'react'
import { useIndentColumns } from '../indentUtils/useIndentColumns'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import AccessDenied from '@/views/pages/AccessDenied'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { notification } from 'antd'

const IndentTable = () => {
    const dispatch = useAppDispatch()
    const { indent, count, page, pageSize } = useAppSelector<IndentStateType>((state) => state.indent)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [storeCode, setStoreCode] = useState<any[]>(storeList[0]?.id ? [storeList[0].id] : [])
    const [activeTab, setActiveTab] = useState('target')

    useEffect(() => {
        if (storeCode?.length <= 0) {
            notification.warning({
                message: 'Store is required',
            })
        }
    }, [storeCode])

    const { data, error, isSuccess } = indentService.useIndentDataQuery({
        mobile: '',
        page,
        pageSize,
        store_id: storeCode.join(','),
        source_type: activeTab === 'target' ? 'target' : 'source',
    })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setIndentData(data?.data?.results))
            dispatch(setCount(data?.data?.count))
        }
    }, [isSuccess, data, dispatch])

    const handleChange = (tab: string) => {
        setActiveTab(tab)
        dispatch(setPage(1))
    }

    const columns = useIndentColumns({ storeList, store_type: activeTab })

    if (error && 'status' in error && error.status === 403) {
        return <AccessDenied />
    }

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
            {/* Store Selector */}
            <div className="w-full md:max-w-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Store</label>
                <Select
                    isClearable
                    isMulti
                    options={storeList}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    value={storeList.filter((opt) => storeCode.includes(opt.id))}
                    onChange={(selectedOptions) => {
                        setStoreCode(selectedOptions?.map((opt) => opt.id) || [])
                    }}
                />
            </div>

            <div className="border-b pb-2">
                <Tabs value={activeTab} onChange={handleChange}>
                    <TabList>
                        <TabNav value="target">
                            <span
                                className={`text-base md:text-lg font-semibold ${
                                    activeTab === 'target' ? 'text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                Target
                            </span>
                        </TabNav>
                        <TabNav value="source">
                            <span
                                className={`text-base md:text-lg font-semibold ${
                                    activeTab === 'source' ? 'text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                Source
                            </span>
                        </TabNav>
                    </TabList>
                </Tabs>
            </div>

            {/* Table */}
            <div className="border rounded-xl overflow-hidden">
                <EasyTable overflow mainData={indent} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={count} onChange={(page) => dispatch(setPage(page))} />
                <div className="w-full sm:w-auto min-w-[150px]">
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            dispatch(setPage(1))
                            dispatch(setPageSize(Number(option?.value)))
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default IndentTable
