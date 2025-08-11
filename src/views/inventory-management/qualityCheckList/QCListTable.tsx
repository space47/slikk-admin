import React, { useEffect, useState } from 'react'
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
    setCustomChange,
} from '@/store/slices/qualityCheckSlice/qualityCheckList.slice'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import moment from 'moment'
import LoadingSpinner from '@/common/LoadingSpinner'
import { useQcColumns } from './qcUtils/useQcColumns'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import UltimateReduxDatePicker from '@/common/UltimateReduxDatePicker'

const QCListTable = () => {
    const dispatch = useAppDispatch()
    const [globalFilter, setGlobalFilter] = useState('')
    const { qcDetails, count, from, page, pageSize, to, customChange } = useAppSelector<QcInitialStateTypes>((state) => state.qualityCheck)
    const { data, isLoading, isSuccess, error } = qualityCheckService.useQualityCheckDataQuery(
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
        if (isSuccess && data) {
            dispatch(setQcDetails(data.data.results))
            dispatch(setCount(data.data.count))
        }
    }, [dispatch, isSuccess, data])

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
    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="">
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
                <div className="mb-4">
                    <UltimateReduxDatePicker
                        customChange={customChange}
                        setCustomChange={setCustomChange}
                        dispatch={dispatch}
                        from={from}
                        to={to}
                        setFrom={setFrom}
                        setTo={setTo}
                        handleDateChange={handleDateChange}
                    />
                </div>
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
    )
}

export default QCListTable
