/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import moment from 'moment'

import DatePicker from '@/components/ui/DatePicker'

const { DatePickerRange } = DatePicker

const PREVIOUSARRAY = [
    { label: 'TODAY', value: 'TODAY' },
    { label: 'YESTERDAY', value: 'YESTERDAY' },
    { label: 'CURRENT WEEK', value: 'CURRENT WEEK' },
    { label: 'LAST WEEK', value: 'LAST WEEK' },
    { label: 'CURRENT MONTH', value: 'CURRENT MONTH' },
    { label: 'LAST MONTH', value: 'LAST MONTH' },
    { label: 'CUSTOM ', value: 'CUSTOM' },
]

interface DATEPROPS {
    from: any
    to: any
    setFrom: any
    setTo: any
    handleFromChange?: any
    handleToChange?: any
    handleDateChange: any
    dispatch?: any
}

const UltimateDatePicker = ({ setFrom, setTo, handleDateChange, dispatch }: DATEPROPS) => {
    const [selectedOption, setSelectedOption] = useState('TODAY')
    const [showinfDatePicker, setShowingDatePicker] = useState(false)

    const handleSelect = (value: string) => {
        setSelectedOption(value)

        let startDate: string | undefined
        let endDate: string | undefined

        switch (value) {
            case 'TODAY':
                startDate = moment().format('YYYY-MM-DD')
                endDate = startDate
                setShowingDatePicker(false)
                break
            case 'YESTERDAY':
                startDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
                endDate = startDate
                setShowingDatePicker(false)
                break
            case 'CURRENT WEEK':
                startDate = moment().startOf('isoWeek').format('YYYY-MM-DD')
                endDate = moment().endOf('isoWeek').format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'LAST WEEK':
                startDate = moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
                endDate = moment().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'CURRENT MONTH':
                startDate = moment().startOf('month').format('YYYY-MM-DD')
                endDate = moment().endOf('month').format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'LAST MONTH':
                startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'CUSTOM':
                setShowingDatePicker(true)
                break
            default:
                return
        }

        if (dispatch) {
            dispatch(setFrom(startDate))
            dispatch(setTo(endDate))
        } else {
            setFrom(startDate)
            setTo(endDate)
        }
    }

    return (
        <div className="flex gap-1 items-center xl:mr-10">
            <div className="border w-auto rounded-md h-auto font-bold mt-8 bg-black text-white flex justify-center">
                <Dropdown
                    className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                    title={selectedOption}
                    onSelect={(value) => handleSelect(value.toString())}
                >
                    {PREVIOUSARRAY.map((item) => (
                        <DropdownItem key={item.value} eventKey={item.value}>
                            <span>{item.label}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            {showinfDatePicker && (
                <div className="xl:w-[230px] w-[200px]">
                    <div className="mb-2">Date Range:</div>
                    <DatePickerRange placeholder="Select dates range" onChange={handleDateChange} singleDate />
                </div>
            )}
        </div>
    )
}

export default UltimateDatePicker
