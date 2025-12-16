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
import { FiBell, FiFilter, FiPlus, FiSend, FiX } from 'react-icons/fi'
import { Button } from '@/components/ui'
import { MdOutlineMessage } from 'react-icons/md'

const GetNotificationStats = () => {
    const [data, setData] = useState<NOTIFYSTATS[]>([])
    const [totalData, setTotalData] = useState(0)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [ScheduleData, setScheduleData] = useState<SchedularTypes[]>([])
    const [totalScheduleData, setTotalScheduleData] = useState(0)
    const [schedulePage, setSchedulePage] = useState(1)
    const [schedulePageSize, setSchedulePageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [accessDenied, setAccessDenied] = useState(false)
    const [activeTab, setActiveTab] = useState<'sent' | 'schedule'>('schedule')

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
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex gap-2 items-center">
                    <span>
                        <MdOutlineMessage className="text-purple-600" />
                    </span>
                    Notifications Manager
                </h1>
                <p className="text-gray-600">Manage notification templates and sent notifications</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Notifications</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, content, or recipient..."
                                value={globalFilter}
                                className="w-3/4 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                            {globalFilter && (
                                <button onClick={() => setGlobalFilter('')} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <FiX className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Create Button */}
                    <div className="flex items-center gap-2 xl:mt-6 md:mt-6 ">
                        <Button icon={<FiPlus />} variant="blue" size="sm" onClick={handleSeller}>
                            Create Notification
                        </Button>
                        <UltimateDatePicker
                            customClass="border w-auto rounded-md h-auto font-bold  bg-black text-white flex justify-center"
                            from={from}
                            setFrom={setFrom}
                            to={to}
                            setTo={setTo}
                            handleDateChange={handleDateChange}
                        />
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
                <div className="flex space-x-1 border-b border-gray-200">
                    <button
                        className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-200 ${
                            activeTab === 'schedule'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-t-lg'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                        }`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        <FiBell size={18} />
                        <span>Notification Templates</span>
                        {ScheduleData?.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                                {ScheduleData.length}
                            </span>
                        )}
                    </button>

                    <button
                        className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-200 ${
                            activeTab === 'sent'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-t-lg'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                        }`}
                        onClick={() => setActiveTab('sent')}
                    >
                        <FiSend size={18} />
                        <span>Sent Notifications</span>
                        {data?.length > 0 && (
                            <span className="ml-2 bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                                {data.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
                {activeTab === 'sent' && (
                    <div className="p-1">
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
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="relative w-64 h-64 mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-50 animate-pulse"></div>
                                    <FiSend className="relative w-full h-full text-gray-300 p-12" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sent Notifications</h3>
                                <p className="text-gray-500 text-center max-w-md mb-6">
                                    No notifications have been sent yet. Create your first notification to get started.
                                </p>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                                    onClick={handleSeller}
                                >
                                    <FiPlus />
                                    Create First Notification
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="p-1">
                        {ScheduleData?.length > 0 ? (
                            <SchedularTable
                                data={ScheduleData}
                                page={schedulePage}
                                pageSize={schedulePageSize}
                                totalData={totalScheduleData}
                                onPaginationChange={onPaginationChange}
                                onSelectChange={onSelectChange}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="relative w-64 h-64 mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full opacity-50 animate-pulse"></div>
                                    <FiBell className="relative w-full h-full text-gray-300 p-12" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notification Templates</h3>
                                <p className="text-gray-500 text-center max-w-md mb-6">
                                    You have not created any notification templates. Create templates to schedule notifications easily.
                                </p>
                                <button
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                    onClick={handleSeller}
                                >
                                    <FiPlus />
                                    Create Template
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Status Bar */}
            {(data?.length > 0 || ScheduleData?.length > 0) && (
                <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Sent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            <span>Draft</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiFilter className="text-gray-400" />
                        <span>Showing {activeTab === 'sent' ? data?.length : ScheduleData?.length} items</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GetNotificationStats
