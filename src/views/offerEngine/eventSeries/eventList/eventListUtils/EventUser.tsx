/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaTrash, FaUser } from 'react-icons/fa'
import { GrUpdate } from 'react-icons/gr'
import EventActionModal from './EventActionModal'
import { useAppSelector } from '@/store'
import { EventSeriesSliceType } from '@/store/slices/eventSeriesSlice/eventSeriesSlice'
import { useParams } from 'react-router-dom'
import { Pagination } from '@/components/ui'
import { FiDownload } from 'react-icons/fi'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

interface props {
    registeredUsers: any[]
    page: number
    pageSize: number
    setPage: (x: number) => void
    setPageSize: (x: number) => void
    totalCount: number
    renderUserStatus: any
}

const EventUser = ({ registeredUsers, page, pageSize, setPage, totalCount, renderUserStatus }: props) => {
    const { id } = useParams()
    const { eventSeriesData } = useAppSelector<EventSeriesSliceType>((state) => state.eventSeries)
    const [replaceModal, setReplaceModal] = useState(false)
    const [removeModal, setRemoveModal] = useState(false)
    const [mobile, setMobile] = useState('')

    const handleUpdate = (mobile: string) => {
        setReplaceModal(true)
        setMobile(mobile)
    }
    const handleRemove = (mobile: string) => {
        setRemoveModal(true)
        setMobile(mobile)
    }

    const handleExportUserList = async () => {
        try {
            const response = await axioisInstance.get(`/dashboard/user/events?event_id=${id}&download=true`, {
                responseType: 'blob',
            })
            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `UserList.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            notification.success({
                message: response?.data?.message || 'Exported Successfully',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failed to export',
            })
        }
    }

    console.log('Registered User', totalCount, pageSize)
    return (
        <div>
            <div className="col-span-full bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="col-span-full bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <div className="flex flex-col xl:flex-row xl:justify-between items-center gap-4 mb-6 px-4 py-3  rounded-2xl">
                        <h2 className="text-xl font-semibold text-gray-800 order-2 xl:order-none">Event Registration</h2>

                        <button
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors text-white font-medium py-2 px-5 rounded-xl order-1 xl:order-none shadow-md"
                            onClick={handleExportUserList}
                        >
                            <FiDownload className="text-lg" />
                            Export
                        </button>
                    </div>
                </div>

                {registeredUsers?.map((user: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <FaUser className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{user?.user?.name || 'N/A'}</h3>
                                    <p className="text-sm text-gray-500">{user?.user?.mobile}</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                    <FaPhone className="mr-2" />
                                    <span>{user?.user?.mobile}</span>
                                </div>
                                {user.user.email && (
                                    <div className="flex items-center text-gray-600">
                                        <FaEnvelope className="mr-2" />
                                        <span>{user.user.email}</span>
                                    </div>
                                )}
                            </div>
                            <div className="md:text-right">
                                <div className="flex gap-5">
                                    <div>
                                        <div className="mb-1">{renderUserStatus(user.status)}</div>
                                        <p className="text-sm text-gray-500">Code: {user.event_code}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col xl:flex-row">
                                        <div onClick={() => handleUpdate(user?.user?.mobile)}>
                                            <span className="text-xl font-bold text-blue-500 cursor-pointer hidden xl:block">Replace</span>
                                            <span>
                                                <GrUpdate className="text-xl text-blue-600 xl:hidden block" />
                                            </span>
                                        </div>
                                        <div onClick={() => handleRemove(user?.user?.mobile)}>
                                            <span className="text-xl font-bold text-red-500 cursor-pointer hidden xl:block">Delete</span>
                                            <span>
                                                <FaTrash className="text-xl text-red-600 xl:hidden block" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {Math.ceil(totalCount / pageSize) > 1 && (
                    <div className="flex space-x-1">
                        <Pagination
                            pageSize={pageSize}
                            currentPage={page}
                            total={totalCount}
                            className="mb-4 md:mb-0"
                            onChange={(e) => setPage(e)}
                        />
                    </div>
                )}
            </div>
            {replaceModal && (
                <EventActionModal
                    isEdit
                    dialogIsOpen={replaceModal}
                    mobile={mobile}
                    setIsOpen={setReplaceModal}
                    event_id={id}
                    eventSeriesData={eventSeriesData || []}
                />
            )}
            {removeModal && (
                <EventActionModal
                    dialogIsOpen={removeModal}
                    mobile={mobile}
                    setIsOpen={setRemoveModal}
                    event_id={id}
                    eventSeriesData={eventSeriesData || []}
                />
            )}
        </div>
    )
}

export default EventUser
