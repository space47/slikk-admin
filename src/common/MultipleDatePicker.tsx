/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Button, DatePicker, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import moment from 'moment'
import { TbCalendarStats } from 'react-icons/tb'
import { HiOutlineCalendar } from 'react-icons/hi'

// Array of months for selection
const MONTHS = Array.from({ length: 12 }, (_, index) => ({
    label: moment().month(index).format('MMMM'), // January, February, etc.
    value: index, // 0 for January, 1 for February, etc.
}))

interface DATEPROPS {
    from: any
    to: any
    setFrom: any
    setTo: any
    handleFromChange: any
    handleToChange: any
}

const MultipleDatePicker = ({ handleFromChange, handleToChange, from, to, setFrom, setTo }: DATEPROPS) => {
    const currentMonth = moment().month()
    const [selectedOption, setSelectedOption] = useState(MONTHS[currentMonth].label)

    const handleSelect = (monthIndex: number) => {
        setSelectedOption(MONTHS[monthIndex].label)
        const startOfMonth = moment().month(monthIndex).startOf('month').format('YYYY-MM-DD')
        const endOfMonth = moment().month(monthIndex).endOf('month').format('YYYY-MM-DD')

        setFrom(startOfMonth)
        setTo(endOfMonth)
    }

    return (
        <div className="flex gap-20 items-center">
            <div className="border w-auto rounded-sm h-[40px] font-bold ">
                <Dropdown
                    className="text-xl text-black bg-gray-200 font-bold border-2 border-blue-600"
                    title={selectedOption}
                    onSelect={(value) => handleSelect(Number(value))}
                >
                    {MONTHS.map((month) => (
                        <DropdownItem key={month.value} eventKey={month.value.toString()}>
                            <span>{month.label}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            <div className="flex space-x-4">
                <span>
                    <div className="mb-1 font-semibold text-xs md:text-sm">FROM DATE:</div>
                    <DatePicker
                        inputPrefix={<HiOutlineCalendar className="text-base md:text-lg" />}
                        defaultValue={new Date()}
                        value={new Date(from)}
                        onChange={handleFromChange}
                        className="w-2/3"
                    />
                </span>
                <div>
                    <div className="mb-1 font-semibold text-xs md:text-sm">TO DATE:</div>
                    <DatePicker
                        inputSuffix={<TbCalendarStats className="text-base md:text-xl" />}
                        defaultValue={new Date()}
                        value={moment(to).toDate()}
                        onChange={handleToChange}
                        minDate={moment(from).toDate()}
                        className="w-2/3"
                    />
                </div>
            </div>
        </div>
    )
}

export default MultipleDatePicker
