/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction } from 'react'
import { ReturnDropdownStatus, SEARCHOPTIONS } from '../returnOrderCommon'
import { getStatusFilterReturn } from './ReturnOrderUtils'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

export const handleSelect = (value: any, setCurrentSelectedPage: (value: SetStateAction<Record<string, string>>) => void) => {
    const selected = SEARCHOPTIONS.find((item) => item.value === value)
    if (selected) {
        setCurrentSelectedPage(selected)
    }
}
export const handleSearch = (e: React.ChangeEvent<HTMLInputElement>, setSearchOnEnter: React.Dispatch<React.SetStateAction<string>>) => {
    setSearchOnEnter(e.target.value)
}

export const handleSearchWithIcon = (setSearchOnEnter: React.Dispatch<React.SetStateAction<string>>, searchInput: string) => {
    setSearchOnEnter(searchInput)
}

export const onSelectChange = (
    value: number | undefined,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setPageSize: React.Dispatch<React.SetStateAction<number>>,
) => {
    setPage(1)
    setPageSize(Number(value))
}

export const handleDownload = async (
    tabSelect: string,
    dropdownStatus: any,
    deliveryType: ReturnDropdownStatus,
    currentSelectedPage: Record<string, string>,
    searchInput: string,
    from: string,
    To_Date: string,
    setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    setIsDownloading(true)
    notification.info({
        message: 'Download in process',
    })
    try {
        let status = getStatusFilterReturn(tabSelect)

        if (dropdownStatus?.value?.length) {
            status = `&status=${dropdownStatus.value}`
        }
        const deliveryStatus = deliveryType?.value?.length ? `&return_type=${deliveryType.value}` : ''
        const searchWiseDownload = searchInput ? `&${currentSelectedPage.value}=${searchInput.toUpperCase()}` : ''
        const response = await axioisInstance.get(
            `merchant/return_orders?download=true${searchWiseDownload}${status}&from=${from}&to=${To_Date}${deliveryStatus}`,
            {
                responseType: 'blob',
            },
        )
        const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = urlToBeDownloaded
        link.download = 'ReturnOrders.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        notification.success({
            message: 'SUCCESS',
            description: 'File successfully downloaded',
        })
    } catch (error) {
        console.error('Error downloading the file:', error)
    } finally {
        setIsDownloading(false)
    }
}
