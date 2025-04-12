/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from 'antd'
import moment from 'moment'
import React from 'react'

interface props {
    label: string
    valueDate: any
    handleTimeChange: any
}

const BannerDateSelector = ({ valueDate, handleTimeChange, label }: props) => {
    return (
        <div className="flex flex-col gap-2">
            <div>{label}</div>
            <DatePicker
                showTime
                placeholder=""
                value={
                    valueDate && moment(valueDate, 'YYYY-MM-DD HH:mm:ss', true).isValid() ? moment(valueDate, 'YYYY-MM-DD HH:mm:ss') : null
                }
                onChange={handleTimeChange}
            />
        </div>
    )
}

export default BannerDateSelector
