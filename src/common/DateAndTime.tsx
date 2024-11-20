import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import moment from 'moment'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'

interface DateAndTimePickerProps {
    fromDate: string
    toDate: string
    setFromDateAndTime: any
    setToDateAndTime: any
    shortSpace?: boolean
}

export default function DateAndTimePicker({ fromDate, toDate, setFromDateAndTime, setToDateAndTime, shortSpace }: DateAndTimePickerProps) {
    console.log('formDate d$T', fromDate)
    console.log('formDate moment', moment(fromDate))

    const handleFromTimeChange = (value: any) => {
        console.log('HandleTimeChange', value)
        setFromDateAndTime(moment(value).format('YYYY-MM-DD HH:mm:ss'))
    }

    const handleToTimeChange = (value: any) => {
        setToDateAndTime(moment(value).format('YYYY-MM-DD HH:mm:ss'))
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                <div className={shortSpace ? `flex gap-4` : 'flex justify-between'}>
                    <DateTimePicker
                        label="Start Date"
                        value={moment(fromDate)}
                        onChange={(newValue) => handleFromTimeChange(newValue)}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                    />
                    <DateTimePicker
                        label="End Date"
                        value={moment(toDate)}
                        onChange={(newValue) => handleToTimeChange(newValue)}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                    />
                </div>
            </DemoContainer>
        </LocalizationProvider>
    )
}
