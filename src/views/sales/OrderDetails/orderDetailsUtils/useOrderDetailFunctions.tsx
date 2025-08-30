import { commonDownload } from '@/common/commonDownload'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SalesOrderDetailsResponse } from '../orderList.common'

interface Props {
    data: SalesOrderDetailsResponse | undefined
    setShowCancelExchangeModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const useOrderDetailFunctions = ({ data, setShowCancelExchangeModal }: Props) => {
    const navigate = useNavigate()
    const { invoice_id } = useParams()

    const handlemarkAsPaid = async () => {
        try {
            const response = await axioisInstance.post(`/user/order/${invoice_id}/payment/status`)
            notification.success({ message: response.data.message || 'Successfully markded as Paid' })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePODAction = async () => {
        try {
            const body = { action: 'MARK_POD_COMPLETE' }
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({ message: response.data.message || 'POD COMPLETED SUCCESSFULLY' })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDownload = async () => {
        try {
            const response = await axioisInstance.get(`/user/order/invoice/${invoice_id}`)
            commonDownload(response, `invoice-${invoice_id}.pdf`)
        } catch (error) {
            console.log(error)
        }
    }

    const handleConvert = async () => {
        const body = { action: 'EXCHANGE_TO_RETURN' }
        try {
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({ message: response?.data?.message || 'Successfully converted' })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || error?.message || 'Failed to convert' })
            }
        } finally {
            setShowCancelExchangeModal(false)
        }
    }
    const handleMarketingOrder = async () => {
        const body = { action: 'MARK_INTERNAL_ORDER', is_internal_order: !data?.is_internal_order }
        try {
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({ message: response?.data?.message || 'Marketing order status updated' })
            navigate(0)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.response?.data?.message || error?.message || 'Failed to update marketing order status',
                })
            }
        }
    }

    return { handlemarkAsPaid, handlePODAction, handleDownload, handleConvert, handleMarketingOrder }
}
