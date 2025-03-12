/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import RiderDetailModal from './RiderComponents/RiderDetailModal'
import RiderFullMap from './RiderFullMap'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { Button, Pagination, Select } from '@/components/ui'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IoIosRefresh } from 'react-icons/io'
import RiderCheckinModal from './RiderCheckinModal'
import { ridersService } from '@/store/services/riderServices'
import {
    RiderDetailType,
    setCount,
    setFrom,
    setRiderDetails,
    setTo,
    setPage,
    setPageSize,
} from '@/store/slices/riderDetails/riderDetails.slice'
import { Option, pageSizeOptions } from '../taskTracking/TaskCommonType'
import { RiderColumns } from './RiderUtils/RiderDetailsColumns'

const RiderDetails = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [showRiderDetailModal, setShowRiderDetailModal] = useState(false)
    const [mobileForParticularRider, setMobileForParticularRider] = useState<any>()
    const [nameForParticularRider, setNameForParticularRider] = useState<string>()
    const [currentStoreLocation, setCurrentStoreLocation] = useState<Record<string, number | undefined>>({
        lat: 12.920216,
        long: 77.649326,
    })
    const [showRideeMap, setShowRiderMap] = useState<boolean>(false)
    const { storeResults } = useAppSelector<companyStore>((state) => state.companyStore)
    const [globalFilter, setGlobalFilter] = useState('')
    const [tabSelect, setTabSelect] = useState('checkin')
    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
    const { riderDetails, count, from, page, pageSize, to } = useAppSelector<RiderDetailType>((state) => state.riderDetails)
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [isCheckModal, setIsCheckModal] = useState<boolean>(false)
    const [isCheckOutModal, setIsCheckOutModal] = useState<boolean>(false)
    const { data: riders, isSuccess } = ridersService.useRiderDetailsQuery(
        {
            from: from,
            to: To_Date,
            page: page,
            pageSize: pageSize,
            mobile: globalFilter,
            isActive: tabSelect === 'checkin' ? 'true' : 'false',
        },
        { refetchOnMountOrArgChange: true, pollingInterval: 60000 },
    )

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const formattedData = storeResults?.map((item) => ({
        label: item?.name,
        value: {
            lat: item?.latitude || 0,
            long: item?.longitude || 0,
        },
    }))

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRiderDetails(riders.data?.results || []))
            dispatch(setCount(riders.data?.count || 0))
        }
    }, [riders, isSuccess, dispatch, from, to, page, pageSize, globalFilter, currentStoreLocation, refreshTrigger, tabSelect])

    const handleActiveCareer = (id: number, e: any, checked: boolean, mobile: string, name: string) => {
        setMobileForParticularRider(mobile)
        setNameForParticularRider(name)
        if (checked === true) {
            setIsCheckOutModal(true)
        }
        if (checked === false) {
            setIsCheckModal(true)
        }
    }

    const onPaginationChange = (value: number) => {
        dispatch(setPage(value))
    }
    const onSelectChange = (value?: number) => {
        dispatch(setPage(1))
        dispatch(setPageSize(Number(value)))
    }

    const hanldeProfileClick = (mobile: string) => {
        setShowRiderDetailModal(true)
        setMobileForParticularRider(mobile)
    }
    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            dispatch(setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')))
        }
    }

    const columns = RiderColumns({ handleActiveCareer, hanldeProfileClick })

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
                            <UltimateDatePicker
                                dispatch={dispatch}
                                from={from}
                                setFrom={setFrom}
                                to={to}
                                setTo={setTo}
                                handleDateChange={handleDateChange}
                            />
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
                        <RiderFullMap riderDetails={riderDetails || []} currentStore={currentStoreLocation} />
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

                    <div className="mb-4 ">
                        <input
                            name="filter"
                            value={globalFilter}
                            className="rounded-xl"
                            placeholder="Search by riders name"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <EasyTable mainData={riderDetails} columns={columns} />
                    <div className="flex justify-between items-center">
                        <Pagination
                            pageSize={pageSize}
                            currentPage={page}
                            total={count}
                            className="mb-4 md:mb-0"
                            onChange={onPaginationChange}
                        />

                        <span>
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => onSelectChange(option?.value)}
                            />
                        </span>
                    </div>
                </div>
            </div>
            {showRiderDetailModal && (
                <RiderDetailModal
                    dialogIsOpen={showRiderDetailModal}
                    setIsOpen={setShowRiderDetailModal}
                    mobile={mobileForParticularRider}
                    fromDate={from}
                    toDate={To_Date}
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
            {isCheckOutModal && (
                <RiderCheckinModal
                    checkOutRider
                    dialogIsOpen={isCheckOutModal}
                    setIsOpen={setIsCheckOutModal}
                    mobile={mobileForParticularRider || ''}
                    name={nameForParticularRider || ''}
                />
            )}
        </div>
    )
}

export default RiderDetails
