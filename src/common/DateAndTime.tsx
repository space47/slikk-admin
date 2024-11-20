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
    onFromChange?: any
    onToChange?: any
    shortSpace?: boolean
}

export default function DateAndTimePicker({ fromDate, toDate, onFromChange, onToChange, shortSpace }: DateAndTimePickerProps) {
    console.log('formDate', fromDate)
    console.log('formDate moment', moment(fromDate))

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                <div className={shortSpace ? `flex gap-4` : 'flex justify-between'}>
                    <DateTimePicker
                        label="Start Date"
                        value={moment(fromDate)}
                        onChange={(newValue) => onFromChange(newValue)}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                    />
                    <DateTimePicker
                        label="End Date"
                        value={moment(toDate)}
                        onChange={(newValue) => onToChange(newValue)}
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
