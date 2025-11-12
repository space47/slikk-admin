import LoadingSpinner from '@/common/LoadingSpinner'
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
import { pickerBoardData } from '@/store/types/picker.types'
import PickerDetailEditModal from './pickerComponents/PickerDetailEditModal'
import { notification } from 'antd'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { DEBOUNCE_DELAY } from '../../riderDetails/RiderDetailsCommon'

const PickerBoard = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [tabContent, setTabContent] = useState('active')
    const [showPickerDetailsModal, setShowPickerDetailsModal] = useState(false)
    const [showPickerEditModal, setShowPickerEditModal] = useState<boolean>(false)
    const [globalFilter, setGlobalFilter] = useState('')
    const [particularMobile, setParticularMobile] = useState<string>('')
    const [particularRowData, setParticularRowData] = useState<pickerBoardData>()
    const [showPickerAddModal, setShowPickerAddModal] = useState<boolean>(false)
    const [riderSearchByType, setRiderSearchByType] = useState<'mobile' | 'name' | string>('name')
    const { debounceFilter } = useDebounceInput({ globalFilter: globalFilter as string, delay: DEBOUNCE_DELAY })

    const { pickerBoardData, from, to } = useAppSelector<PickerRequiredType>((state) => state.picker)
    const {
        data: boardData,
        isSuccess,
        isLoading,
    } = pickerService.usePickerBoardDataQuery({
        from: from,
        to: to,
        checkin_status: tabContent === 'active' ? `true` : tabContent === 'in_active' ? `false` : '',
        mobile: riderSearchByType === 'mobile' ? debounceFilter : '',
        name: riderSearchByType === 'name' ? debounceFilter : '',
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

    const handleDetailsModal = (mobile: string) => {
        setParticularMobile(mobile)
        setShowPickerDetailsModal(true)
    }

    const handleEditModal = (rowData: pickerBoardData) => {
        setParticularRowData(rowData)
        setShowPickerEditModal(true)
    }

    const columns = usePickerColumns({ handleDetailsModal, handleEditModal })

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Picker+App/slikkPicker.apk')
        notification.success({ message: 'Copied' })
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-4 md:p-6 bg-white shadow-2xl rounded-2xl border border-gray-200">
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
            {showPickerDetailsModal && (
                <PickerDetailModal
                    dialogIsOpen={showPickerDetailsModal}
                    setIsOpen={setShowPickerDetailsModal}
                    mobile={particularMobile}
                    from={from}
                    to={to}
                />
            )}
            {showPickerEditModal && (
                <PickerDetailEditModal
                    isEdit
                    dialogIsOpen={showPickerEditModal}
                    setIsOpen={setShowPickerEditModal}
                    rowDetails={particularRowData as pickerBoardData}
                />
            )}
            {showPickerAddModal && <PickerDetailEditModal dialogIsOpen={showPickerAddModal} setIsOpen={setShowPickerAddModal} />}
        </div>
    )
}

export default PickerBoard
