/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from '@/store'
import { pickerService } from '@/store/services/pickerServices'
import { PickerRequiredType, setPickerBoardData, setFrom, setTo } from '@/store/slices/pickerSlice/picker.slice'
import React, { useEffect, useState } from 'react'
import { usePickerColumns } from '../pickerUtils/usePickerColumns'
import EasyTable from '@/common/EasyTable'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import moment from 'moment'
import { Button, Dropdown } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import PickerDetailModal from './pickerComponents/PickerDetailModal'
import { PickerTableData } from '@/store/types/picker.types'
import PickerDetailEditModal from './pickerComponents/PickerDetailEditModal'
import { notification } from 'antd'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { DEBOUNCE_DELAY } from '../../riderDetails/RiderDetailsCommon'
import DialogConfirm from '@/common/DialogConfirm'
import StoreSelectComponent from '@/common/StoreSelectComponent'

const PickerBoard = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [storeId, setStoreId] = useState<any>(null)
    const [tabContent, setTabContent] = useState('active')
    const [showPickerDetailsModal, setShowPickerDetailsModal] = useState(false)
    const [showPickerDeletesModal, setShowPickerDeletesModal] = useState(false)
    const [showPickerEditModal, setShowPickerEditModal] = useState<boolean>(false)
    const [globalFilter, setGlobalFilter] = useState('')
    const [particularMobile, setParticularMobile] = useState<string>('')
    const [particularRowData, setParticularRowData] = useState<PickerTableData>()
    const [showPickerAddModal, setShowPickerAddModal] = useState<boolean>(false)
    const [riderSearchByType, setRiderSearchByType] = useState<'mobile' | 'name' | string>('name')
    const { debounceFilter } = useDebounceInput({ globalFilter: globalFilter as string, delay: DEBOUNCE_DELAY })
    const [deletePicker, deleteResponse] = pickerService.usePickerDeleteMutation()
    const { pickerBoardData, from, to } = useAppSelector<PickerRequiredType>((state) => state.picker)
    const {
        data: boardData,
        isSuccess,
        refetch,
    } = pickerService.usePickerBoardDataQuery({
        from,
        to,
        checkin_status: tabContent === 'active' ? 'true' : tabContent === 'in_active' ? 'false' : '',
        ...(riderSearchByType === 'mobile' && globalFilter ? { mobile: debounceFilter } : {}),
        ...(riderSearchByType === 'name' && globalFilter ? { name: debounceFilter } : {}),
        ...(storeId?.id ? { store_id: storeId.id } : {}),
    })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setPickerBoardData(boardData?.data))
        }
    }, [isSuccess, boardData, dispatch])

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            dispatch(setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')))
        }
    }

    useEffect(() => {
        if (deleteResponse?.isSuccess) {
            notification.success({ message: 'Successfully Deleted' })
            setShowPickerDeletesModal(false)
            refetch()
        }
        if (deleteResponse?.isError) {
            notification.error({ message: 'Failed to delete picker' })
        }
    }, [deleteResponse?.isSuccess, deleteResponse?.isError])

    const handleDetailsModal = (mobile: string) => {
        setParticularMobile(mobile)
        setShowPickerDetailsModal(true)
    }

    const handleEditModal = (rowData: PickerTableData) => {
        setParticularRowData(rowData)
        setShowPickerEditModal(true)
    }
    const handleDelete = (rowData: PickerTableData) => {
        setParticularRowData(rowData)
        setShowPickerDeletesModal(true)
    }

    const handleDeletePicker = () => {
        deletePicker({ mobile: particularRowData?.user?.mobile as string })
    }

    const columns = usePickerColumns({ handleDetailsModal, handleEditModal, handleDelete })

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Picker+App/slikkPicker.apk')
        notification.success({ message: 'Copied' })
    }

    return (
        <div className="p-4 md:p-6 bg-white shadow-2xl rounded-2xl border border-gray-200">
            <div>
                <StoreSelectComponent isSingle label="Select Store" store={storeId} setStore={setStoreId} />
            </div>
            <div className="mb-10 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
                    <input
                        type="search"
                        value={globalFilter}
                        placeholder="Search by rider's name"
                        className="rounded-lg px-3 py-2 w-full sm:w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <Dropdown
                        className="border border-gray-300 rounded-lg text-gray-700 font-semibold bg-white hover:bg-gray-100 transition-all duration-150"
                        title={riderSearchByType}
                        onSelect={(selectedKey) => setRiderSearchByType(selectedKey as string)}
                    >
                        {['mobile', 'name'].map((item) => (
                            <DropdownItem key={item} eventKey={item}>
                                {item}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>

                {/* Buttons Section */}
                <div className="flex flex-wrap gap-3 justify-center xl:justify-end mt-2">
                    <a
                        onClick={handleCopyLink}
                        href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Picker+App/slikkPicker.apk"
                        className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all duration-200"
                    >
                        Picker App Link
                    </a>

                    <Button
                        variant="new"
                        className="!bg-green-600 hover:!bg-green-700 !text-white !rounded-lg !font-medium !shadow-sm transition-all duration-200"
                        onClick={() => setShowPickerAddModal(true)}
                    >
                        Add Picker
                    </Button>

                    <Button
                        variant="new"
                        className="!bg-indigo-600 hover:!bg-indigo-700 !text-white !rounded-lg !font-medium !shadow-sm transition-all duration-200"
                        onClick={() => navigate(`/app/riders/attendance/picker`)}
                    >
                        Picker Attendance
                    </Button>

                    <Button
                        variant="new"
                        className="!bg-gray-700 hover:!bg-gray-800 !text-white !rounded-lg !font-medium !shadow-sm transition-all duration-200"
                        onClick={() => navigate('/app/picker/Leaderboard')}
                    >
                        Leaderboard
                    </Button>

                    <UltimateDatePicker
                        dispatch={dispatch}
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        customClass="border w-auto rounded-md h-auto font-bold mt-0 p-1 bg-black text-white flex justify-center"
                        handleDateChange={(e: [Date | null, Date | null] | null) => handleDateChange(e)}
                    />
                </div>
            </div>

            {/* Tabs Section */}
            <div className="flex gap-6 mb-6 border-b border-gray-300 justify-center sm:justify-start">
                {[
                    { key: 'active', label: 'Active Pickers', color: 'green' },
                    { key: 'in_active', label: 'Inactive Pickers', color: 'red' },
                ].map(({ key, label, color }) => (
                    <div
                        key={key}
                        onClick={() => setTabContent(key)}
                        className={`px-4 py-2 font-semibold text-lg cursor-pointer transition-all duration-200 relative ${
                            tabContent === key ? `text-${color}-600 border-b-4 border-${color}-500` : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md">
                <EasyTable noPage overflow mainData={pickerBoardData} columns={columns} />
            </div>

            {/* Modals */}

            <PickerDetailModal
                dialogIsOpen={showPickerDetailsModal}
                setIsOpen={setShowPickerDetailsModal}
                mobile={particularMobile}
                from={from}
                to={to}
            />

            <PickerDetailEditModal
                isEdit
                dialogIsOpen={showPickerEditModal}
                setIsOpen={setShowPickerEditModal}
                rowDetails={particularRowData as PickerTableData}
            />

            <PickerDetailEditModal dialogIsOpen={showPickerAddModal} setIsOpen={setShowPickerAddModal} />
            <DialogConfirm
                IsDelete
                IsOpen={showPickerDeletesModal}
                closeDialog={() => setShowPickerDeletesModal(false)}
                onDialogOk={handleDeletePicker}
            />
        </div>
    )
}

export default PickerBoard
