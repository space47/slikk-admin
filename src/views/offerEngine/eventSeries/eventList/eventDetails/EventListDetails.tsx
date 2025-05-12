/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaCheckCircle,
    FaTimesCircle,
    FaGlobe,
    FaLock,
    FaTicketAlt,
} from 'react-icons/fa'
import { Button } from '@/components/ui'
import LoadingSpinner from '@/common/LoadingSpinner'
import AssignUserModal from '../eventListUtils/AssignUserModal'
import { useAppDispatch, useAppSelector } from '@/store'
import { EventSeriesSliceType, setEventSeriesDetails } from '@/store/slices/eventSeriesSlice/eventSeriesSlice'
import EventCarousel from '../eventListUtils/EventCarousel'
import { eventSeriesService } from '@/store/services/eventSeriesService'

const EventListDetails = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const [isAddEvent, setIsAddEvent] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10
    const { eventSeriesData, eventSeriesDetails } = useAppSelector<EventSeriesSliceType>((state) => state.eventSeries)
    const eventData = eventSeriesDetails
    // Calculate pagination
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = eventData?.event_users?.slice(indexOfFirstUser, indexOfLastUser) || []
    const totalPages = Math.ceil((eventData?.event_users?.length || 0) / usersPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const { data: eventDataDet, isSuccess } = eventSeriesService.useEventSeriesDataQuery({
        event_id: id,
    })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEventSeriesDetails(eventDataDet.data || []))
        }
    }, [dispatch, isSuccess, eventDataDet])

    if (!eventData) {
        return (
            <div className="flex justify-center p-8">
                <LoadingSpinner />
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    const renderUserStatus = (status: string) => {
        switch (status) {
            case 'CANCELLED':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <FaTimesCircle className="mr-1" />
                        Cancelled
                    </span>
                )
            case 'REGISTERED':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" />
                        Registered
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {status}
                    </span>
                )
        }
    }

    const ImagesArray = [
        { value: eventData?.image_web, label: 'Web Images' },
        { value: eventData?.image_mobile, label: 'Mobile Images' },
        { value: eventData?.extra_attributes?.event_photos, label: 'Event Images' },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    {ImagesArray?.map((item, key) => (
                        <div key={key}>
                            {item?.value?.split(',').length > 0 && (
                                <>
                                    <EventCarousel image={item?.value?.split(',')} label={item?.label} />
                                </>
                            )}
                        </div>
                    ))}

                    <div className="mt-10">
                        <Button variant="accept">Scan QR Code</Button>
                    </div>
                </div>

                {/* Event Details */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{eventData.name}</h1>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {eventData.event_type}
                        </span>
                    </div>

                    <p className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: eventData.description }}></p>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Available Slots</h3>
                            <p className="text-lg font-semibold">
                                {eventData.available_slots} / {eventData.total_slots}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Category</h3>
                            <p className="text-lg font-semibold">{eventData.extra_attributes?.category || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Venue</h3>
                            <p className="text-lg font-semibold">{eventData.venue || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Visibility</h3>
                            <p className="text-lg font-semibold">
                                {eventData.is_public ? (
                                    <span className="inline-flex items-center text-green-600">
                                        <FaGlobe className="mr-1" />
                                        Public
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center text-yellow-600">
                                        <FaLock className="mr-1" />
                                        Private
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-start">
                            <FaCalendarAlt className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-gray-900">Registration Period</h3>
                                <p className="text-gray-600">
                                    {formatDate(eventData.registration_start_date)} - {formatDate(eventData.registration_end_date)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <FaClock className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-gray-900">Event Time</h3>
                                <p className="text-gray-600">
                                    {formatDate(eventData.event_start_time)} - {formatDate(eventData.event_end_time)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <FaMapMarkerAlt className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-gray-900">Location</h3>
                                <p className="text-gray-600">
                                    Lat: {eventData.latitude}, Long: {eventData.longitude}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Special Instructions</h3>
                        <p
                            className="text-gray-600 mb-6"
                            dangerouslySetInnerHTML={{ __html: eventData.extra_attributes?.special_instructions }}
                        ></p>
                    </div>

                    {eventData.extra_attributes?.sponsors?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sponsors</h3>
                            <div className="flex flex-wrap gap-2">
                                {eventData.extra_attributes.sponsors.map((sponsor: string, index: number) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                    >
                                        {sponsor}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {eventData?.extra_attributes?.venue_images?.split(',').length > 0 && (
                        <>
                            <EventCarousel image={eventData?.extra_attributes?.venue_images?.split(',')} label="Venue Images" />
                        </>
                    )}
                </div>

                {/* User Registration Section */}
                <div className="mt-8">
                    <Button className="" size="sm" variant="new" onClick={() => setIsAddEvent(true)}>
                        ADD USER TO EVENT
                    </Button>
                </div>
                {eventData.event_users?.length > 0 && (
                    <div className="col-span-full bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Event Registration</h2>
                            {totalPages > 1 && (
                                <div className="flex space-x-1">
                                    <button
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-md border disabled:opacity-50"
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={number}
                                            className={`px-3 py-1 rounded-md border ${
                                                currentPage === number ? 'bg-blue-500 text-white' : ''
                                            }`}
                                            onClick={() => paginate(number)}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    <button
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-md border disabled:opacity-50"
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                        {currentUsers?.map((user: any, index: number) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0 hover:bg-gray-50 transition-colors"
                            >
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
                                        <div className="mb-1">{renderUserStatus(user.status)}</div>
                                        <p className="text-sm text-gray-500">Code: {user.event_code}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="col-span-full flex flex-wrap gap-4">
                    {eventData.is_joined ? (
                        <>
                            <button
                                className={`flex items-center px-6 py-3 rounded-lg font-medium ${
                                    eventData.event_users?.[0]?.status === 'CANCELLED'
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                                disabled={eventData.event_users?.[0]?.status === 'CANCELLED'}
                            >
                                <FaTicketAlt className="mr-2" />
                                Already Registered
                            </button>
                            <button className="flex items-center px-6 py-3 rounded-lg font-medium border border-red-500 text-red-500 hover:bg-red-50">
                                <FaTimesCircle className="mr-2" />
                                Cancel Registration
                            </button>
                        </>
                    ) : (
                        ''
                    )}
                </div>

                {isAddEvent && (
                    <AssignUserModal dialogIsOpen={isAddEvent} setIsOpen={setIsAddEvent} eventSeriesData={eventSeriesData ?? []} />
                )}
            </div>
        </div>
    )
}

export default EventListDetails
