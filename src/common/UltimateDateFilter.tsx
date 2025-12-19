/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Dialog, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import moment from 'moment'

import DatePicker from '@/components/ui/DatePicker'

const { DatePickerRange } = DatePicker

const PREVIOUSARRAY = [
    { label: 'TODAY', value: 'TODAY' },
    { label: 'YESTERDAY', value: 'YESTERDAY' },
    { label: 'CURRENT WEEK', value: 'CURRENT WEEK' },
    { label: 'LAST WEEK', value: 'LAST WEEK' },
    { label: 'CURRENT MONTH', value: 'CURRENT MONTH' },
    { label: 'LAST MONTH', value: 'LAST MONTH' },
    { label: 'FINANCIAL YEAR', value: 'FINANCIAL_YEAR' },
    { label: 'OVERALL', value: 'OVERALL' },
    { label: 'YEARLY', value: 'YEARLY' },
    { label: 'CUSTOM ', value: 'CUSTOM' },
]

interface DATEPROPS {
    from: any
    to: any
    setFrom: any
    setTo: any
    handleDateChange: any
    dispatch?: any
    customClass?: string
}

const UltimateDatePicker = ({ setFrom, setTo, handleDateChange, dispatch, customClass }: DATEPROPS) => {
    const [selectedOption, setSelectedOption] = useState('TODAY')
    const [showingDatePicker, setShowingDatePicker] = useState(false)
    const [tempRange, setTempRange] = useState<any>(null)

    const handleSelect = (value: string) => {
        setSelectedOption(value)

        let startDate: string | undefined
        let endDate: string | undefined

        switch (value) {
            case 'TODAY':
                startDate = moment().format('YYYY-MM-DD')
                endDate = startDate
                setShowingDatePicker(false)
                break
            case 'YESTERDAY':
                startDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
                endDate = startDate
                setShowingDatePicker(false)
                break
            case 'CURRENT WEEK':
                startDate = moment().startOf('isoWeek').format('YYYY-MM-DD')
                endDate = moment().endOf('isoWeek').format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'LAST WEEK':
                startDate = moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
                endDate = moment().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'CURRENT MONTH':
                startDate = moment().startOf('month').format('YYYY-MM-DD')
                endDate = moment().endOf('month').format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'LAST MONTH':
                startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'FINANCIAL_YEAR': {
                const currentYear = moment().year()
                // If today is before April, financial year started April 1 of last year
                const fyStart =
                    moment().month() < 3
                        ? moment([currentYear - 1, 3, 1]) // April 1 last year
                        : moment([currentYear, 3, 1]) // April 1 this year
                startDate = fyStart.format('YYYY-MM-DD')
                endDate = moment().format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            }
            case 'OVERALL':
                startDate = moment('2024-08-01').format('YYYY-MM-DD')
                endDate = moment().format('YYYY-MM-DD')
                setShowingDatePicker(false)
                break
            case 'YEARLY':
                startDate = moment().startOf('year').format('YYYY-MM-DD') // Jan 1 of this year
                endDate = moment().format('YYYY-MM-DD') // today
                setShowingDatePicker(false)
                break
            case 'CUSTOM':
                setShowingDatePicker(true)

                break
            default:
                return
        }

        if (dispatch) {
            dispatch(setFrom(startDate))
            dispatch(setTo(endDate))
        } else {
            setFrom(startDate)
            setTo(endDate)
        }
    }

    const applyCustomRange = () => {
        if (tempRange?.[0] && tempRange?.[1]) {
            const startDate = moment(tempRange[0]).format('YYYY-MM-DD')
            const endDate = moment(tempRange[1]).format('YYYY-MM-DD')

            if (dispatch) {
                dispatch(setFrom(startDate))
                dispatch(setTo(endDate))
            } else {
                setFrom(startDate)
                setTo(endDate)
            }

            handleDateChange([startDate, endDate])
            setShowingDatePicker(false)
        }
    }

    return (
        <div className="flex gap-1 items-center xl:mr-14">
            <div
                className={
                    customClass ? customClass : 'border w-auto rounded-md h-auto font-bold mt-8 bg-black text-white flex justify-center'
                }
            >
                <Dropdown
                    className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                    title={selectedOption}
                    onSelect={(value) => handleSelect(value.toString())}
                >
                    {PREVIOUSARRAY.map((item) => (
                        <DropdownItem key={item.value} eventKey={item.value}>
                            <span>{item.label}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            {showingDatePicker && (
                <Dialog isOpen={showingDatePicker} onClose={() => setShowingDatePicker(false)}>
                    <div className="w-full bg-white border rounded-2xl shadow-md p-3 mt-5">
                        <div className="mb-3 font-semibold text-gray-700 text-sm">Select Date Range</div>

                        <DatePickerRange
                            placeholder="Choose dates"
                            onChange={(val) => setTempRange(val)} // store temp value
                            singleDate
                            className="w-full border rounded-lg px-2 py-1"
                        />

                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={() => setShowingDatePicker(false)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={applyCustomRange}
                                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    )
}

export default React.memo(UltimateDatePicker)
