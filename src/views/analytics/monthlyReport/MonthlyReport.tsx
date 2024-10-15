/* eslint-disable @typescript-eslint/no-explicit-any */
// MonthlyReport.tsx
import React, { useEffect } from 'react'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchMonthlyReport, setFrom, setTo } from '@/store/slices/monthlyReport/monthlyReport.slice'
import ReportCards from './monthlyComponents/ReportCards'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'

const MonthlyReport = () => {
    const dispatch = useAppDispatch()
    const { monthlyReport, from, to } = useAppSelector((state: { monthlyReport: MONTHLYREPORTTYPES }) => state.monthlyReport)
    console.log(monthlyReport)

    useEffect(() => {
        dispatch(fetchMonthlyReport())
    }, [dispatch])

    const handleFromChange = (date: Date | null) => {
        dispatch(setFrom(date ? date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)))
    }

    const handleToChange = (date: Date | null) => {
        dispatch(setTo(date ? date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)))
    }

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

    return (
        <div className="flex flex-col gap-4">
            <div>
                <UltimateDatePicker
                    setFrom={setFrom}
                    setTo={setTo}
                    from={from}
                    to={to}
                    handleFromChange={handleFromChange}
                    handleToChange={handleToChange}
                    handleDateChange={handleDateChange}
                />
            </div>
            <ReportCards handleUserDOWNLOAD={handleUserDOWNLOAD} />
        </div>
    )
}

export default MonthlyReport
