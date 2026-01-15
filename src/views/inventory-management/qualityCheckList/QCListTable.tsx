import React, { useEffect, useMemo, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { qualityCheckService } from '@/store/services/qualityCheckListService'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    QcInitialStateTypes,
    setPage,
    setCount,
    setFrom,
    setPageSize,
    setQcDetails,
    setTo,
    setSummary,
} from '@/store/slices/qualityCheckSlice/qualityCheckList.slice'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import moment from 'moment'
import { useQcColumns } from './qcUtils/useQcColumns'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import ReduxDateRange from '@/common/ReduxDateRange'
import { Spin } from 'antd'
import { Card } from '@/components/ui'
import { IoBagCheckSharp } from 'react-icons/io5'

const QCListTable = () => {
    const dispatch = useAppDispatch()
    const [globalFilter, setGlobalFilter] = useState('')
    const { qcDetails, count, from, page, pageSize, to } = useAppSelector<QcInitialStateTypes>((state) => state.qualityCheck)
    const { summary } = useAppSelector((state: { qualityCheck: QcInitialStateTypes }) => state.qualityCheck)

    const { data, isLoading, isSuccess, error, isFetching } = qualityCheckService.useQualityCheckDataQuery(
        {
            from: from,
            to: to,
            grn_id: globalFilter ?? '',
            page: page,
            pageSize: pageSize,
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (!isSuccess || !data) return

        dispatch(setQcDetails(data.data.results))
        dispatch(setCount(data.data.count))
        if (page === 1 && data.summary) {
            dispatch(setSummary(data.summary))
        }
    }, [dispatch, isSuccess, data, page])

    const summaryData = useMemo(
        () => ({
            total_qc_failed: summary?.total_qc_failed ?? 0,
            total_qc_passed: summary?.total_qc_passed ?? 0,
            total_quantity_received: summary?.total_quantity_received ?? 0,
            total_quantity_sent: summary?.total_quantity_sent ?? 0,
            total_skus: summary?.total_skus ?? 0,
            total_synced_quantity: summary?.total_synced_quantity ?? 0,
        }),
        [summary],
    )

    const unsyncedCalculation = useMemo(() => {
        const synced = Number(summary?.total_synced_quantity ?? 0)
        const qcPassed = Number(summary?.total_qc_passed ?? 0)
        return qcPassed - synced
    }, [summary])

    const summaryCards = [
        { label: 'Total SKU', value: summaryData?.total_skus },
        { label: 'QC Failed', value: summaryData?.total_qc_failed, color: 'text-red-600' },
        { label: 'QC Passed', value: summaryData?.total_qc_passed, color: 'text-green-600' },
        { label: 'Qty Received', value: summaryData?.total_quantity_received },
        { label: 'Qty Sent', value: summaryData?.total_quantity_sent },
        { label: 'Synced Qty', value: summaryData?.total_synced_quantity, color: 'text-blue-600' },
        { label: 'Un-Synced Qty', value: unsyncedCalculation, color: 'text-orange-600' },
    ]

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            const toDate = dates[1] ? moment(dates[1]).add(1, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD')
            dispatch(setTo(toDate))
        }
    }
    const columns = useQcColumns()
    if (error && 'status' in error && error.status === 403) {
        return <AccessDenied />
    }

    return (
        <Spin spinning={isLoading || isFetching}>
            <div className="shadow-xl p-2">
                <div className="flex gap-2 items-center">
                    <span>
                        <IoBagCheckSharp className="text-3xl text-purple-600" />
                    </span>
                    <span>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Quality Check list</h1>
                        <p className="text-sm text-gray-500">View and manage all quality check data</p>
                    </span>
                </div>
                <div className="upper flex justify-between mb-5 items-center ">
                    <div className="mb-4 mt-8">
                        <input
                            type="text"
                            placeholder="Search GRN here...."
                            value={globalFilter}
                            className="p-2 border rounded"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 ml-10">
                        <ReduxDateRange id="qcChecklist" handleDateChange={handleDateChange} setFrom={setFrom} setTo={setTo} />
                    </div>
                </div>
                <div className="grid xl:grid-cols-7 grid-cols-4 gap-2 mb-8">
                    {summaryCards.map(({ label, value, color }) => (
                        <Card key={label} className=" rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">{label}</p>
                            <p className={`text-xl font-semibold ${color ?? 'text-gray-900'}`}>{value ?? 0}</p>
                        </Card>
                    ))}
                </div>
                <EasyTable overflow mainData={qcDetails} columns={columns} page={page} pageSize={pageSize} />
                <div className="flex items-center justify-between mt-4">
                    <Pagination pageSize={pageSize} currentPage={page} total={count} onChange={(page) => dispatch(setPage(page))} />
                    <div style={{ minWidth: 130 }}>
                        <Select<Option>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => {
                                if (option) {
                                    dispatch(setPageSize(option?.value))
                                    dispatch(setPage(1))
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </Spin>
    )
}

export default QCListTable
