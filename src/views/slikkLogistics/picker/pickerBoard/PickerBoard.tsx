import LoadingSpinner from '@/common/LoadingSpinner'
import { useAppDispatch, useAppSelector } from '@/store'
import { pickerService } from '@/store/services/pickerServices'
import { PickerRequiredType, setPickerBoardData, setFrom, setTo } from '@/store/slices/pickerSlice/picker.slice'
import React, { useEffect, useState } from 'react'
import { usePickerColumns } from '../pickerUtils/usePickerColumns'
import EasyTable from '@/common/EasyTable'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import moment from 'moment'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import PickerDetailModal from './pickerComponents/PickerDetailModal'
import { pickerBoardData } from '@/store/types/picker.types'
import PickerDetailEditModal from './pickerComponents/PickerDetailEditModal'

const PickerBoard = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [tabContent, setTabContent] = useState('active')
    const [showPickerDetailsModal, setShowPickerDetailsModal] = useState(false)
    const [showPickerEditModal, setShowPickerEditModal] = useState<boolean>(false)
    const [particularMobile, setParticularMobile] = useState<string>('')
    const [particularRowData, setParticularRowData] = useState<pickerBoardData>()
    const [showPickerAddModal, setShowPickerAddModal] = useState<boolean>(false)
    const { pickerBoardData, from, to } = useAppSelector<PickerRequiredType>((state) => state.picker)
    const {
        data: boardData,
        isSuccess,
        isLoading,
    } = pickerService.usePickerBoardDataQuery({
        from: from,
        to: to,
        checkin_status: tabContent === 'active' ? `true` : tabContent === 'in_active' ? `false` : '',
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

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-2 shadow-xl rounded-xl">
            <div className="mb-10 flex  justify-between items-center">
                <div>
                    <UltimateDatePicker
                        dispatch={dispatch}
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        handleDateChange={(e: [Date | null, Date | null] | null) => handleDateChange(e)}
                    />
                </div>
                <div className="mt-7 flex gap-2 flex-col xl:flex-row">
                    <span>
                        <Button variant="new" onClick={() => setShowPickerAddModal(true)}>
                            Add Picker
                        </Button>
                    </span>
                    <Button variant="new" onClick={() => navigate(`/app/riders/attendance/picker`)}>
                        Picker Attendance
                    </Button>
                    <Button variant="new" onClick={() => navigate('/app/picker/Leaderboard')}>
                        Leader Board
                    </Button>
                </div>
            </div>
            <div>
                <div className="flex gap-4 mb-5 border-b-2 border-gray-200">
                    <div
                        onClick={() => setTabContent('active')}
                        className={`px-4 py-2 font-semibold text-lg transition-colors duration-300 ${
                            tabContent === 'active' ? 'border-b-4 border-green-500 text-green-600' : 'text-gray-500 hover:text-green-500'
                        } cursor-pointer`}
                    >
                        Active Pickers
                    </div>

                    <div
                        onClick={() => setTabContent('in_active')}
                        className={`px-4 py-2 font-semibold text-lg transition-colors duration-300 ${
                            tabContent === 'in_active' ? 'border-b-4 border-green-500 text-green-600' : 'text-gray-500 hover:text-green-500'
                        } cursor-pointer`}
                    >
                        InActive Pickers
                    </div>
                </div>
            </div>
            <div>
                <EasyTable noPage overflow mainData={pickerBoardData} columns={columns} />
            </div>
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
