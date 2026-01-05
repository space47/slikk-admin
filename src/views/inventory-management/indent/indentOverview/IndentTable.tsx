/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Input, Pagination, Select, Tabs } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { indentService } from '@/store/services/indentService'
import { IndentStateType, setCount, setIndentData, setPage, setPageSize, setFrom, setTo } from '@/store/slices/indentSlice/indentSlice'
import React, { useEffect, useMemo, useState } from 'react'
import { useIndentColumns } from '../indentUtils/useIndentColumns'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import AccessDenied from '@/views/pages/AccessDenied'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { notification, Spin } from 'antd'
import IndentStatusModal from './indentComponents/IndentStatusModal'
import moment from 'moment'
import { IndentStatusArray } from '../indentUtils/indent.types'
import ReduxDateRange from '@/common/ReduxDateRange'
import debounce from 'lodash/debounce'
import NotFoundData from '@/views/pages/NotFound/Notfound'

const IndentTable = () => {
    const dispatch = useAppDispatch()
    const { indent, count, page, pageSize, from, to } = useAppSelector<IndentStateType>((state) => state.indent)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [storeCode, setStoreCode] = useState<any[]>([1])
    const [searchFilter, setSearchFilter] = useState('')
    const [activeTab, setActiveTab] = useState('target')
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string[]>([])
    const [selectedIndentId, setSelectedIndentId] = useState<number | null>(null)

    const handleStatusClick = (id: number) => {
        setSelectedIndentId(id)
        setShowStatusModal(true)
    }

    useEffect(() => {
        if (storeCode?.length <= 0) {
            notification.warning({
                message: 'Store is required',
            })
        }
    }, [storeCode])

    const debouncedResults = useMemo(
        () =>
            debounce((value: string) => {
                setSearchFilter(value)
            }, 500),
        [],
    )

    useEffect(() => {
        return () => {
            debouncedResults.cancel()
        }
    }, [debouncedResults])

    const { data, error, isSuccess, isError, isLoading, isFetching } = indentService.useIndentDataQuery({
        mobile: '',
        page,
        pageSize,
        store_id: storeCode.join(','),
        source_type: activeTab === 'target' ? 'target' : 'source',
        from,
        to: moment(to).add(1, 'days').format('YYYY-MM-DD'),
        status: selectedStatus?.join(',') || '',
        document_id: searchFilter || '',
    })

    useEffect(() => {
        if (isSuccess) {
            if (searchFilter) {
                dispatch(setIndentData([data?.data as any]))
            } else {
                dispatch(setIndentData(data?.data?.results))
                dispatch(setCount(data?.data?.count))
            }
        }
    }, [isSuccess, data, dispatch])

    const handleChange = (tab: string) => {
        setActiveTab(tab)
        dispatch(setPage(1))
    }

    const columns = useIndentColumns({ storeList, store_type: activeTab, handleStatusClick })

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            const toDate = dates[1] ? moment(dates[1]).add(1, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD')
            dispatch(setTo(toDate))
        }
    }

    if (error && 'status' in error && error.status === 403) {
        return <AccessDenied />
    }

    return (
        <Spin spinning={isLoading || isFetching}>
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-end">
                    {/* Store */}
                    <div className="xl:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Store</label>
                        <Select
                            isClearable
                            isMulti
                            options={storeList}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id?.toString()}
                            value={storeList.filter((opt) => storeCode.includes(opt.id))}
                            onChange={(selectedOptions) => setStoreCode(selectedOptions?.map((opt) => opt.id) || [])}
                        />
                    </div>

                    {/* Status */}
                    <div className="xl:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Status</label>
                        <Select
                            isClearable
                            isMulti
                            options={IndentStatusArray}
                            placeholder="Select Status"
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.value}
                            value={IndentStatusArray.filter((opt) => selectedStatus.includes(opt.value))}
                            onChange={(selectedOptions) => setSelectedStatus(selectedOptions?.map((opt) => opt.value) || [])}
                        />
                    </div>

                    {/* Date Range */}
                    <div className="xl:col-span-4 xl:mr-8 flex justify-start xl:justify-end">
                        <ReduxDateRange handleDateChange={handleDateChange} id="indent" setFrom={setFrom} setTo={setTo} />
                    </div>
                </div>

                {/* Search */}
                <div className="flex justify-between items-center">
                    <div className="w-full md:w-1/2">
                        <Input
                            type="search"
                            className="rounded-xl"
                            placeholder="Search by Document Number..."
                            onChange={(e) => debouncedResults(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <Tabs value={activeTab} onChange={handleChange}>
                        <TabList className="flex gap-6">
                            <TabNav value="target">
                                <span
                                    className={`pb-3 text-sm md:text-base font-semibold border-b-2 transition-all ${
                                        activeTab === 'target'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Target
                                </span>
                            </TabNav>

                            <TabNav value="source">
                                <span
                                    className={`pb-3 text-sm md:text-base font-semibold border-b-2 transition-all ${
                                        activeTab === 'source'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Source
                                </span>
                            </TabNav>
                        </TabList>
                    </Tabs>
                </div>

                {/* Table */}

                {isSuccess && (
                    <>
                        <div className="border rounded-xl overflow-hidden">
                            <EasyTable overflow mainData={indent} columns={columns} page={page} pageSize={pageSize} />
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <Pagination pageSize={pageSize} currentPage={page} total={count} onChange={(page) => dispatch(setPage(page))} />

                            <div className="min-w-[160px]">
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
                    </>
                )}
                {isError && <NotFoundData />}

                {/* Status Modal */}
                {showStatusModal && (
                    <IndentStatusModal
                        key={selectedIndentId}
                        isOpen={showStatusModal}
                        id={selectedIndentId}
                        onClose={() => setShowStatusModal(false)}
                    />
                )}
            </div>
        </Spin>
    )
}

export default IndentTable
