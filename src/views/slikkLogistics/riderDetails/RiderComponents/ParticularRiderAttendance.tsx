/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { ridersService } from '@/store/services/riderServices'
import { RiderAttendanceReportSliceType } from '@/store/types/riderAddTypes'
import React, { useEffect, useState } from 'react'
import { Option, pageSizeOptions } from '../../taskTracking/TaskCommonType'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { useParams } from 'react-router-dom'
import { particularRiderColumns } from './RiderAttendanceColumns'
import {
    setRidersAttendanceReportData,
    setCount,
    setFrom,
    setTo,
    setPage,
    setPageSize,
} from '@/store/slices/riderSlice/riderAttendanceReport.slice'

const ParticularRiderAttendance = () => {
    const { mobile } = useParams()
    const dispatch = useAppDispatch()
    const { riderAttendanceReport, count, from, to, page, pageSize } = useAppSelector<RiderAttendanceReportSliceType>(
        (state) => state.riderAttendanceReport,
    )
    const [changeDate, setChangeDate] = useState<boolean>(false)
    const { data: riderDataForAttendance, isSuccess } = ridersService.useRiderAttendanceReportQuery(
        {
            from: from || '',
            mobile: mobile,
            page: page,
            pageSize: pageSize,
            to: to || '',
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRidersAttendanceReportData(riderDataForAttendance?.data?.results || []))
            dispatch(setCount(riderDataForAttendance?.data?.count || 0))
        }
    }, [riderDataForAttendance, isSuccess, dispatch, from, to, page, pageSize])

    const onPaginationChange = (value: number) => {
        dispatch(setPage(value))
    }
    const onSelectChange = (value?: number) => {
        dispatch(setPage(1))
        dispatch(setPageSize(Number(value)))
    }

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            dispatch(setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')))
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <div className="mt-8">
                    <Button variant={changeDate ? 'reject' : 'new'} size="sm" onClick={() => setChangeDate((prev) => !prev)}>
                        {changeDate ? 'Close' : 'Change Date'}
                    </Button>
                </div>
                {changeDate && (
                    <UltimateDatePicker
                        from={from}
                        dispatch={dispatch}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        handleDateChange={handleDateChange}
                    />
                )}
            </div>
            <EasyTable overflow mainData={riderAttendanceReport || []} columns={particularRiderColumns} page={page} pageSize={pageSize} />

            <div className="flex justify-between items-center">
                <Pagination pageSize={pageSize} currentPage={page} total={count} className="mb-4 md:mb-0" onChange={onPaginationChange} />

                <span>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </span>
            </div>
        </div>
    )
}

export default ParticularRiderAttendance
