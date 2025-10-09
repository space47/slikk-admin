/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Pagination, Select, Tabs } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { indentService } from '@/store/services/indentService'
import {
    IndentStateType,
    setCount,
    setIndentData,
    setPage,
    setPageSize,
    setFrom,
    setTo,
    setDateField,
} from '@/store/slices/indentSlice/indentSlice'
import React, { useEffect, useState } from 'react'
import { useIndentColumns } from '../indentUtils/useIndentColumns'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import AccessDenied from '@/views/pages/AccessDenied'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { notification } from 'antd'
import IndentStatusModal from './indentComponents/IndentStatusModal'
import UltimateReduxDatePicker from '@/common/UltimateReduxDatePicker'
import moment from 'moment'

const IndentTable = () => {
    const dispatch = useAppDispatch()
    const { indent, count, page, pageSize, from, to, dateField } = useAppSelector<IndentStateType>((state) => state.indent)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [storeCode, setStoreCode] = useState<any[]>([1])
    const [activeTab, setActiveTab] = useState('target')
    const [showStatusModal, setShowStatusModal] = useState(false)
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

    const { data, error, isSuccess } = indentService.useIndentDataQuery({
        mobile: '',
        page,
        pageSize,
        store_id: storeCode.join(','),
        source_type: activeTab === 'target' ? 'target' : 'source',
        from,
        to: moment(to).add(1, 'days').format('YYYY-MM-DD'),
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
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
            {/* Store Selector */}
            <div className="flex justify-between items-center">
                <div className="w-full md:max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Store</label>
                    <Select
                        isClearable
                        isMulti
                        options={storeList}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id?.toString()}
                        value={storeList.filter((opt) => storeCode.includes(opt.id))}
                        onChange={(selectedOptions) => {
                            setStoreCode(selectedOptions?.map((opt) => opt.id) || [])
                        }}
                    />
                </div>
                <div>
                    <UltimateReduxDatePicker
                        customChange={dateField}
                        setCustomChange={setDateField}
                        dispatch={dispatch}
                        from={from}
                        to={to}
                        setFrom={setFrom}
                        setTo={setTo}
                        handleDateChange={handleDateChange}
                    />
                </div>
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
            {showStatusModal && (
                <IndentStatusModal
                    key={selectedIndentId}
                    isOpen={showStatusModal}
                    id={selectedIndentId}
                    onClose={() => setShowStatusModal(false)}
                />
            )}
        </div>
    )
}

export default IndentTable
