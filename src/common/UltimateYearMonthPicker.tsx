import React, { useState } from 'react'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import moment from 'moment'
import { CURRENT_YEAR, MONTHS_NUMBER, WEEK_NUMBERS, YEARS } from '@/constants/monthsNumber.constant'
import { handleMonthSelect, handleWeekSelect, handleYearSelect } from './MonthYearCalc'

interface YearMonthPickerProps {
    setYear: (year: string) => void
    setMonth: (month: string) => void
    handleYearMonthChange: (year: string, month: string) => void
    handleWeekChange: (startWeek: string, endWeek: string) => void
    isWeek: boolean
    setIsWeek: (isWeek: boolean) => void
}

const UltimateYearMonthPicker: React.FC<YearMonthPickerProps> = ({
    setYear,
    setMonth,
    handleYearMonthChange,
    handleWeekChange,
    setIsWeek,
    isWeek,
}) => {
    const [selectedYear, setSelectedYear] = useState<string>(CURRENT_YEAR.toString())
    const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('MM'))
    const [selectedWeek, setSelectedWeek] = useState<number>()

    return (
        <div className="flex gap-2 items-center xl:mr-10">
            <div className="border w-auto rounded-md font-bold bg-black text-white flex justify-center">
                <Dropdown
                    className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                    title={selectedYear}
                    onSelect={(value) => handleYearSelect(value.toString(), setSelectedYear, setYear, handleYearMonthChange, selectedMonth)}
                >
                    {YEARS.map((year) => (
                        <DropdownItem key={year} eventKey={year}>
                            <span>{year}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            <div className="border w-auto rounded-md font-bold bg-black text-white flex justify-center">
                <Dropdown
                    className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                    title={MONTHS_NUMBER.find((m) => m.value === selectedMonth)?.label || 'Select Month'}
                    onSelect={(value) =>
                        handleMonthSelect(value.toString(), setSelectedMonth, setMonth, handleYearMonthChange, selectedYear)
                    }
                >
                    {MONTHS_NUMBER.map((month) => (
                        <DropdownItem key={month.value} eventKey={month.value}>
                            <span>{month.label}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>
            <div className="border w-auto rounded-md font-bold bg-black text-white flex justify-center">
                <Dropdown
                    className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                    title={WEEK_NUMBERS.find((m) => m.value === selectedWeek)?.label || 'Select Week'}
                    onSelect={(value) => {
                        setIsWeek(true)
                        handleWeekSelect(Number(value), setSelectedWeek, handleWeekChange, isWeek, selectedYear, selectedMonth)
                    }}
                >
                    {WEEK_NUMBERS.map((month) => (
                        <DropdownItem key={month.value} eventKey={month.value?.toString()}>
                            <span>{month.label}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>
        </div>
    )
}

export default UltimateYearMonthPicker
