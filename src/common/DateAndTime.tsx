import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'

interface DateAndTimePickerProps {
    fromDate?: string
    toDate?: string
    setFromDateAndTime: (date: string) => void
    setToDateAndTime: (date: string) => void
    shortSpace?: boolean
}

export default function DateAndTimePicker({ fromDate, toDate, setFromDateAndTime, setToDateAndTime, shortSpace }: DateAndTimePickerProps) {
    const parsedFromDate = fromDate ? dayjs(fromDate) : dayjs()
    const parsedToDate = toDate ? dayjs(toDate) : dayjs()

    const handleFromTimeChange = (value: Dayjs | null) => {
        if (value) {
            setFromDateAndTime(value.format('YYYY-MM-DD HH:mm:ss'))
        }
    }

    const handleToTimeChange = (value: Dayjs | null) => {
        if (value) {
            setToDateAndTime(value.format('YYYY-MM-DD HH:mm:ss'))
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                <div className={shortSpace ? `flex gap-4` : 'flex justify-between'}>
                    <DateTimePicker
                        label="Start Date"
                        value={parsedFromDate}
                        onChange={(newValue) => handleFromTimeChange(newValue)}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                    />
                    <DateTimePicker
                        label="End Date"
                        value={parsedToDate}
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
