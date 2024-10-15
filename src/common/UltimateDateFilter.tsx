/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import moment from 'moment'
import { TbCalendarStats } from 'react-icons/tb'
import { HiOutlineCalendar } from 'react-icons/hi'
import DatePicker from '@/components/ui/DatePicker'

const { DatePickerRange } = DatePicker

// Array of months for selection
const MONTHS = Array.from({ length: 12 }, (_, index) => ({
    label: moment().month(index).format('MMMM'), // January, February, etc.
    value: index, // 0 for January, 1 for February, etc.
}))

const PREVIOUSARRAY = [
    { label: 'TODAY', value: 'TODAY' },
    { label: 'YESTERDAY', value: 'YESTERDAY' },
    { label: 'CURRENT_WEEK', value: 'CURRENT_WEEK' },
    { label: 'LAST_WEEK', value: 'LAST_WEEK' },
    { label: 'CURRENT_MONTH', value: 'CURRENT_MONTH' },
    { label: 'LAST_MONTH', value: 'LAST_MONTH' },
]

interface DATEPROPS {
    from: any
    to: any
    setFrom: any
    setTo: any
    handleFromChange: any
    handleToChange: any
    handleDateChange: any
}

const UltimateDatePicker = ({ handleFromChange, handleToChange, from, to, setFrom, setTo, handleDateChange }: DATEPROPS) => {
    const currentMonth = moment().month()
    const [selectedOption, setSelectedOption] = useState('TODAY')

    const handleSelect = (value: string) => {
        setSelectedOption(value)

        let startDate: string
        let endDate: string

        switch (value) {
            case 'TODAY':
                startDate = moment().format('YYYY-MM-DD')
                endDate = startDate
                break
            case 'YESTERDAY':
                startDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
                endDate = startDate
                break
            case 'CURRENT_WEEK':
                startDate = moment().startOf('week').format('YYYY-MM-DD')
                endDate = moment().endOf('week').format('YYYY-MM-DD')
                break
            case 'LAST_WEEK':
                startDate = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD')
                endDate = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD')
                break
            case 'CURRENT_MONTH':
                startDate = moment().startOf('month').format('YYYY-MM-DD')
                endDate = moment().endOf('month').format('YYYY-MM-DD')
                break
            case 'LAST_MONTH':
                startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                break
            default:
                return
        }

        setFrom(startDate)
        setTo(endDate)
    }

    return (
        <div className="flex gap-1 items-center">
            <div className="border w-auto rounded-sm h-[40px] font-bold mt-8">
                <Dropdown
                    className="text-xl text-black bg-gray-200 font-bold border-2 border-blue-600"
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

            <div className="w-[250px]">
                <div className="mb-2">Date Range:</div>
                <DatePickerRange placeholder="Select dates range" onChange={handleDateChange} />
            </div>
        </div>
    )
}

export default UltimateDatePicker
