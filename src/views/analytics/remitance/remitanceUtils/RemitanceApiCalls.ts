/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item, REMITANCE } from '@/store/types/remitance.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { s } from '@fullcalendar/core/internal-common'

interface RemitanceApiProps {
    brandValue: any
    from: string
    ToDate: string
    setRemitance: React.Dispatch<React.SetStateAction<Item[]>>
    setFullRemitanceResponse: React.Dispatch<React.SetStateAction<REMITANCE | undefined>>
    setAccessDenied: React.Dispatch<React.SetStateAction<boolean>>
    companyData?: string
    setIsDownloading?: React.Dispatch<React.SetStateAction<boolean>>
}

const RemitanceApis = ({
    brandValue,
    from,
    ToDate,
    setRemitance,
    setFullRemitanceResponse,
    setAccessDenied,
    companyData,
    setIsDownloading,
}: RemitanceApiProps) => {
    const fetchRemitanceApi = async () => {
        try {
            const brandData = brandValue ? `&brand=${brandValue?.name}` : ''
            const response = await axioisInstance.get(`/merchant/product/sales?from=${from}&to=${ToDate}${brandData}`)
            const remitanceData = response.data?.data.items
            setFullRemitanceResponse(response.data?.data)
            setRemitance(remitanceData)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error('Error fetching remitance:', error)
        }
    }
    const handleDownload = async () => {
        setIsDownloading && setIsDownloading(true)
        try {
            const brandData = brandValue ? `&brand=${brandValue?.name}` : ''
            const response = await axioisInstance.get(`/merchant/product/sales?from=${from}&to=${ToDate}${brandData}&download=true`, {
                responseType: 'blob',
            })

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${brandValue?.name || 'All-Brands'}-${from}-to-${ToDate}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading CSV:', error)
        } finally {
            setIsDownloading && setIsDownloading(false)
        }
    }

    const handleOrderItem = async () => {
        try {
            let companyId = ''
            if (companyData) {
                companyId = `&company_id=${companyData}`
            }
            const brandData = brandValue ? `&brand_name=${brandValue?.name}` : ''
            const response = await axioisInstance.get(
                `/merchant/order_items?download=true&download_type=finance&from=${from}&to=${ToDate}${brandData}${companyId}`,
                {
                    responseType: 'blob',
                },
            )

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${brandValue?.name || 'OrderItems'}-${from}-to-${ToDate}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading CSV:', error)
        }
    }

    const handleReturnOrderItem = async () => {
        try {
            let companyId = ''
            if (companyData) {
                companyId = `&company_id=${companyData}`
            }
            const brandData = brandValue ? `&brand_name=${brandValue?.name}` : ''
            const response = await axioisInstance.get(
                `/merchant/return_order_items?download=true&download_type=finance&from=${from}&to=${ToDate}${brandData}${companyId}`,
                {
                    responseType: 'blob',
                },
            )

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${brandValue?.name || 'ReturnOrderItems'}-${from}-to-${ToDate}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading CSV:', error)
        }
    }

    return {
        fetchRemitanceApi,
        handleDownload,
        handleOrderItem,
        handleReturnOrderItem,
    }
}

export default RemitanceApis
