import React, { useEffect, useMemo } from 'react'
import { USERANALYTICS_TYPE } from '@/store/types/userAnalytics.types'
import { fetchUserAnalytics, setFrom, setTo, setPage } from '@/store/slices/userAnalytics/userAnalytics.slice'
import moment from 'moment'
import { FaCheckCircle, FaUsers } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@/store'
import { Pagination } from '@/components/ui'
import AccessDenied from '@/views/pages/AccessDenied'
import EasyTable from '@/common/EasyTable'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import UserMap from './UserMap'

const UserAnalyticsTable = () => {
    const dispatch = useAppDispatch()
    const { data, from, to, total_logged_in, total_otp_verified, page, page_size, accessDenied } = useAppSelector(
        (state: { userAnalytics: USERANALYTICS_TYPE }) => state.userAnalytics,
    )

    useEffect(() => {
        dispatch(fetchUserAnalytics())
    }, [dispatch, from, to, page, page_size])

    const columns = useMemo(
        () => [
            { header: 'First Name', accessorKey: 'first_name' },
            { header: 'Last Name', accessorKey: 'last_name' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Mobile', accessorKey: 'mobile' },
        ],
        [],
    )

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            const toDate = dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            dispatch(setTo(toDate))
        }
    }

    const onPaginationChange = (page: number) => {
        dispatch(setPage(page))
    }

    if (accessDenied === true) {
        return <AccessDenied />
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex flex-col md:flex-row md:gap-6 p-4 bg-gray-100 rounded-lg shadow-md">
                    <div className="flex items-center gap-2 text-blue-600 mb-2 md:mb-0">
                        <FaUsers className="text-2xl" />
                        <span className="text-lg font-semibold">Online Users: {total_otp_verified}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle className="text-2xl" />
                        <span className="text-lg font-semibold">Total Logged Users: {total_logged_in}</span>
                    </div>
                </div>
                <div>
                    <UltimateDatePicker
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        handleDateChange={handleDateChange}
                        dispatch={dispatch}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                {data?.results && data?.results?.length === 0 ? (
                    <div className="flex flex-col gap-1 justify-center items-center h-screen">
                        <h3>No Data Available</h3>
                        <p>Try changing the date </p>
                    </div>
                ) : (
                    <EasyTable overflow columns={columns} mainData={data?.results || []} page={page} pageSize={page_size} />
                )}
            </div>
            <Pagination pageSize={page_size} currentPage={page} total={data?.count} onChange={onPaginationChange} />

            <div>
                <UserMap from={from} to={moment(to).add(1, 'days').format('YYYY-MM-DD')} />
            </div>
        </div>
    )
}

export default UserAnalyticsTable
