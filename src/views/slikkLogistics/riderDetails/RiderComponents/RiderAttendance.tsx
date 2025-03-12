import { Pagination, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { ridersService } from '@/store/services/riderServices'
import { setCount, setRidersAttendanceData, setFrom, setTo, setPage, setPageSize } from '@/store/slices/riderSlice/rider.slice'
import { RiderSlice } from '@/store/types/riderAddTypes'
import React, { useEffect, useState } from 'react'
import { Option, pageSizeOptions } from '../../taskTracking/TaskCommonType'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { RiderAttendanceColumns } from './RiderAttendanceColumns'

const RiderAttendance = () => {
    const dispatch = useAppDispatch()
    const [globalFilter, setGlobalFilter] = useState('')
    const { riderAttendance, count, from, to, page, pageSize } = useAppSelector<RiderSlice>((state) => state.riderData)
    const { data: riderDataForAttendance, isSuccess } = ridersService.useRiderAttendanceQuery(
        {
            from: from || '',
            mobile: globalFilter,
            page: page,
            pageSize: pageSize,
            to: to || '',
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRidersAttendanceData(riderDataForAttendance?.data?.results || []))
            dispatch(setCount(riderDataForAttendance?.data?.count || 0))
        }
    }, [riderDataForAttendance, isSuccess, dispatch, from, to, page, pageSize, globalFilter])

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
            <div className="flex justify-between">
                <div>
                    <input
                        type="search"
                        placeholder="Enter mobile number"
                        className="w-full border border-gray-300 rounded p-2"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target?.value)}
                    />
                </div>
                <UltimateDatePicker
                    from={from}
                    dispatch={dispatch}
                    setFrom={setFrom}
                    to={to}
                    setTo={setTo}
                    handleDateChange={handleDateChange}
                />
            </div>
            <EasyTable overflow mainData={riderAttendance} columns={RiderAttendanceColumns} page={page} pageSize={pageSize} />

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

export default RiderAttendance
