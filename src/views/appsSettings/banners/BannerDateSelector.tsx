/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

interface Props {
    label: string
    valueDate: string | null
    handleTimeChange: any
}

const BannerDateSelector = ({ valueDate, handleTimeChange, label }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <div>{label}</div>
            <DatePicker
                showTime
                placeholder=""
                value={valueDate && dayjs(valueDate, 'YYYY-MM-DD HH:mm:ss').isValid() ? dayjs(valueDate, 'YYYY-MM-DD HH:mm:ss') : null}
                onChange={handleTimeChange}
            />
        </div>
    )
}

export default BannerDateSelector
