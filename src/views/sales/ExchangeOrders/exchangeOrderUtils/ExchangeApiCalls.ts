/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { DropdownStatus } from '../ExchangeCommon'
import { Dispatch, SetStateAction } from 'react'

export const handleNumberClick = async (
    number: number,
    setOrders: Dispatch<SetStateAction<any[]>>,
    setOrderCount: Dispatch<SetStateAction<undefined>>,
    setNumberClick: Dispatch<SetStateAction<boolean>>,
) => {
    try {
        const response = await axioisInstance.get(`/merchant/orders?mobile=${number}&page_size=100`)

        const data = response.data.data

        setOrders(data.results)
        setOrderCount(data.count)
        setNumberClick(true)
    } catch (error) {
        console.error(error)
    }
}

export const handleDownload = async (
    dropdownStatus: DropdownStatus,
    deliveryType: DropdownStatus,
    paymentType: DropdownStatus,
    searchInput: string,
    from: string,
    To_Date: string,
    page: number,
    pageSize: number,
    currentSelectedPage: Record<string, string>,
) => {
    try {
        const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`

        const paymentStatus = paymentType?.value.length === 0 ? '' : `&payment_mode=${paymentType?.value}`
        const filterParameters = searchInput
            ? currentSelectedPage.value === 'invoice'
                ? `&invoice_id=${searchInput}`
                : currentSelectedPage?.value === 'mobile'
                  ? `&mobile=${searchInput}`
                  : ''
            : `&from=${from}&to=${To_Date}`

        const response = await axioisInstance.get(
            `merchant/orders?download=true?p=${page}&page_size=${pageSize}&delivery_type=EXCHANGE${filterParameters}${status}${paymentStatus}`,
            {
                responseType: 'blob',
            },
        )

        const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = urlToBeDownloaded
        link.download = 'OrderDetails.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Error downloading the file:', error)
    }
}
