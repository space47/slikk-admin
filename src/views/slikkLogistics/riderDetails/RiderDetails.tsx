import React, { useEffect, useState } from 'react'
import { RiderData } from './RiderDetailsCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import RiderDetailModal from './RiderComponents/RiderDetailModal'
import RiderFullMap from './RiderFullMap'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { Button, Select } from '@/components/ui'
import { FaRegCircleDot } from 'react-icons/fa6'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IoIosRefresh } from 'react-icons/io'
import RiderCheckinModal from './RiderCheckinModal'

const RiderDetails = () => {
    const dispatch = useAppDispatch()
    const [riderDetails, setRiderDetails] = useState<RiderData[]>([])
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showRiderDetailModal, setShowRiderDetailModal] = useState(false)
    const [mobileForParticularRider, setMobileForParticularRider] = useState<string>()
    const [nameForParticularRider, setNameForParticularRider] = useState<string>()
    const [currentStoreLocation, setCurrentStoreLocation] = useState<Record<string, number | undefined>>({
        lat: 12.920216,
        long: 77.649326,
    })
    const [showRideeMap, setShowRiderMap] = useState<boolean>(false)
    const { storeResults } = useAppSelector<companyStore>((state) => state.companyStore)
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [globalFilter, setGlobalFilter] = useState('')
    const [tabSelect, setTabSelect] = useState('checkin')
    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
    const [isCheckModal, setIsCheckModal] = useState<boolean>(false)
    const [riderMobile, setRiderMobile] = useState<string>('')

    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const formattedData = storeResults?.map((item) => ({
        label: item?.name,
        value: {
            lat: item?.latitude,
            long: item?.longitude,
        },
    }))

    const fetchRiderDetails = async () => {
        try {
            let filter = ''
            if (globalFilter) {
                filter = `&name=${globalFilter}`
            }
            const response = await axioisInstance.get(
                `/logistic/riders?from=${from}&to=${To_Date}&p=${page}&page_size=${pageSize}${filter}`,
            )
            const data = response?.data?.data
            setRiderDetails(data)
        } catch (error) {
            console.error('error', error)
        }
    }

    useEffect(() => {
        const fetchData = () => {
            fetchRiderDetails()
        }

        fetchData()

        const interval = setInterval(fetchData, 60000)

        return () => clearInterval(interval)
    }, [currentStoreLocation, from, to, page, pageSize, globalFilter, refreshTrigger])

    const columns = [
        {
            header: 'Status',
            accessorKey: 'profile.checked_in_status',
            cell: ({ row }) => {
                const isStatusTrue = row?.original?.profile?.checked_in_status
                return (
                    <div>
                        {isStatusTrue ? (
                            <>
                                <div className="items-center flex justify-center">
                                    <FaRegCircleDot className="text-green-500 text-xl" />
                                </div>
                            </>
                        ) : (
                            <div className="items-center flex justify-center cursor-pointer">
                                <FaRegCircleDot
                                    className="text-red-500 text-xl"
                                    onClick={() => handleCheckinRider(row?.original?.profile?.mobile, row?.original?.profile?.first_name)}
                                />
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            header: 'Name',
            accessorKey: 'profile',
            cell: ({ row }) => {
                const isStatusTrue = row?.original?.profile?.checked_in_status
                return (
                    <div
                        className={
                            isStatusTrue
                                ? 'text-green-500 flex gap-2  hover:text-blue-800 hover:underline cursor-pointer '
                                : 'text-red-500 flex gap-2  hover:text-blue-800 hover:underline cursor-pointer '
                        }
                        onClick={() => hanldeProfileClick(row?.original?.profile?.mobile)}
                    >
                        <span className=""> {row?.original?.profile?.first_name}</span>
                        <span className="">{row?.original?.profile?.last_name}</span>
                    </div>
                )
            },
        },
        { header: 'Mobile', accessorKey: 'profile.mobile' },
        { header: 'Order Assigned', accessorKey: 'task_data.ASSIGNED' },
        { header: 'Out for delivery', accessorKey: 'task_data.OUT_FOR_DELIVERY' },
        { header: 'Out for Return pickup', accessorKey: 'task_data.OUT_FOR_PICKUP' },
        { header: 'Return Pickup', accessorKey: 'task_data.PICKED_UP' },
        { header: 'Return Pickup failed', accessorKey: 'task_data.PICKUP_FAILED' },

        { header: 'Orders Completed', accessorKey: 'task_data.COMPLETED' },
        { header: 'Return Delivered', accessorKey: 'task_data.DELIVERED' },
        { header: 'Total Task', accessorKey: 'task_data.TOTAL' },
        {
            header: 'Distance covered',
            accessorKey: 'task_data.distance_covered',
            cell: ({ row }) => {
                const distance = row?.original?.task_data?.distance_covered
                return <div>{distance ?? 0} km</div>
            },
        },
    ]

    const handleCheckinRider = (mobile: string, name: string) => {
        setIsCheckModal(true)
        setMobileForParticularRider(mobile)
        setNameForParticularRider(name)
    }

    const hanldeProfileClick = (mobile: string) => {
        setShowRiderDetailModal(true)
        setMobileForParticularRider(mobile)
    }
    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-10">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-3">
                        <div className="text-xl font-bold">Select Warehouse:</div>
                        <Select
                            isClearable
                            placeholder="select slikk store"
                            options={formattedData}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            className="w-full"
                            onChange={(newVal) => {
                                setCurrentStoreLocation({
                                    lat: newVal?.value?.lat,
                                    long: newVal?.value?.long,
                                })
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-2 xl:flex-row xl:gap-10 items-center">
                        <div onClick={() => setShowRiderMap((prev) => !prev)} className="items-center xl:mt-8 flex gap-1">
                            <span className="text-xl font-bold cursor-pointer">{showRideeMap ? 'Close Map:' : 'View Map:'}</span>
                            <button>
                                {showRideeMap ? (
                                    <FaMapMarkedAlt className="text-4xl text-red-700 " />
                                ) : (
                                    <FaMapMarkedAlt className="text-4xl text-green-600 " />
                                )}
                            </button>
                        </div>
                        <div className="xl:mt-8">
                            <Button variant="new" onClick={() => navigate(`/app/riders/addNew`)}>
                                ADD RIDERS
                            </Button>
                        </div>
                        <div>
                            <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
                        </div>
                    </div>
                </div>

                {showRideeMap && (
                    <div className="xl:w-[90%]  items-center">
                        <div className="text-xl font-bold">Rider Location</div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-end">
                                <div>
                                    <button onClick={() => setRefreshTrigger((prev) => prev + 1)}>
                                        <IoIosRefresh className="text-2xl font-extrabold" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <RiderFullMap riderDetails={riderDetails} currentStore={currentStoreLocation} />
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div className="flex gap-10 justify-start mb-5">
                        <div
                            className={`flex  cursor-pointer ${tabSelect === 'checkin' ? ' border-b-4 border-black text-green-500' : ''}`}
                            onClick={() => handleSelectTab('checkin')}
                        >
                            <span className="text-xl font-bold">Active Riders</span>
                        </div>
                        <div
                            className={`flex   cursor-pointer  ${tabSelect === 'checkout' ? ' border-b-4 border-black text-green-500' : ''}`}
                            onClick={() => handleSelectTab('checkout')}
                        >
                            <span className="text-xl font-bold">In-Active Riders</span>
                        </div>
                    </div>

                    {tabSelect === 'checkin' && (
                        <>
                            <div className="mb-4 ">
                                <input
                                    name="filter"
                                    value={globalFilter}
                                    className="rounded-xl"
                                    placeholder="Search by riders name"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                            </div>
                            <EasyTable
                                mainData={riderDetails?.filter((item) => item?.profile?.checked_in_status === true)}
                                columns={columns}
                            />
                        </>
                    )}
                    {tabSelect === 'checkout' && (
                        <>
                            <div className="mb-4 ">
                                <input
                                    name="filter"
                                    value={globalFilter}
                                    className="rounded-xl"
                                    placeholder="Search by riders name"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                            </div>
                            <EasyTable
                                mainData={riderDetails?.filter((item) => item?.profile?.checked_in_status === false)}
                                columns={columns}
                            />
                        </>
                    )}
                </div>
            </div>
            {showRiderDetailModal && (
                <RiderDetailModal
                    dialogIsOpen={showRiderDetailModal}
                    setIsOpen={setShowRiderDetailModal}
                    mobile={mobileForParticularRider}
                />
            )}
            {isCheckModal && (
                <RiderCheckinModal
                    dialogIsOpen={isCheckModal}
                    setIsOpen={setIsCheckModal}
                    mobile={mobileForParticularRider || ''}
                    name={nameForParticularRider || ''}
                />
            )}
        </div>
    )
}

export default RiderDetails
