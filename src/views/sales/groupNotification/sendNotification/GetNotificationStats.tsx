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
import { DoubleSidedImage } from '@/components/shared'

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
    const [activeTab, setActiveTab] = useState<'sent' | 'schedule'>('sent')

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/notification/stats?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}`)
            setData(response.data.data.results)
            setTotalData(response.data.data.count)
        } catch (error: any) {
            if (error.response?.status === 403) {
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
            setScheduleData(response.data.message.results)
            setTotalScheduleData(response.data.message.count)
        } catch (error: any) {
            if (error.response?.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        if (activeTab === 'sent') {
            fetchData(page, pageSize)
        } else if (activeTab === 'schedule') {
            fetchSchedularData(schedulePage, schedulePageSize)
        }
    }, [page, pageSize, schedulePage, schedulePageSize, globalFilter, from, to, activeTab])

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
                            className="p-2 border rounded"
                            onChange={(e) => setGlobalFilter(e.target.value)}
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

            <div className="flex gap-6 mt-10">
                <div
                    className={`flex  cursor-pointer ${activeTab === 'sent' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => setActiveTab('sent')}
                >
                    <span className="text-xl font-bold">Sent Notifications</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${activeTab === 'schedule' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                >
                    <span className="text-xl font-bold">Schedular Notifications</span>
                </div>
            </div>

            {activeTab === 'sent' && (
                <div>
                    {data?.length > 0 ? (
                        <SentNotif
                            data={data}
                            page={page}
                            pageSize={pageSize}
                            totalData={totalData}
                            onSelectChange={onSelectChange}
                            onPaginationChange={onPaginationChange}
                        />
                    ) : (
                        <div className="flex justify-center flex-col gap-3 items-center xl:mt-20 ">
                            <DoubleSidedImage src="/img/others/img-2.png" darkModeSrc="/img/others/img-2-dark.png" alt="NO DATA FOUND" />
                            <div className="text-xl font-bold">NO DATA FOUND</div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'schedule' && (
                <div>
                    {Scheduledata?.length > 0 ? (
                        <SchedularTable
                            data={Scheduledata}
                            page={schedulePage}
                            pageSize={schedulePageSize}
                            totalData={totalScheduleData}
                            onPaginationChange={onPaginationChange}
                            onSelectChange={onSelectChange}
                        />
                    ) : (
                        <div className="flex justify-center flex-col gap-3 items-center xl:mt-20 ">
                            <DoubleSidedImage src="/img/others/img-2.png" darkModeSrc="/img/others/img-2-dark.png" alt="NO DATA FOUND" />
                            <div className="text-xl font-bold">NO DATA FOUND</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default GetNotificationStats
