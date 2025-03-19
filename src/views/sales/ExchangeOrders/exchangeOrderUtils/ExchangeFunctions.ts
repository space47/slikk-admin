/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { DropdownStatus, SEARCHOPTIONS_EXCHNAGE } from '../ExchangeCommon'
import { Dispatch, SetStateAction } from 'react'

export const handleDateChange = (
    dates: [Date | null, Date | null] | null,
    setFrom: Dispatch<SetStateAction<string>>,
    setTo: Dispatch<SetStateAction<string>>,
) => {
    if (dates && dates[0]) {
        setFrom(moment(dates[0]).format('YYYY-MM-DD'))
        setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
    }
}

export const handleSelect = (value: any, setCurrentSelectedPage: Dispatch<SetStateAction<Record<string, string>>>) => {
    const selected = SEARCHOPTIONS_EXCHNAGE.find((item) => item.value === value)
    if (selected) {
        setCurrentSelectedPage(selected)
    }
}

export const handleDropDownSelect = (
    selectedValue: string,
    deliveryType: DropdownStatus,
    setDeliveryType: Dispatch<SetStateAction<DropdownStatus>>,
) => {
    if (deliveryType.value.includes(selectedValue)) {
        setDeliveryType((prevState) => ({
            ...prevState,
            value: prevState.value.filter((item) => item !== selectedValue),
        }))
    } else {
        setDeliveryType((prevState) => ({
            ...prevState,
            value: [...prevState.value, selectedValue],
        }))
    }
}
