/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { ridersService } from '@/store/services/riderServices'
import { setCount, setRidersAttendanceData, setFrom, setTo, setPage, setPageSize } from '@/store/slices/riderSlice/rider.slice'
import { RiderSlice } from '@/store/types/riderAddTypes'
import React, { useEffect, useState } from 'react'
import { Option, pageSizeOptions } from '../../taskTracking/TaskCommonType'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import UltimateYearMonthPicker from '@/common/UltimateYearMonthPicker'
import { generateColumns } from './RiderAttendanceColumns'
import { useNavigate } from 'react-router-dom'
import { handleDownloadAttendanceCsv } from './riderAttendanceFunction'
import { FaDownload } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'

const RiderAttendance = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [globalFilter, setGlobalFilter] = useState('')
    const { riderAttendance, count, from, to, page, pageSize } = useAppSelector<RiderSlice>((state) => state.riderData)
    const [selectedYear, setSelectedYear] = useState<string>(moment().year().toString())
    const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('MM'))
    const [isWeek, setIsWeek] = useState<boolean>(false)

    const {
        data: riderDataForAttendance,
        isSuccess,
        error: riderError,
    } = ridersService.useRiderAttendanceQuery(
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

    const handleYearMonthChange = (year: string, month: string) => {
        const startDate = moment(`${year}-${month}-01`).format('YYYY-MM-DD')
        const endDate = moment(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD')
        dispatch(setFrom(startDate))
        dispatch(setTo(endDate))
    }

    const handleWeekChange = (start: string, end: string) => {
        dispatch(setFrom(start))
        dispatch(setTo(end))
    }

    const groupedRiderAttendance = riderAttendance.reduce(
        (acc, curr) => {
            const existingUser = acc.find((item) => item.user === curr.user?.mobile)

            if (existingUser) {
                existingUser.attendanceData.push({
                    id: curr.id,
                    checkin_date: curr.checkin_date,
                    checkin_time: curr.checkin_time,
                    checkout_time: curr.checkout_time,
                    create_date: curr.create_date,
                    distance_covered: curr.distance_covered,
                    latitude: curr.latitude,
                    longitude: curr.longitude,
                    other_data: curr.other_order_data,
                    update_date: curr.update_date,
                    user_type: curr.user_type,
                })
            } else {
                acc.push({
                    user_name: `${curr?.user?.first_name} ${curr?.user?.last_name}`,
                    user: curr.user?.mobile || '',
                    attendanceData: [
                        {
                            id: curr.id,
                            checkin_date: curr.checkin_date,
                            checkin_time: curr.checkin_time,
                            checkout_time: curr.checkout_time,
                            create_date: curr.create_date,
                            distance_covered: curr.distance_covered,
                            latitude: curr.latitude,
                            longitude: curr.longitude,
                            other_data: curr.other_order_data,
                            update_date: curr.update_date,
                            user_type: curr.user_type,
                        },
                    ],
                })
            }

            return acc
        },
        [] as { user_name: string; user: string; attendanceData: any[] }[],
    )

    const handleUserData = (mobile: string) => {
        navigate(`/app/riders/attendance/${mobile}`)
    }

    const columns = generateColumns(selectedYear, selectedMonth, handleUserData, isWeek, from, to)

    if (riderError && 'originalStatus' in riderError) {
        if (riderError?.originalStatus === 403) {
            return <AccessDenied />
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
                <div className="flex gap-4">
                    <UltimateYearMonthPicker
                        setYear={setSelectedYear}
                        setMonth={setSelectedMonth}
                        handleYearMonthChange={handleYearMonthChange}
                        handleWeekChange={handleWeekChange}
                        setIsWeek={setIsWeek}
                        isWeek={isWeek}
                    />
                    <button
                        className="p-2 px-3 bg-gray-200 rounded-xl hover:bg-gray-300 "
                        onClick={() => handleDownloadAttendanceCsv(groupedRiderAttendance, columns, selectedMonth)}
                    >
                        <FaDownload className="text-xl" />
                    </button>
                </div>
            </div>
            <EasyTable overflow mainData={groupedRiderAttendance} columns={columns} page={page} pageSize={pageSize} />

            <div className="flex justify-between items-center">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={groupedRiderAttendance?.length || count}
                    className="mb-4 md:mb-0"
                    onChange={(value) => dispatch(setPage(value))}
                />

                <span>
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
                </span>
            </div>
        </div>
    )
}

export default RiderAttendance
