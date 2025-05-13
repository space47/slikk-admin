/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaGlobe, FaLock, FaTicketAlt } from 'react-icons/fa'
import { Button, Dropdown, Input } from '@/components/ui'
import LoadingSpinner from '@/common/LoadingSpinner'
import AssignUserModal from '../eventListUtils/AssignUserModal'
import { useAppDispatch, useAppSelector } from '@/store'
import { EventSeriesSliceType, setEventSeriesDetails } from '@/store/slices/eventSeriesSlice/eventSeriesSlice'
import EventCarousel from '../eventListUtils/EventCarousel'
import { eventSeriesService } from '@/store/services/eventSeriesService'
import EventListQrScanner from '../eventListUtils/EventListQrScanner'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { EventUserOptionsList } from '../../eventCommons/eventCommonArray'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import EventUser from '../eventListUtils/EventUser'

const EventListDetails = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const [isAddEvent, setIsAddEvent] = useState<boolean>(false)
    const { eventSeriesData, eventSeriesDetails } = useAppSelector<EventSeriesSliceType>((state) => state.eventSeries)
    const eventData = eventSeriesDetails
    const [delay, setDelay] = useState(100)
    const [qrResult, setQrResult] = useState<any>()
    const [showQr, setShowQr] = useState(false)
    const [registeredUsers, setRegisteredUsers] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [userToRedeem, setUserToRedeem] = useState<any[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(EventUserOptionsList[0])

    const { data: eventDataDet, isSuccess } = eventSeriesService.useEventSeriesDataQuery({
        event_id: id,
    })

    useEffect(() => {
        const fetchUserRegistration = async () => {
            try {
                let status = ''

                if (globalFilter) {
                    if (currentSelectedPage.value === 'mobile') {
                        status = `&mobile=${globalFilter}`
                    }
                    if (currentSelectedPage.value === 'status') {
                        status = `&status=${globalFilter}`
                    }
                    if (currentSelectedPage.value === 'event_code') {
                        status = `&event_code=${globalFilter}`
                    }
                }

                const response = await axioisInstance.get(`/dashboard/user/events?event_id=${id}&p=${page}&page_size=${pageSize}${status}`)
                const data = response?.data?.data?.results
                setRegisteredUsers(data || [])
                setTotalCount(response?.data?.count)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUserRegistration()
    }, [page, pageSize, qrResult, id, globalFilter])

    useEffect(() => {
        const fetchQr = async () => {
            try {
                const cleanedQrResult = qrResult.replace(/"/g, '')
                const response = await axioisInstance.get(`/dashboard/user/events?event_code=${cleanedQrResult}`)
                setUserToRedeem(response?.data?.data?.results)
            } catch (error) {
                console.error(error)
            }
        }
        if (qrResult !== '' || qrResult !== undefined) {
            fetchQr()
        }
    }, [qrResult])

    console.log('user to redeem', userToRedeem)

    useEffect(() => {
        if (qrResult) {
            setShowQr(false)
        }
    }, [qrResult])
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
            case 'REDEEMED':
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

    const handleSelect = (value) => {
        const selected = EventUserOptionsList.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const handleRedeem = async () => {
        try {
            const cleanedQrResult = qrResult.replace(/"/g, '')
            const res = await axioisInstance.patch(`/dashboard/user/events/${cleanedQrResult}`)
            notification.success({
                message: res?.data?.message || 'User has been Redeemed',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.message || 'Failed  to redeem',
            })
        } finally {
            setQrResult('')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="xl:block hidden">
                        {ImagesArray?.map((item, key) => (
                            <div key={key}>
                                {item?.value?.split(',').length > 0 && (
                                    <>
                                        <EventCarousel image={item?.value?.split(',')} label={item?.label} />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="xl:mt-10 mt-1">
                        <Button
                            type="button"
                            variant={showQr ? 'reject' : 'accept'}
                            onClick={() => {
                                setShowQr((prev) => !prev)
                                setQrResult(null)
                            }}
                        >
                            {showQr ? 'Close Qr Scanner' : 'Scan QR Code'}
                        </Button>
                    </div>
                    {/* <p>{qrResult}</p> */}
                    <div>
                        {showQr && (
                            <div className="mt-10 ">
                                <div className="text-xl mt-5 mb-5 font-bold">Scan QR</div>
                                <EventListQrScanner delay={delay} setDelay={setDelay} qrResult={qrResult} setQrResult={setQrResult} />
                            </div>
                        )}
                    </div>
                    {(qrResult || qrResult !== '') && userToRedeem.length > 0 && (
                        <div className="space-y-4">
                            {userToRedeem.map((user, index) => (
                                <div
                                    key={index}
                                    className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4"
                                >
                                    <div className="p-8">
                                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                                            <span>{user.user.name || 'Not provided'}</span>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex items-center mb-2">
                                                <span className="text-gray-700 font-medium mr-2">Mobile:</span>
                                                <span>{user.user.mobile || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center mb-2">
                                                <span className="text-gray-700 font-medium mr-2">Email:</span>
                                                <span>{user.user.email || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center mb-2">
                                                <span className="text-gray-700 font-medium mr-2">Event Code:</span>
                                                <span>{user.event_code}</span>
                                            </div>
                                            <div className="flex items-center mb-2">
                                                <span className="text-gray-700 font-medium mr-2">Status:</span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        user.status === 'JOINED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {user.status}
                                                </span>
                                            </div>
                                            <div className="mt-4 border-t pt-4">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-gray-700 font-medium mr-2">Terms Accepted:</span>
                                                    <span>{user.terms_and_conditions_accepted ? '✅' : '❌'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-700 font-medium mr-2">Other Conditions:</span>
                                                    <span>{user.other_conditions_accepted ? '✅' : '❌'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mb-2">
                                        <Button variant="accept" size="sm" onClick={handleRedeem}>
                                            Redeem
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                            <a href={`https://www.google.com/maps?q=${eventData.latitude},${eventData.latitude}`}>
                                <FaMapMarkerAlt className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                            </a>
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

                <div className="xl:hidden block">
                    {ImagesArray?.map((item, key) => (
                        <div key={key}>
                            {item?.value?.split(',').length > 0 && (
                                <>
                                    <EventCarousel image={item?.value?.split(',')} label={item?.label} />
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* User Registration Section */}
                <div className="mt-8">
                    <Button className="" size="sm" variant="new" onClick={() => setIsAddEvent(true)}>
                        ADD USER TO EVENT
                    </Button>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md">
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search here..."
                            value={globalFilter}
                            className="w-[150px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />

                        <div className="flex justify-center xl:justify-normal">
                            <div className="bg-gray-100 flex justify-center font-bold items-center xl:mt-1 xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                                <Dropdown
                                    className="text-xl text-black bg-gray-200 font-bold"
                                    title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                    onSelect={(e) => handleSelect(e)}
                                >
                                    {EventUserOptionsList?.map((item, key) => {
                                        return (
                                            <DropdownItem key={key} eventKey={item.value}>
                                                <span>{item.label}</span>
                                            </DropdownItem>
                                        )
                                    })}
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    {registeredUsers.length > 0 && (
                        <EventUser
                            registeredUsers={registeredUsers}
                            page={page}
                            pageSize={pageSize}
                            setPage={setPage}
                            setPageSize={setPageSize}
                            totalCount={totalCount}
                            renderUserStatus={renderUserStatus}
                        />
                    )}
                </div>

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
                    <AssignUserModal
                        dialogIsOpen={isAddEvent}
                        setIsOpen={setIsAddEvent}
                        eventSeriesData={eventSeriesData ?? []}
                        event_id={id}
                    />
                )}
            </div>
        </div>
    )
}

export default EventListDetails
