/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import RiderDetailModal from './RiderComponents/RiderDetailModal'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { Button, Dropdown, Pagination, Select } from '@/components/ui'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { FaDownload, FaFilter } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
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
import { calculateDistance, RiderColumns } from './RiderUtils/RiderDetailsColumns'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import BulkEditRiderModal from './RiderComponents/BulkEditRiderModal'
import { handleCopyLink, handleDownloadRiderCsv } from './RiderUtils/riderFunctions'
import FilterRiderTableDrawer from './RiderUtils/FilterRiderTableDrawer'

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
    const { storeResults } = useAppSelector<companyStore>((state) => state.companyStore)
    const [globalFilter, setGlobalFilter] = useState('')
    const [tabSelect, setTabSelect] = useState('checkin')
    const [busyTab, setBusyTab] = useState('')
    const [riderType, setRiderType] = useState<string>('Select Rider Type')
    const { riderDetails, count, from, page, pageSize, to } = useAppSelector<RiderDetailType>((state) => state.riderDetails)
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [isCheckModal, setIsCheckModal] = useState<boolean>(false)
    const [isCheckOutModal, setIsCheckOutModal] = useState<boolean>(false)
    const [isBulkRiderModal, setIsBulkRiderModal] = useState<boolean>(false)
    const [riderSearchByType, setRiderSearchByType] = useState('name')
    const [riderMobileStore, setRiderMobileStore] = useState<number[]>([])
    const [currentStoreId, setCurrentStoreId] = useState<number | null>(null)
    const [isFilter, setIsFilter] = useState(false)
    const [currentAgency, setCurrentAgency] = useState('')
    const [shiftStart, setShiftStart] = useState('')
    const [shiftEnd, setShiftEnd] = useState('')

    const { data: riders, isSuccess } = ridersService.useRiderDetailsQuery(
        {
            from: from,
            to: To_Date,
            page: !globalFilter ? page : undefined,
            pageSize: !globalFilter ? pageSize : undefined,
            mobile: riderSearchByType === 'mobile' ? globalFilter : '',
            name: riderSearchByType === 'name' ? globalFilter : '',
            isActive: tabSelect === 'checkin' ? 'true' : 'false',
            rider_type: riderType === 'Select Rider Type' ? '' : riderType,
            user_type: 'rider',
            rider_status: busyTab ?? '',
            store_id: currentStoreId || null,
            rider_agency: currentAgency || '',
            shift_end_time: shiftEnd || '',
            shift_start_time: shiftStart || '',
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const formattedData = storeResults?.map((item) => ({
        label: item?.name,
        value: {
            lat: item?.latitude || 0,
            long: item?.longitude || 0,
            id: item?.id,
        },
    }))

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRiderDetails(riders.data?.results || []))
            dispatch(setCount(riders.data?.count || 0))
        }
    }, [riders, isSuccess, dispatch, from, to, page, pageSize, globalFilter, currentStoreLocation, tabSelect, riderType])

    const handleActiveCareer = (id: number, e: any, checked: boolean, mobile: string, name: string) => {
        setMobileForParticularRider(mobile)
        setNameForParticularRider(name)
        if (checked === true) {
            setIsCheckOutModal(true)
        } else {
            setIsCheckModal(true)
        }
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

    const sortedRiderDetails = [...riderDetails]?.sort((a, b) => {
        const distance1 = calculateDistance(
            Number(a.profile?.current_location?.latitude),
            Number(a.profile?.current_location?.longitude),
            currentStoreLocation?.lat ?? 0,
            currentStoreLocation?.long ?? 0,
        )
        const distance2 = calculateDistance(
            Number(b.profile?.current_location?.latitude),
            Number(b.profile?.current_location?.longitude),
            currentStoreLocation?.lat ?? 0,
            currentStoreLocation?.long ?? 0,
        )
        return distance1 - distance2
    })

    const handleSelectAllRiders = (e: any) => {
        if (e.target.checked) {
            const allIds = sortedRiderDetails?.map((item) => item?.profile?.mobile)
            setRiderMobileStore(allIds as number[])
        } else {
            setRiderMobileStore([])
        }
    }

    const handleSelectRiderMobile = (mobiles: number, isChecked: boolean) => {
        setRiderMobileStore((prev) => {
            if (isChecked) {
                return [...prev, mobiles]
            } else {
                return prev.filter((item) => item !== mobiles)
            }
        })
    }

    const columns = RiderColumns({
        sortedRiderDetails,
        handleActiveCareer,
        hanldeProfileClick,
        currentStoreLocation,
        riderMobileStore,
        handleSelectAllRiders,
        handleSelectRiderMobile,
    })

    return (
        <div>
            <div className="flex gap-6 items-center mb-8 border-b border-gray-200 font-bold">
                <div className="pb-2 border-b-2 border-green-500 text-green-600 font-semibold cursor-pointer text-xl">Rider Details</div>
                <button
                    className="pb-2 border-b-2 border-transparent text-gray-600 hover:text-green-600 hover:border-green-400  text-xl"
                    onClick={() => navigate(`/app/riders/addNew`)}
                >
                    Add Riders
                </button>
                <button
                    className="pb-2 border-b-2 border-transparent text-gray-600 hover:text-green-600 hover:border-green-400  text-xl"
                    onClick={() => navigate(`/app/riders/attendance/rider`)}
                >
                    Rider Attendance
                </button>
            </div>

            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4 xl:gap-0 xl:flex-row xl:justify-between items-center">
                    <div className="flex flex-col gap-3">
                        <div className="text-xl font-bold">Select Warehouse:</div>
                        <Select
                            isClearable
                            placeholder="select slikk store"
                            options={formattedData}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value as any}
                            className="w-full"
                            onChange={(newVal) => {
                                setCurrentStoreId(newVal?.value?.id || null)
                                setCurrentStoreLocation({
                                    lat: newVal?.value?.lat,
                                    long: newVal?.value?.long,
                                })
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-2 xl:flex-row xl:gap-5 items-center">
                        <div className="xl:mt-8">
                            {riderMobileStore?.length > 0 && (
                                <Button variant="new" size="sm" onClick={() => setIsBulkRiderModal(true)}>
                                    Bulk Update
                                </Button>
                            )}
                        </div>

                        <div className="xl:mt-8" onClick={handleCopyLink}>
                            <a
                                className="p-2 rounded-xl bg-gradient-to-r  bg-blue-700/80  text-white no-underline flex gap-2 font-bold backdrop-blur-sm"
                                href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Rider+App/rider-app-new.apk"
                            >
                                App Link
                            </a>
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

                <div className="flex flex-col gap-3">
                    <div className="flex gap-6 justify-start mb-6 border-b border-gray-300">
                        {['checkin', 'checkout'].map((tab) => (
                            <div
                                key={tab}
                                onClick={() => setTabSelect(tab)}
                                className={`relative px-4 pb-2 cursor-pointer transition-colors duration-300 
        ${tabSelect === tab ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-500'}`}
                            >
                                <span className="text-lg">{tab === 'checkin' ? 'Active Riders' : 'In-Active Riders'}</span>
                                {tabSelect === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-green-600 transition-all duration-300" />
                                )}
                            </div>
                        ))}
                    </div>

                    {tabSelect === 'checkin' && (
                        <div className="flex gap-6 justify-start mb-6 border-b border-gray-300">
                            {['', 'free', 'busy'].map((tab) => (
                                <div
                                    key={tab}
                                    onClick={() => setBusyTab(tab)}
                                    className={`relative px-4 pb-2 cursor-pointer transition-colors duration-300 
          ${busyTab === tab ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'}`}
                                >
                                    <span className="text-lg">
                                        {tab === 'free' ? 'Free Riders' : tab === 'busy' ? 'Busy Riders' : 'All'}
                                    </span>
                                    {busyTab === tab && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-blue-600 transition-all duration-300" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mb-4">
                        <div className="flex gap-2 items-center  shadow-xl p-2 rounded-xl ">
                            <div>
                                <input
                                    name="filter"
                                    type="search"
                                    value={globalFilter}
                                    className="rounded-xl"
                                    placeholder="Search by riders name"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                            </div>
                            <div className="bg-gray-200 max-h-[140px] px-1 rounded-lg font-bold text-[15px] ">
                                <Dropdown
                                    className="border   text-black text-lg font-semibold "
                                    title={riderSearchByType}
                                    onSelect={(selectedKey) => setRiderSearchByType(selectedKey)}
                                >
                                    <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:max-h-[600px]  xl:overflow-y-scroll font-bold ">
                                        {['mobile', 'name']?.map((item, key) => (
                                            <DropdownItem key={key} eventKey={item} className="h-1">
                                                {item}
                                            </DropdownItem>
                                        ))}
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="font-bold text-xl mb-5 mt-5">Total Riders : {count}</div>
                        <div className="flex gap-3 items-center">
                            <div className="bg-gray-200 max-h-[140px] px-1 rounded-lg font-bold text-[15px] ">
                                <Dropdown
                                    className="border   text-black text-lg font-semibold "
                                    title={riderType}
                                    onSelect={(selectedKey) => setRiderType(selectedKey)}
                                >
                                    <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:max-h-[600px]  xl:overflow-y-scroll font-bold ">
                                        {['FORWARD', 'RETURN']?.map((item, key) => (
                                            <DropdownItem key={key} eventKey={item} className="h-1">
                                                {item}
                                            </DropdownItem>
                                        ))}
                                    </div>
                                    <div
                                        className="flex mt-3 justify-center items-center rounded-lg cursor-pointer text-white bg-red-500 hover:bg-red-400"
                                        onClick={() => setRiderType('Select Rider Type')}
                                    >
                                        Clear
                                    </div>
                                </Dropdown>
                            </div>
                            <div>
                                <Button variant="new" size="sm" onClick={() => setIsFilter(true)}>
                                    <FaFilter className="text-xl cursor-pointer" />
                                </Button>
                            </div>
                            <Button variant="new" size="sm" onClick={() => handleDownloadRiderCsv(sortedRiderDetails)}>
                                <FaDownload className="text-xl cursor-pointer" />
                            </Button>
                        </div>
                    </div>
                    <EasyTable mainData={sortedRiderDetails} columns={columns} />
                    <div className="flex justify-between items-center">
                        <Pagination
                            pageSize={pageSize}
                            currentPage={page}
                            total={count}
                            className="mb-4 md:mb-0"
                            onChange={(value) => dispatch(setPage(value))}
                        />

                        <span>
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => {
                                    if (option) {
                                        dispatch(setPage(1))
                                        dispatch(setPageSize(Number(option?.value)))
                                    }
                                }}
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
            {isFilter && (
                <FilterRiderTableDrawer
                    isOpen={isFilter}
                    setIsOpen={setIsFilter}
                    currentAgency={currentAgency}
                    setCurrentAgency={setCurrentAgency}
                    setShiftEnd={setShiftEnd}
                    setShiftStart={setShiftStart}
                    shiftEnd={shiftEnd}
                    shiftStart={shiftStart}
                />
            )}
            {isBulkRiderModal && (
                <BulkEditRiderModal dialogIsOpen={isBulkRiderModal} setIsOpen={setIsBulkRiderModal} riderMobileStore={riderMobileStore} />
            )}
        </div>
    )
}

export default RiderDetails
