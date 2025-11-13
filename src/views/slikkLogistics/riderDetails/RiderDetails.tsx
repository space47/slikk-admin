/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { notification } from 'antd'
import EasyTable from '@/common/EasyTable'
import RiderDetailModal from './RiderComponents/RiderDetailModal'
import RiderCheckinModal from './RiderCheckinModal'
import BulkEditRiderModal from './RiderComponents/BulkEditRiderModal'
import FilterRiderTableDrawer from './RiderUtils/FilterRiderTableDrawer'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { Button, Dropdown, Select, Spinner } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { ridersService } from '@/store/services/riderServices'
import {
    RiderDetailType,
    setCount,
    setFrom,
    setRiderDetails,
    setTo,
    setPage,
    setPageSize,
    setCurrentStoreLocation,
} from '@/store/slices/riderDetails/riderDetails.slice'
import { sortedRiderSelector } from '@/store/selectors/riderDetail.selector'
import { RiderColumns } from './RiderUtils/RiderDetailsColumns'
import { handleCopyLink } from './RiderUtils/riderFunctions'
import { FaDownload, FaFilter } from 'react-icons/fa'
import { BUSY_STATUS_TABS, DEBOUNCE_DELAY, SEARCH_TYPES, STATUS_TABS, StoreOption } from './RiderDetailsCommon'
import PageCommon from '@/common/PageCommon'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { RiderDetailsType } from '@/store/types/riderAddTypes'
import DialogConfirm from '@/common/DialogConfirm'

const RiderDetails = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [showRiderDetailModal, setShowRiderDetailModal] = useState(false)
    const [isCheckModal, setIsCheckModal] = useState(false)
    const [isCheckOutModal, setIsCheckOutModal] = useState(false)
    const [isBulkRiderModal, setIsBulkRiderModal] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [mobileForParticularRider, setMobileForParticularRider] = useState<string>('')
    const [nameForParticularRider, setNameForParticularRider] = useState<string>('')
    const [riderMobileStore, setRiderMobileStore] = useState<number[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [tabSelect, setTabSelect] = useState<'checkin' | 'checkout'>('checkin')
    const [busyTab, setBusyTab] = useState('')
    const [riderType, setRiderType] = useState<string>('Select Rider Type')
    const [riderSearchByType, setRiderSearchByType] = useState<'mobile' | 'name'>('name')
    const [currentStoreId, setCurrentStoreId] = useState<number | null>(null)
    const [currentAgency, setCurrentAgency] = useState('')
    const [shiftStart, setShiftStart] = useState('')
    const [shiftEnd, setShiftEnd] = useState('')
    const [currentRow, setCurrentRow] = useState<RiderDetailsType>()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const { storeResults } = useAppSelector<companyStore>((state) => state.companyStore)
    const { count, from, page, pageSize, to, currentStoreLocation } = useAppSelector<RiderDetailType>((state) => state.riderDetails)
    const [riderDownload, riderDownloadResponse] = ridersService.useLazyRiderDetailsDownloadQuery()
    const { debounceFilter } = useDebounceInput({ globalFilter: globalFilter as string, delay: DEBOUNCE_DELAY })
    const [deleteRider, deleteResponse] = ridersService.useRiderDeleteMutation()
    const {
        data: riders,
        isSuccess,
        isLoading,
        isFetching,
        refetch,
    } = ridersService.useRiderDetailsQuery(
        {
            from: from,
            to: moment(to).add(1, 'days').format('YYYY-MM-DD'),
            page: !debounceFilter ? page : undefined,
            pageSize: !debounceFilter ? pageSize : undefined,
            mobile: riderSearchByType === 'mobile' ? debounceFilter : '',
            name: riderSearchByType === 'name' ? debounceFilter : '',
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
    const sortedRiderDetails = useAppSelector(sortedRiderSelector)
    const formattedData = useMemo(() => {
        return storeResults?.map((item) => ({
            label: item?.name,
            value: {
                lat: item?.latitude || 0,
                long: item?.longitude || 0,
                id: item?.id,
            },
        }))
    }, [storeResults])

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    useEffect(() => {
        if (isSuccess && riders?.data) {
            dispatch(setRiderDetails(riders.data.results || []))
            dispatch(setCount(riders.data.count || 0))
        }
    }, [riders, isSuccess, dispatch])

    useEffect(() => {
        if (deleteResponse?.isSuccess) {
            notification.success({ message: 'Successfully Deleted' })
            setShowDeleteModal(false)
            refetch()
        }
        if (deleteResponse?.isError) {
            notification.error({ message: 'Failed to delete Rider' })
        }
    }, [deleteResponse?.isSuccess, deleteResponse?.isError])

    useEffect(() => {
        if (riderDownloadResponse?.isSuccess) {
            notification.success({ message: riderDownloadResponse?.data?.message || 'File is sent to your registered mail' })
        }
        if (riderDownloadResponse.isError) {
            notification.error({ message: 'Failed to download rider data' })
        }
    }, [riderDownloadResponse.isError, riderDownloadResponse?.isSuccess])

    const handleActiveCareer = useCallback((id: number, e: any, checked: boolean, mobile: string, name: string) => {
        setMobileForParticularRider(mobile)
        setNameForParticularRider(name)
        if (checked) {
            setIsCheckOutModal(true)
        } else {
            setIsCheckModal(true)
        }
    }, [])

    const handleProfileClick = useCallback((row: any) => {
        setShowRiderDetailModal(true)
        setCurrentRow(row)
    }, [])

    const handleDateChange = useCallback(
        (dates: [Date | null, Date | null] | null) => {
            if (dates?.[0]) {
                dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
                dispatch(setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')))
            }
        },
        [dispatch],
    )

    const handleSelectAllRiders = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const allIds = sortedRiderDetails?.map((item) => item?.profile?.mobile).filter(Boolean) as number[]
            setRiderMobileStore(e.target.checked ? allIds : [])
        },
        [sortedRiderDetails],
    )

    const handleSelectRiderMobile = useCallback((mobile: number, isChecked: boolean) => {
        setRiderMobileStore((prev) => (isChecked ? [...prev, mobile] : prev.filter((item) => item !== mobile)))
    }, [])

    const handleDownloadRiderCsv = () => {
        riderDownload({
            download: 'true',
            from: from,
            to: moment(to).add(1, 'days').format('YYYY-MM-DD'),
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
        })
    }

    const handleStoreChange = useCallback(
        (newVal: StoreOption | null) => {
            setCurrentStoreId(newVal?.value?.id || null)
            dispatch(
                setCurrentStoreLocation({
                    lat: newVal?.value?.lat || 0,
                    long: newVal?.value?.long || 0,
                }),
            )
        },
        [dispatch],
    )

    const handleDelete = (row: RiderDetailsType) => {
        setCurrentRow(row)
        setShowDeleteModal(true)
    }

    const handleDeleteRider = () => {
        deleteRider({ mobile: currentRow?.profile?.mobile as number })
    }

    const columns = RiderColumns({
        sortedRiderDetails,
        handleActiveCareer,
        handleProfileClick,
        currentStoreLocation,
        riderMobileStore,
        handleSelectAllRiders,
        handleSelectRiderMobile,
        handleDelete,
    })

    const renderTabNavigation = () => (
        <div className="flex gap-6 justify-start mb-6 border-b border-gray-300">
            {STATUS_TABS.map((tab) => (
                <div
                    key={tab}
                    onClick={() => setTabSelect(tab)}
                    className={`relative px-4 pb-2 cursor-pointer transition-colors duration-300 
            ${tabSelect === tab ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-500'}`}
                >
                    <span className="text-lg">{tab === 'checkin' ? 'Active Riders' : 'In-Active Riders'}</span>
                    {tabSelect === tab && <div className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-green-600" />}
                </div>
            ))}
        </div>
    )

    const renderBusyStatusTabs = () =>
        tabSelect === 'checkin' && (
            <div className="flex gap-6 justify-start mb-6 border-b border-gray-300">
                {BUSY_STATUS_TABS.map((tab) => (
                    <div
                        key={tab}
                        onClick={() => setBusyTab(tab)}
                        className={`relative px-4 pb-2 cursor-pointer transition-colors duration-300 
              ${busyTab === tab ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'}`}
                    >
                        <span className="text-lg">{tab === 'free' ? 'Free Riders' : tab === 'busy' ? 'Busy Riders' : 'All'}</span>
                        {busyTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-blue-600" />}
                    </div>
                ))}
            </div>
        )

    const renderSearchBar = () => (
        <div className="flex gap-2 items-center shadow-xl p-2 rounded-xl">
            <input
                type="search"
                value={globalFilter}
                className="rounded-xl flex-1"
                placeholder="Search by riders name"
                onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div className="bg-gray-200 max-h-[140px] px-1 rounded-lg font-bold text-[15px]">
                <Dropdown
                    className="border text-black text-lg font-semibold"
                    title={riderSearchByType}
                    onSelect={(selectedKey) => setRiderSearchByType(selectedKey as (typeof SEARCH_TYPES)[number])}
                >
                    {SEARCH_TYPES.map((item) => (
                        <DropdownItem key={item} eventKey={item}>
                            {item}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>
        </div>
    )

    const renderActionButtons = () => (
        <div>
            <div className="flex gap-3 items-center">
                <Button variant="new" size="sm" type="button" onClick={() => setIsFilter(true)}>
                    <FaFilter className="text-xl" />
                </Button>

                <Button variant="new" size="sm" type="button" onClick={handleDownloadRiderCsv}>
                    <FaDownload className="text-xl" />
                </Button>
            </div>
        </div>
    )

    return (
        <div className="p-2 shadow-xl rounded-xl">
            <div className="flex gap-6 items-center mb-8 border-b border-gray-200 font-bold">
                <div className="pb-2 border-b-2 border-green-500 text-green-600 font-semibold cursor-pointer text-xl">
                    Rider Details <span className="text-red-700">(Total Riders: {count})</span>
                </div>
                <button
                    className="pb-2 border-b-2 border-transparent text-gray-600 hover:text-green-600 hover:border-green-400 text-xl"
                    onClick={() => navigate('/app/riders/addNew')}
                >
                    Add Riders
                </button>
                <button
                    className="pb-2 border-b-2 border-transparent text-gray-600 hover:text-green-600 hover:border-green-400 text-xl"
                    onClick={() => navigate('/app/riders/attendance/rider')}
                >
                    Rider Attendance
                </button>
            </div>

            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4 xl:gap-0 xl:flex-row xl:justify-between items-center">
                    <div className="flex flex-col gap-3">
                        <div className="text-xl font-bold">Select Store:</div>
                        <Select
                            isClearable
                            placeholder="Select slikk store"
                            options={formattedData}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value as any}
                            className="w-full"
                            onChange={handleStoreChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 xl:flex-row xl:gap-5 items-center">
                        {riderMobileStore.length > 0 && (
                            <div className="xl:mt-8">
                                <Button variant="new" size="sm" onClick={() => setIsBulkRiderModal(true)}>
                                    Bulk Update
                                </Button>
                            </div>
                        )}
                        <div className="xl:mt-8" onClick={handleCopyLink}>
                            <a
                                className="p-2 rounded-xl bg-gradient-to-r bg-blue-700/80 text-white no-underline flex gap-2 font-bold backdrop-blur-sm"
                                href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Rider+App/rider-app-new.apk"
                            >
                                App Link
                            </a>
                        </div>

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
                <div className="flex flex-col gap-3">
                    {renderTabNavigation()}
                    {renderBusyStatusTabs()}
                    <div className="flex justify-between items-center">
                        {renderSearchBar()}
                        {renderActionButtons()}
                    </div>
                    {isLoading || isFetching ? (
                        <div className="flex items-center justify-center">
                            <Spinner size={30} />
                        </div>
                    ) : (
                        <EasyTable mainData={sortedRiderDetails} columns={columns} />
                    )}
                    <PageCommon
                        dispatch={dispatch}
                        page={page}
                        pageSize={pageSize}
                        setPage={setPage}
                        setPageSize={setPageSize}
                        totalData={count}
                    />
                </div>
            </div>
            {showRiderDetailModal && (
                <RiderDetailModal
                    dialogIsOpen={showRiderDetailModal}
                    setIsOpen={setShowRiderDetailModal}
                    fromDate={from}
                    toDate={moment(to).add(1, 'days').format('YYYY-MM-DD')}
                    row={currentRow}
                />
            )}
            {isCheckModal && (
                <RiderCheckinModal
                    dialogIsOpen={isCheckModal}
                    setIsOpen={setIsCheckModal}
                    mobile={mobileForParticularRider}
                    name={nameForParticularRider}
                />
            )}
            {isCheckOutModal && (
                <RiderCheckinModal
                    checkOutRider
                    dialogIsOpen={isCheckOutModal}
                    setIsOpen={setIsCheckOutModal}
                    mobile={mobileForParticularRider}
                    name={nameForParticularRider}
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
                    riderType={riderType}
                    setRiderType={setRiderType}
                />
            )}

            <BulkEditRiderModal dialogIsOpen={isBulkRiderModal} setIsOpen={setIsBulkRiderModal} riderMobileStore={riderMobileStore} />
            <DialogConfirm IsDelete IsOpen={showDeleteModal} closeDialog={() => setShowDeleteModal(false)} onDialogOk={handleDeleteRider} />
        </div>
    )
}

export default RiderDetails
