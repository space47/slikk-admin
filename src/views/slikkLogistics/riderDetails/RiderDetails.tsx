/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import RiderDetailModal from './RiderComponents/RiderDetailModal'
import RiderFullMap from './RiderFullMap'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { Button, Dropdown, Pagination, Select } from '@/components/ui'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { FaDownload, FaMapMarkedAlt } from 'react-icons/fa'
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
import { notification } from 'antd'

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
    const [showRiderMap, setShowRiderMap] = useState<boolean>(false)
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
    const { data: riders, isSuccess } = ridersService.useRiderDetailsQuery(
        {
            from: from,
            to: To_Date,
            page: page,
            pageSize: showRiderMap ? 300 : pageSize,
            mobile: riderSearchByType === 'mobile' ? globalFilter : '',
            name: riderSearchByType === 'name' ? globalFilter : '',
            isActive: tabSelect === 'checkin' ? 'true' : 'false',
            rider_type: riderType === 'Select Rider Type' ? '' : riderType,
            user_type: 'rider',
            rider_status: busyTab ?? '',
            store_id: currentStoreId || null,
        },
        { refetchOnMountOrArgChange: true, pollingInterval: 60000 },
    )

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const handleBusyTab = (value: string) => {
        setBusyTab(value)
    }

    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }

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
        }
        if (checked === false) {
            setIsCheckModal(true)
        }
    }

    useEffect(() => {
        if (showRiderMap) {
            dispatch(setPageSize(100))
        }
    }, [showRiderMap])

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

    const columnsForCsv = [
        { header: 'Name', accessorKey: 'name' },
        { header: 'Mobile', accessorKey: 'mobile' },
        { header: 'Latitude', accessorKey: 'latitude' },
        { header: 'Longitude', accessorKey: 'longitude' },
    ]

    const convertToCSV = (data: any[], columns: any[]) => {
        const header = columns.map((col) => col.header).join(',')
        const rows = data
            .map((row) => {
                return columns
                    .map((col) => {
                        if (col.accessorKey === 'name') {
                            return `${row?.profile?.first_name} ${row?.profile?.last_name}`
                        } else if (col.accessorKey === 'mobile') {
                            return row.profile?.mobile
                        } else if (col.accessorKey === 'latitude') {
                            return row?.profile?.current_location?.latitude
                        } else if (col.accessorKey === 'longitude') {
                            return row?.profile?.current_location?.longitude
                        } else {
                            return ''
                        }
                    })
                    .join(',')
            })
            .join('\n')
        return `${header}\n${rows}`
    }

    const handleDownloadRiderCsv = () => {
        const csvData = convertToCSV(sortedRiderDetails, columnsForCsv)
        const blob = new Blob([csvData], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `riderData.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

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

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Rider+App/rider-app-new.apk')
        notification.success({ message: 'Copied' })
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
                        <div onClick={() => setShowRiderMap((prev) => !prev)} className="items-center xl:mt-8 flex gap-1">
                            <span className="text-xl font-bold cursor-pointer">{showRiderMap ? 'Close:' : 'Map:'}</span>
                            <button>
                                {showRiderMap ? (
                                    <FaMapMarkedAlt className="text-4xl text-red-700 " />
                                ) : (
                                    <FaMapMarkedAlt className="text-4xl text-green-600 " />
                                )}
                            </button>
                        </div>
                        <div className="xl:mt-8">
                            {riderMobileStore?.length > 0 && (
                                <Button variant="new" size="sm" onClick={() => setIsBulkRiderModal(true)}>
                                    Bulk Update
                                </Button>
                            )}
                        </div>
                        <div className="xl:mt-8">
                            <Button variant="new" size="sm" onClick={() => navigate(`/app/riders/addNew`)}>
                                ADD / UPDATE RIDERS
                            </Button>
                        </div>
                        <div className="xl:mt-8" onClick={handleCopyLink}>
                            <a
                                className="p-2 rounded-xl bg-gradient-to-r from-blue-500/80 to-blue-700/80 hover:from-blue-600/90 hover:to-blue-800/90 text-white no-underline flex gap-2 font-bold backdrop-blur-sm"
                                href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Rider+App/rider-app-new.apk"
                            >
                                Rider App Link
                            </a>
                        </div>
                        <div className="xl:mt-8">
                            <Button variant="new" size="sm" onClick={() => navigate(`/app/riders/attendance/rider`)}>
                                Attendance
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

                        <div className="bg-gray-200 max-h-[140px] px-1 rounded-lg font-bold text-[15px] mt-8">
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
                    </div>
                </div>

                {showRiderMap && (
                    <div className="xl:w-[90%]  items-center">
                        <div className="text-xl font-bold">Rider Location</div>
                        <div className="flex flex-col gap-3"></div>
                        <RiderFullMap riderDetails={riderDetails || []} currentStore={currentStoreLocation} />
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div className="flex gap-6 justify-start mb-6 border-b border-gray-300">
                        {['checkin', 'checkout'].map((tab) => (
                            <div
                                key={tab}
                                onClick={() => handleSelectTab(tab)}
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
                                    onClick={() => handleBusyTab(tab)}
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
                        <div onClick={handleDownloadRiderCsv}>
                            <FaDownload className="text-xl cursor-pointer" />
                        </div>
                    </div>
                    <EasyTable mainData={sortedRiderDetails} columns={columns} />
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
            {isBulkRiderModal && (
                <BulkEditRiderModal dialogIsOpen={isBulkRiderModal} setIsOpen={setIsBulkRiderModal} riderMobileStore={riderMobileStore} />
            )}
        </div>
    )
}

export default RiderDetails
