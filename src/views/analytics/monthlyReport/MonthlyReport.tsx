/* eslint-disable @typescript-eslint/no-explicit-any */
// MonthlyReport.tsx
import React, { useEffect, useState } from 'react'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchMonthlyReport, setFrom, setTo } from '@/store/slices/monthlyReport/monthlyReport.slice'
import ReportCards from './monthlyComponents/ReportCards'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import DailyReportDraph from './monthlyComponents/DailyReportGraph'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import WeekOnWeekGraph from './monthlyComponents/WeekonWeekGraph'
import MonthlyReportGraph from './monthlyComponents/MonthlyReportGraph'

const GRAPHARRAY = [
    { label: 'DAILY', value: 'DAILY' },
    { label: 'WEEK ON WEEK', value: 'WEEK ON WEEK' },
    { label: 'MONTHLY', value: 'MONTHLY' },
]

const MonthlyReport = () => {
    const dispatch = useAppDispatch()
    const { monthlyReport, from, to } = useAppSelector((state: { monthlyReport: MONTHLYREPORTTYPES }) => state.monthlyReport)
    const [selectedOption, setSelectedOption] = useState('DAILY')
    console.log(monthlyReport)

    useEffect(() => {
        dispatch(fetchMonthlyReport())
    }, [dispatch, from, to])

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(dates[0].toISOString().slice(0, 10)))
            dispatch(setTo(dates[1] ? dates[1].toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)))
        }
    }

    const handleUserDOWNLOAD = async (value: any[]) => {
        if (!value || value.length === 0) {
            console.error('No data available to download')
            return
        }

        const headers = Object.keys(value[0]).join(',')

        const rows = value
            .map((obj) =>
                Object.values(obj)
                    .map((val) => `"${val}"`)
                    .join(','),
            )
            .join('\n')

        const csvContent = `${headers}\n${rows}`

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'data.csv')

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)
    }

    const handleSelect = (value: string) => {
        setSelectedOption(value)
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <UltimateDatePicker
                    setFrom={setFrom}
                    setTo={setTo}
                    from={from}
                    to={to}
                    handleDateChange={handleDateChange}
                    dispatch={dispatch}
                />
            </div>

            <div className="bg-black text-white w-[150px] rounded-[8px] items-center flex justify-center">
                <Dropdown
                    className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                    title={selectedOption}
                    onSelect={(value) => handleSelect(value.toString())}
                >
                    {GRAPHARRAY.map((item) => (
                        <DropdownItem key={item.value} eventKey={item.value}>
                            <span>{item.label}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            {selectedOption === 'DAILY' && <DailyReportDraph />}
            {selectedOption === 'WEEK ON WEEK' && <WeekOnWeekGraph />}
            {selectedOption === 'MONTHLY' && <MonthlyReportGraph />}
            <ReportCards handleUserDOWNLOAD={handleUserDOWNLOAD} />
        </div>
    )
}

export default MonthlyReport
