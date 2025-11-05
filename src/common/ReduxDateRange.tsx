/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Dialog, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import DatePicker from '@/components/ui/DatePicker'
import { setDateRange } from '@/store/slices/dateRange/dateRange.slice'

const { DatePickerRange } = DatePicker

interface DATEPROPS {
    id: string
    setFrom: (val: string) => void
    setTo: (val: string) => void
    handleDateChange: any
}

const ReduxDateRange = ({ id, setFrom, setTo, handleDateChange }: DATEPROPS) => {
    const dispatch = useDispatch()
    const storedRange = useSelector((state: any) => state.dateRange[id])
    const [selectedOption, setSelectedOption] = useState('TODAY')
    const [showingDatePicker, setShowingDatePicker] = useState(false)
    const [tempRange, setTempRange] = useState<any>(null)

    useEffect(() => {
        if (storedRange) {
            setFrom(storedRange.from)
            setTo(storedRange.to)
            setSelectedOption(storedRange.label)
        }
    }, [storedRange])

    const handleSelect = (value: string) => {
        setSelectedOption(value)

        let startDate: string | undefined
        let endDate: string | undefined

        switch (value) {
            case 'TODAY':
                startDate = moment().format('YYYY-MM-DD')
                endDate = startDate
                break
            case 'YESTERDAY':
                startDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
                endDate = startDate
                break
            case 'CURRENT WEEK':
                startDate = moment().startOf('isoWeek').format('YYYY-MM-DD')
                endDate = moment().endOf('isoWeek').format('YYYY-MM-DD')
                break
            case 'LAST WEEK':
                startDate = moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
                endDate = moment().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD')
                break
            case 'CURRENT MONTH':
                startDate = moment().startOf('month').format('YYYY-MM-DD')
                endDate = moment().endOf('month').format('YYYY-MM-DD')
                break
            case 'LAST MONTH':
                startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                break
            case 'FINANCIAL_YEAR': {
                const currentYear = moment().year()
                const fyStart = moment().month() < 3 ? moment([currentYear - 1, 3, 1]) : moment([currentYear, 3, 1])
                startDate = fyStart.format('YYYY-MM-DD')
                endDate = moment().format('YYYY-MM-DD')
                break
            }
            case 'OVERALL':
                startDate = moment('2024-08-01').format('YYYY-MM-DD')
                endDate = moment().format('YYYY-MM-DD')
                break
            case 'YEARLY':
                startDate = moment().startOf('year').format('YYYY-MM-DD')
                endDate = moment().format('YYYY-MM-DD')
                break
            case 'CUSTOM':
                setShowingDatePicker(true)
                return
            default:
                return
        }

        setFrom(startDate)
        setTo(endDate)
        handleDateChange([startDate, endDate])
        dispatch(setDateRange({ id, from: startDate, to: endDate, label: value }))
    }

    const applyCustomRange = () => {
        if (tempRange?.[0] && tempRange?.[1]) {
            const startDate = moment(tempRange[0]).format('YYYY-MM-DD')
            const endDate = moment(tempRange[1]).format('YYYY-MM-DD')

            setFrom(startDate)
            setTo(endDate)
            handleDateChange([startDate, endDate])

            dispatch(setDateRange({ id, from: startDate, to: endDate, label: 'CUSTOM' }))
            setShowingDatePicker(false)
        }
    }

    return (
        <div className="flex gap-1 items-center xl:mr-14">
            <div className="border w-auto rounded-md h-auto font-bold mt-8 bg-black text-white flex justify-center">
                <Dropdown
                    className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                    title={selectedOption}
                    onSelect={(value) => handleSelect(value.toString())}
                >
                    {[
                        'TODAY',
                        'YESTERDAY',
                        'CURRENT WEEK',
                        'LAST WEEK',
                        'CURRENT MONTH',
                        'LAST MONTH',
                        'FINANCIAL_YEAR',
                        'OVERALL',
                        'YEARLY',
                        'CUSTOM',
                    ].map((item) => (
                        <DropdownItem key={item} eventKey={item}>
                            <span>{item}</span>
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
                            onChange={(val) => setTempRange(val)}
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

export default ReduxDateRange
