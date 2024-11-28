/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { NOTIFYSTATS, SchedularTypes } from './getNotiStats.common'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import AccessDenied from '@/views/pages/AccessDenied'
import SentNotif from './GetNotificationComponents/SentNotif'
import SchedularTable from './GetNotificationComponents/SchedularTable'

const GetNotificationStats = () => {
    const [data, setData] = useState<NOTIFYSTATS[]>([])
    const [totalData, setTotalData] = useState(0)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [Scheduledata, setScheduleData] = useState<SchedularTypes[]>([])
    const [totalScheduleData, setTotalScheduleData] = useState(0)
    const [schedulePage, setSchedulePage] = useState(1)
    const [schedulePageSize, setSchedulePageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [accessDenied, setAccessDenied] = useState(false)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/notification/stats?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}`)
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }
    const fetchSchedularData = async (schedulePage: number, schedulePageSize: number) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(
                `/user_notification?p=${schedulePage}&page_size=${schedulePageSize}&from=${from}&to=${To_Date}`,
            )
            const data = response.data.message.results
            const total = response.data.message.count
            setScheduleData(data)
            setTotalScheduleData(total)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize, globalFilter, from, to])

    useEffect(() => {
        fetchSchedularData(schedulePage, schedulePageSize)
    }, [schedulePage, schedulePageSize, globalFilter, from, to])

    const onPaginationChange = (type: string, page: number) => {
        if (type === 'sent') {
            setPage(page)
        } else if (type === 'schedule') {
            setSchedulePage(page)
        }
    }

    const onSelectChange = (type: string, value = 0) => {
        if (type === 'sent') {
            setPageSize(Number(value))
        } else if (type === 'schedule') {
            setSchedulePageSize(Number(value))
        }
    }

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    const navigate = useNavigate()

    const handleSeller = () => {
        navigate('/app/appsCommuncication/sendNotification/addNew')
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4 flex gap-2 items-center">
                    <div>
                        <div>Enter name:</div>
                        <input
                            type="text"
                            placeholder="Search here"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="flex gap-1 items-center flex-row mb-4">
                    <div className="">
                        <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
                    </div>
                    <div className=" mt-8 xl:mt-8 order-first xl:order-1">
                        <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-700 " onClick={handleSeller}>
                            <span className="font-semibold"> Create Notification</span>
                        </button>{' '}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-10 mt-6">
                {data?.length > 0 && (
                    <SentNotif
                        data={data}
                        page={page}
                        pageSize={pageSize}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        totalData={totalData}
                    />
                )}
                {Scheduledata?.length > 0 && (
                    <SchedularTable
                        data={Scheduledata}
                        page={schedulePage}
                        pageSize={schedulePageSize}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        totalData={totalScheduleData}
                    />
                )}
            </div>
        </div>
    )
}

export default GetNotificationStats
