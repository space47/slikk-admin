import React, { useState } from 'react'
import moment from 'moment'
import MultipleDatePicker from '@/common/MultipleDatePicker'
import UltimateDatePicker from '@/common/UltimateDateFilter'

const MonthlyReport = () => {
    const [from, setFrom] = useState<string>(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState<string>(moment().format('YYYY-MM-DD'))

    const handleFromChange = (date: Date | null) => {
        if (date) {
            setFrom(moment(date).format('YYYY-MM-DD'))
        } else {
            setFrom(moment().format('YYYY-MM-DD'))
        }
    }

    const handleToChange = (date: Date | null) => {
        if (date) {
            setTo(moment(date).format('YYYY-MM-DD'))
        } else {
            setTo(moment().format('YYYY-MM-DD'))
        }
    }

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }
    console.log(from, '------', to)
    return (
        <div>
            <UltimateDatePicker
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo}
                handleFromChange={handleFromChange}
                handleToChange={handleToChange}
                handleDateChange={handleDateChange}
            />
        </div>
    )
}

export default MonthlyReport
