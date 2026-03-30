/* eslint-disable @typescript-eslint/no-explicit-any */
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
    setQcStatus,
} from '@/store/slices/qualityCheckSlice/qualityCheckList.slice'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import moment from 'moment'
import { useQcColumns } from './qcUtils/useQcColumns'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import ReduxDateRange from '@/common/ReduxDateRange'
import { notification, Spin } from 'antd'
import { Button, Card } from '@/components/ui'
import { IoBagCheckSharp } from 'react-icons/io5'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { FaDownload } from 'react-icons/fa6'
import { commonDownloadFromRtk } from '@/common/commonDownload'

//TODO: add company filter

const QCListTable = () => {
    const dispatch = useAppDispatch()
    const [globalFilter, setGlobalFilter] = useState('')
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [brandId, setBrandId] = useState<string | null>(null)
    const [companyCode, setCompanyCode] = useState<string>('')
    const { qcDetails, count, from, page, pageSize, to, qcStatus } = useAppSelector<QcInitialStateTypes>((state) => state.qualityCheck)
    const { summary } = useAppSelector((state: { qualityCheck: QcInitialStateTypes }) => state.qualityCheck)
    const [downloadShipmentCall, downloadResponse] = qualityCheckService.useLazyQcCheckDownloadQuery()

    const { data, isLoading, isSuccess, error, isFetching } = qualityCheckService.useQualityCheckDataQuery(
        {
            from: from,
            to: to,
            grn_id: globalFilter ?? '',
            page: page,
            pageSize: pageSize,
            company_id: companyCode || '',
            qc_failed: qcStatus === 'failed' ? true : false,
            qc_passed: qcStatus === 'passed' ? true : false,
            brand_id: brandId ? brandId : '',
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

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    useEffect(() => {
        if (downloadResponse.isSuccess) {
            const isNoContent =
                downloadResponse?.data === undefined ||
                downloadResponse?.data === null ||
                (typeof downloadResponse.data === 'string' && (downloadResponse as any).data.trim() === '')

            if (isNoContent) {
                notification.warning({ message: 'No data available to download' })
                return
            }

            commonDownloadFromRtk(downloadResponse.data, `QC_DATA-${moment().format('YYYY-MM-DD HH:mm:ss a')}.csv`)
        }

        if (downloadResponse.isError) {
            notification.error({ message: 'Failed to download' })
        }
    }, [downloadResponse.isSuccess, downloadResponse.isError, downloadResponse.data])

    const handleCardClick = (key?: string) => {
        if (!key) return
        if (qcStatus === key) {
            dispatch(setQcStatus(''))
        } else {
            dispatch(setQcStatus(key))
        }
        dispatch(setPage(1))
    }

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
        { label: 'QC Failed', value: summaryData?.total_qc_failed, color: 'text-red-600', key: 'failed' },
        { label: 'QC Passed', value: summaryData?.total_qc_passed, color: 'text-green-600', key: 'passed' },
        { label: 'Qty Received', value: summaryData?.total_quantity_received },
        { label: 'Qty Sent', value: summaryData?.total_quantity_sent },
        { label: 'Synced Qty', value: summaryData?.total_synced_quantity, color: 'text-blue-600' },
        { label: 'Un-Synced Qty', value: unsyncedCalculation, color: 'text-orange-600' },
    ]

    const handleDownloadQc = () => {
        downloadShipmentCall({
            from: from,
            to: to,
            grn_id: globalFilter ?? '',
            page: page,
            pageSize: pageSize,
            company_id: companyCode || '',
            qc_failed: qcStatus === 'failed' ? true : false,
            qc_passed: qcStatus === 'passed' ? true : false,
            brand_id: brandId ? brandId : '',
        })
    }

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
                <div className="flex flex-wrap items-end justify-between gap-6 mb-6 mt-8">
                    <div className="flex flex-wrap items-end gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 mb-1">Search GRN</label>
                            <input
                                type="text"
                                placeholder="Search GRN here..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="h-11 px-4 w-64 border border-gray-300 rounded-lg shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-blue-500 transition"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ">
                        <ReduxDateRange id="qcChecklist" handleDateChange={handleDateChange} setFrom={setFrom} setTo={setTo} />

                        <Button
                            variant="new"
                            size="sm"
                            icon={<FaDownload />}
                            loading={downloadResponse.isLoading}
                            disabled={downloadResponse.isLoading}
                            onClick={handleDownloadQc}
                        >
                            Download
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex flex-col w-80">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Select Company</label>
                        <Select
                            isClearable
                            className="react-select-container w-full"
                            classNamePrefix="react-select"
                            options={companyList}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id?.toString()}
                            onChange={(newVal) => setCompanyCode(newVal?.id?.toString() || '')}
                        />
                    </div>
                    <div className="flex flex-col w-80">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Select Brand</label>
                        <Select
                            isClearable
                            className="react-select-container w-full"
                            classNamePrefix="react-select"
                            options={brands.brands}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id?.toString()}
                            onChange={(newVal) => setBrandId(newVal?.id?.toString() || '')}
                        />
                    </div>
                </div>
                <div className="grid xl:grid-cols-7 grid-cols-4 gap-2 mb-8">
                    {summaryCards.map(({ label, value, color, key }) => {
                        const isActive = qcStatus === key

                        return (
                            <Card
                                key={label}
                                onClick={() => handleCardClick(key)}
                                className={`rounded-xl border cursor-pointer transition-all
                    ${isActive ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50' : 'border-gray-200 hover:shadow-md'}
                `}
                            >
                                <p className="text-sm text-gray-500 font-medium">{label}</p>
                                <p className={`text-xl font-semibold ${color ?? 'text-gray-900'}`}>{value ?? 0}</p>
                            </Card>
                        )
                    })}
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
