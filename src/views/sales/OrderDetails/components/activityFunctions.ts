/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd'
import { Event } from './activityCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

export const getButtonAndModalContent = (data: Event[], mainData?: { delivery_type?: string }, delivery_type?: string) => {
    if (data.length === 0) {
        return { buttonText: 'ACCEPT' }
    }

    const lastLogStatus = data[data.length - 1]?.status || null
    const hasStatus = (status: string) => data.some((log) => log.status === status)
    const isPacked = hasStatus('PACKED')
    const isDeliveryCreated = hasStatus('DELIVERY_CREATED')
    const isOutForDelivery = hasStatus('OUT_FOR_DELIVERY') || hasStatus('SHIPPED')
    const isDriverAssigned = lastLogStatus === 'DRIVER_ASSIGNED'
    const isOrderDone = hasStatus('DELIVERED') || hasStatus('COMPLETED')
    const isOrderCancelled = hasStatus('DECLINED') || hasStatus('CANCELLED')
    const isShipped = hasStatus('SHIPPED') || hasStatus('OUT_FOR_DELIVERY')
    const isExchangeComplete = hasStatus('EXCHANGE_DELIVERED')

    console.log('mainData?.delivery_type', delivery_type)

    if (isDriverAssigned && isPacked && mainData?.delivery_type === 'STANDARD' && !isOrderDone && !isOrderCancelled) {
        return { buttonText: 'MARK AS SHIPPED', modalContent: 'Mark as Shipped' }
    }
    if (lastLogStatus === 'RTO_INITIATED' && !isOrderDone && !isOrderCancelled) {
        return {
            buttonText: 'OUT FOR DELIVERY',
            // secondaryButtonText: 'CANCEL',
            modalContent: 'Out for Delivery',
            // secondaryButtonContent: 'Cancel',
        }
    }
    if (lastLogStatus === 'RTO_DELIVERED' && !isOrderDone && !isOrderCancelled) {
        return {
            buttonText: '',
            // secondaryButtonText: 'CANCEL',
            modalContent: '',
            // secondaryButtonContent: 'Cancel',
        }
    }
    if (isDriverAssigned && isPacked && mainData?.delivery_type !== 'STANDARD' && !isOrderDone && !isOrderCancelled) {
        return { buttonText: 'OUT FOR DELIVERY', modalContent: 'Out for Delivery' }
    }
    if (isDeliveryCreated && !isPacked && !isOrderDone && !isOrderCancelled) {
        return { buttonText: 'PACK/REJECT', modalContent: 'Pick and Pack' }
    }
    if (isDeliveryCreated && isPacked && !isOutForDelivery && !isOrderDone && !isOrderCancelled) {
        const buttonText = mainData?.delivery_type === 'STANDARD' ? 'MARK AS SHIPPED' : 'OUT FOR DELIVERY'
        return { buttonText, modalContent: buttonText.replace('MARK AS ', '') }
    }
    if (lastLogStatus === 'DELIVERY_CREATED' || lastLogStatus === 'OUT_FOR_PICKUP') {
        const buttonText = mainData?.delivery_type === 'STANDARD' ? 'MARK AS SHIPPED' : 'OUT FOR DELIVERY'
        return { buttonText, modalContent: buttonText.replace('MARK AS ', '') }
    }
    if (isOrderDone && delivery_type === 'EXCHANGE' && !isExchangeComplete) {
        return { buttonText: 'EXCHANGE DELIVERED', modalContent: 'Exchange Delivered' }
    }
    if (lastLogStatus === 'PACKED') {
        return { buttonText: 'CREATE DELIVERY' }
    }
    if (lastLogStatus === 'ACCEPTED') {
        return { buttonText: 'PACK/REJECT', modalContent: 'Pick and Pack' }
    }
    if (isShipped && !isOrderDone && !isOrderCancelled) {
        return { buttonText: 'MARK AS DELIVERED' }
    }
    if (lastLogStatus === 'CANCELLED') {
        return { buttonText: '' }
    }

    return { buttonText: '', modalContent: '', secondaryButtonText: '', secondaryButtonContent: '' }
}

export const particularApiCall = async (
    action: string,
    invoice_id: string | undefined,
    partnerValue: string | undefined,
    navigate: any,
    isDelivery: boolean = true,
    binNumber?: string,
) => {
    try {
        const body = isDelivery ? { action, delivery_partner: partnerValue, bin_number: binNumber } : { action }
        if (isDelivery && !partnerValue) {
            notification.error({
                message: 'Select Partner to continue',
            })
            return
        }
        const response = await axioisInstance.patch(`merchant/order/${invoice_id}`, body)

        notification.success({
            message: 'Success',
            description: response?.data?.message || 'Order status updated successfully.',
        })
        navigate(0)
    } catch (error: any) {
        console.error(error)
        const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'
        notification.error({
            message: 'Error',
            description: errorMessage,
        })
    }
}
