/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaTrash, FaUser } from 'react-icons/fa'
import { GrUpdate } from 'react-icons/gr'
import EventActionModal from './EventActionModal'
import { useAppSelector } from '@/store'
import { EventSeriesSliceType } from '@/store/slices/eventSeriesSlice/eventSeriesSlice'
import { useParams } from 'react-router-dom'

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

    const hanldeUpdate = (mobile: string) => {
        setReplaceModal(true)
        setMobile(mobile)
    }
    const handleRemove = (mobile: string) => {
        setRemoveModal(true)
        setMobile(mobile)
    }

    console.log('Registered User', registeredUsers)
    return (
        <div>
            <div className="col-span-full bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="col-span-full bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Event Registration</h2>
                        {Math.ceil(totalCount / pageSize) > 1 && (
                            <div className="flex space-x-1">
                                <button
                                    disabled={page === 1}
                                    className="px-3 py-1 rounded-md border disabled:opacity-50"
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, i) => i + 1).map((number) => (
                                    <button
                                        key={number}
                                        className={`px-3 py-1 rounded-md border ${page === number ? 'bg-blue-500 text-white' : ''}`}
                                        onClick={() => setPage(number)}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    disabled={page === Math.ceil(totalCount / pageSize)}
                                    className="px-3 py-1 rounded-md border disabled:opacity-50"
                                    onClick={() => setPage(Math.min(Math.ceil(totalCount / pageSize), page + 1))}
                                >
                                    Next
                                </button>
                            </div>
                        )}
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
                                    <div className="flex gap-2">
                                        <div onClick={() => hanldeUpdate(user?.user?.mobile)}>
                                            <span className="text-xl font-bold text-blue-500 cursor-pointer">Replace</span>
                                        </div>
                                        <div onClick={() => handleRemove(user?.user?.mobile)}>
                                            <span className="text-xl font-bold text-red-500 cursor-pointer">Delete</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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
