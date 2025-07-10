/* eslint-disable @typescript-eslint/no-explicit-any */

import moment from 'moment'

import { CHANGE_DELIVERY_OPTIONS, SEARCHOPTIONS } from '../commontypes'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

export const handleDownload = async (
    from: string,
    to: string,
    dropdownStatus: any,
    deliveryType: any,
    paymentType: any,
    currentSelectedPage: any,
    searchInput: any,
    setIsDownloading: any,
) => {
    setIsDownloading(true)
    notification.info({
        message: 'Download in process',
    })
    try {
        const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
        const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`

        let deliveryStatus = ''
        let paymentStatus = ''

        if (deliveryType?.value && deliveryType?.value.length > 0) {
            deliveryStatus = `&delivery_type=${deliveryType?.value}`
        }

        if (paymentType?.value && paymentType?.value.length > 0) {
            paymentStatus = `&payment_mode=${paymentType?.value}`
        }

        let searwiseDownload = ''
        if (currentSelectedPage.value === 'invoice' && searchInput) {
            searwiseDownload = `&invoice_id=${searchInput}`
        } else if (currentSelectedPage.value === 'mobile' && searchInput) {
            searwiseDownload = `&mobile=${searchInput}`
        }

        const downloadUrl = `merchant/orders?download=true${searwiseDownload}${status}&from=${from}&to=${To_Date}${deliveryStatus}${paymentStatus}`

        const response = await axioisInstance.get(downloadUrl, {
            responseType: 'blob',
        })

        const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = urlToBeDownloaded
        link.download = 'OrderDetails.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Error downloading the file:', error)
    } finally {
        setIsDownloading(false)
    }
}

export const handleDeliveryChange = (selectedValue: any, row: any, setDeliveryChangeType: any, deliveryChangeAPI: any) => {
    const selectedLabel = CHANGE_DELIVERY_OPTIONS.find((item) => item.value === selectedValue)?.label || ''

    setDeliveryChangeType((prev: any) => ({
        ...prev,
        [row]: { value: selectedValue, label: selectedLabel },
    }))

    deliveryChangeAPI(selectedValue, row)
}

export const onPaginationChange = (page: number, setPage: (x: number) => void) => {
    setPage(page)
}

export const onSelectChange = (value: number | undefined, setPageSize: (x: number) => void, setPage: (x: number) => void) => {
    setPage(1)
    setPageSize(Number(value))
}

export const handleSelect = (value: any, setCurrentSelectedPage: any) => {
    const selected = SEARCHOPTIONS.find((item) => item.value === value)
    if (selected) {
        setCurrentSelectedPage(selected)
    }
}
export const handleSearch = (e: React.ChangeEvent<HTMLInputElement>, setSearchOnEnter: any) => {
    setSearchOnEnter(e.target.value)
}
export const handleSearchWithIcon = (setSearchOnEnter: any, searchInput: string) => {
    setSearchOnEnter(searchInput)
}

export const handleDateChange = (dates: [Date | null, Date | null] | null, setFrom: (x: string) => void, setTo: (x: string) => void) => {
    if (dates && dates[0]) {
        setFrom(moment(dates[0]).format('YYYY-MM-DD'))
        setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
    }
}
