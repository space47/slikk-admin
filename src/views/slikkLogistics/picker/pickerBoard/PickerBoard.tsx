import LoadingSpinner from '@/common/LoadingSpinner'
import { useAppDispatch, useAppSelector } from '@/store'
import { pickerService } from '@/store/services/pickerServices'
import { PickerRequiredType, setPickerBoardData, setFrom, setTo } from '@/store/slices/pickerSlice/picker.slice'
import React, { useEffect } from 'react'
import { usePickerColumns } from '../pickerUtils/usePickerColumns'
import EasyTable from '@/common/EasyTable'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import moment from 'moment'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

const PickerBoard = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { pickerBoardData, from, to } = useAppSelector<PickerRequiredType>((state) => state.picker)
    const {
        data: boardData,
        isSuccess,
        isLoading,
    } = pickerService.usePickerBoardDataQuery({
        from: from,
        to: to,
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

    const columns = usePickerColumns()

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div>
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
                <div className="mt-7">
                    <Button variant="new" onClick={() => navigate(`/app/riders/attendance/picker`)}>
                        Picker Attendance
                    </Button>
                </div>
            </div>
            <div>
                <EasyTable noPage overflow mainData={pickerBoardData} columns={columns} />
            </div>
        </div>
    )
}

export default PickerBoard
