import { ridersService } from '@/store/services/riderServices'
import { DayWiseData, RiderPerformanceList } from '@/store/types/riderAddTypes'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiCheckCircle, FiDollarSign, FiList, FiXCircle } from 'react-icons/fi'
import CommonPageHeader from '@/common/CommonPageHeader'
import UltimateDateFilter from '@/common/UltimateDateFilter'
import { RiderPerformanceColumns } from '../RiderUtils/RiderPerformanceColumns'
import EasyTable from '@/common/EasyTable'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { Spin } from 'antd'
import { Badge } from '@/components/ui'

const RiderPerformance = () => {
    const { mobile } = useParams()
    const [from, setFrom] = useState(dayjs().format('YYYY-MM-DD'))
    const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'))
    const [overallPerformance, setOverallPerformance] = useState<RiderPerformanceList['over_all_performance'] | null>(null)
    const [dayWisePerformance, setDayWisePerformance] = useState<DayWiseData[]>([])

    const { data, isSuccess, isLoading, isError, error, isFetching } = ridersService.useRiderPerformanceDataQuery(
        { mobile: mobile || '', from, to },
        { skip: !mobile },
    )

    useEffect(() => {
        if (!isSuccess || !data?.data) return
        const apiData = data.data
        setOverallPerformance(apiData.over_all_performance ?? null)
        const formatted = Object.values(apiData.day_wise_performance || {}) as DayWiseData[]
        setDayWisePerformance(formatted)
    }, [isSuccess, data])

    const stats = useMemo(
        () => [
            {
                label: 'Completed Tasks',
                value: overallPerformance?.completed_tasks ?? 0,
                icon: <FiCheckCircle />,
                color: 'bg-green-50 text-green-600',
            },
            {
                label: 'Total Earnings',
                value: overallPerformance?.total_earnings ?? 0,
                icon: <FiDollarSign />,
                color: 'bg-emerald-50 text-emerald-600',
            },
            {
                label: 'Total Tasks',
                value: overallPerformance?.total_tasks ?? 0,
                icon: <FiList />,
                color: 'bg-blue-50 text-blue-600',
            },
            {
                label: 'Cancelled Tasks',
                value: overallPerformance?.cancelled_tasks ?? 0,
                icon: <FiXCircle />,
                color: 'bg-red-50 text-red-600',
            },
        ],
        [overallPerformance],
    )

    const columns = RiderPerformanceColumns()

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (!dates || !dates[0]) return
        setFrom(dayjs(dates[0]).format('YYYY-MM-DD'))
        setTo(dates[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'))
    }

    const errorMessage = getApiErrorMessage(error)

    return (
        <Spin spinning={isLoading || isFetching}>
            <CommonPageHeader desc="See Rider Performance with overall as well as day wise performance" label="Rider Performance" />
            <div className="flex justify-end">
                <UltimateDateFilter
                    from={from}
                    to={to}
                    setFrom={setFrom}
                    setTo={setTo}
                    handleDateChange={handleDateChange}
                    customClass="border w-auto rounded-md h-auto font-bold mr-10 bg-black text-white flex justify-center"
                />
            </div>
            {isError && <NotFoundData text={errorMessage} />}
            {!isLoading && !isError && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 mt-6 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <h3 className="text-xl font-semibold text-gray-800">{stat.value}</h3>
                                    </div>

                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${stat.color}`}>{stat.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <div className="mb-2">
                            <Badge content={'Day Wise Data'} />
                        </div>
                        {dayWisePerformance.length === 0 ? (
                            <div className="text-center text-gray-500 py-10 border rounded-lg">
                                No data available for selected date range
                            </div>
                        ) : (
                            <EasyTable overflow noPage mainData={dayWisePerformance} columns={columns} />
                        )}
                    </div>
                </>
            )}
        </Spin>
    )
}

export default RiderPerformance
