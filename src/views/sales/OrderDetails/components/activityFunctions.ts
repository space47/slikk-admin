/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd'
import { Event } from './activityCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Order } from '@/store/types/newOrderTypes'
import { IOrderPack } from '../orderList.common'

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
    if (lastLogStatus === 'ACCEPTED' || lastLogStatus === 'PICKING') {
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

// utils/packOrder.helpers.ts

export const getItemsWithAndWithoutLocation = (orderItems: Order['order_items']) => {
    const withLocation = orderItems?.filter(
        (item) =>
            item.location_details && Object.values(item.location_details).reduce((sum, qty) => sum + qty, 0) >= parseInt(item.quantity),
    )

    const withoutLocation = orderItems?.filter(
        (item) =>
            !item.location_details || Object.values(item.location_details).reduce((sum, qty) => sum + qty, 0) < parseInt(item.quantity),
    )

    return { withLocation, withoutLocation }
}

export const buildLocationData = (selectedLocations: Record<number | any, Record<string, number | string>>) => {
    return Object.entries(selectedLocations).reduce(
        (acc, [productId, locations]: any) => {
            Object.entries(locations).forEach(([location, count]) => {
                acc[productId] = acc[productId] || {}
                acc[productId][location as any] = count as number
            })
            return acc
        },
        {} as Record<number, Record<string, number>>,
    )
}

export const buildQuantityData = (fulfilledQuantities: any) => {
    return Object.entries(fulfilledQuantities).reduce(
        (acc, [id, quantity]: any) => {
            if (quantity > 0) acc[id as any] = quantity
            return acc
        },
        {} as Record<number, number>,
    )
}

export const hasZeroQuantity = (
    selectedLocations: { [productId: number]: { [location: string]: number } },
    fulfilledQuantities: { [key: number]: number },
) => {
    return (
        Object.values(selectedLocations).some((locations: any) => Object.values(locations)?.some((count: any) => count === 0)) ||
        Object.values(fulfilledQuantities).some((qty: any) => qty === 0)
    )
}

export const getTotalQuantities = (
    orderItems: Order['order_items'],
    selectedLocations: Record<number, Record<string, number>>,
    fulfilledQuantities: Record<number, number>,
) => {
    const required = orderItems?.reduce((sum, item) => sum + Number(item?.quantity || 0), 0) ?? 0

    const selectedLocationsTotal = Object.values(selectedLocations)
        .flatMap((locs) => Object.values(locs))
        .reduce((sum, curr) => sum + curr, 0)

    const fulfilledQuantitiesTotal = Object.values(fulfilledQuantities).reduce((sum, q) => sum + q, 0)

    const fulfilled = selectedLocationsTotal + fulfilledQuantitiesTotal

    return { required, fulfilled }
}

export const buildPackOrderPayload = ({
    action,
    data,
    bagsCount,
    binNumber,
}: {
    action: string
    data: any
    bagsCount?: string
    binNumber?: string
}) => ({
    action,
    data,
    ...(bagsCount ? { packets_count: Number(bagsCount) } : {}),
    ...(binNumber ? { bin_id: binNumber } : {}),
})

export const usePackOrder = ({ mainData, selectedLocations, fulfilledQuantities, status, bagsCount, setTriggerPackCall }: IOrderPack) => {
    const handlePack = () => {
        if (status === 'ACCEPTED' && !bagsCount) {
            notification.error({ message: 'Number of bags Required' })
            setTriggerPackCall(false)
            return null
        }

        const { withLocation, withoutLocation } = getItemsWithAndWithoutLocation(mainData?.order_items)

        const data: any = {}

        if (withLocation?.length) {
            Object.assign(data, buildLocationData(selectedLocations))
        }

        if (withoutLocation?.length) {
            Object.assign(data, buildQuantityData(fulfilledQuantities))
        }

        if (!Object.keys(data).length) {
            notification.warning({
                message: 'Please select at least one item with a valid quantity to proceed.',
            })
            setTriggerPackCall(false)
            return null
        }

        const zeroQty = hasZeroQuantity(selectedLocations, fulfilledQuantities)

        const { required, fulfilled } = getTotalQuantities(mainData?.order_items, selectedLocations, fulfilledQuantities)

        return {
            zeroQty,
            required,
            fulfilled,
            data,
        }
    }

    return { handlePack }
}
