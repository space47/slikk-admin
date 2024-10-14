import React, { useState } from 'react'
import moment from 'moment'
import MultipleDatePicker from '@/common/MultipleDatePicker'

const MonthlyReport = () => {
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))

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

    console.log(from, '------', to)

    return (
        <div>
            <MultipleDatePicker
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo}
                handleFromChange={handleFromChange}
                handleToChange={handleToChange}
            />
        </div>
    )
}

export default MonthlyReport
