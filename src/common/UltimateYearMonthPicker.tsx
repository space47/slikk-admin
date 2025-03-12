import React, { useState } from 'react'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import moment from 'moment'

interface YearMonthPickerProps {
    setYear: (year: string) => void
    setMonth: (month: string) => void
    dispatch?: any
}

const MONTHS = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
]

const CURRENT_YEAR = moment().year()
const YEARS = Array.from({ length: 10 }, (_, i) => (CURRENT_YEAR - i).toString())

const UltimateYearMonthPicker: React.FC<YearMonthPickerProps> = ({ setYear, setMonth, dispatch }) => {
    const [selectedYear, setSelectedYear] = useState<string>(CURRENT_YEAR.toString())
    const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('MM'))

    const handleYearSelect = (year: string) => {
        setSelectedYear(year)
        dispatch ? dispatch(setYear(year)) : setYear(year)
    }

    const handleMonthSelect = (month: string) => {
        setSelectedMonth(month)
        dispatch ? dispatch(setMonth(month)) : setMonth(month)
    }

    return (
        <div className="flex gap-2 items-center xl:mr-10">
            <div className="border w-auto rounded-md font-bold bg-black text-white flex justify-center">
                <Dropdown
                    className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                    title={selectedYear}
                    onSelect={(value) => handleYearSelect(value.toString())}
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
                    title={MONTHS.find((m) => m.value === selectedMonth)?.label || 'Select Month'}
                    onSelect={(value) => handleMonthSelect(value.toString())}
                >
                    {MONTHS.map((month) => (
                        <DropdownItem key={month.value} eventKey={month.value}>
                            <span>{month.label}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>
        </div>
    )
}

export default UltimateYearMonthPicker
