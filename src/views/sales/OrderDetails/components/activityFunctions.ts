/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd'
import { Event } from './activityCommon'
import { Order } from '@/store/types/newOrderTypes'
import { EOrderButton, EOrderStatus, IOrderPack } from '../orderList.common'

export const getButtonAndModalContent = (data: Event[], mainData?: { delivery_type?: string }, delivery_type?: string) => {
    if (data.length === 0) {
        return { buttonText: EOrderButton.accept }
    }

    const lastLogStatus = data[data.length - 1]?.status || null
    const hasStatus = (status: string) => data.some((log) => log.status === status)
    const isPacked = hasStatus(EOrderStatus.packed)
    const isDeliveryCreated = hasStatus(EOrderStatus.delivery_created)
    const isOutForDelivery = hasStatus(EOrderStatus.out_for_delivery) || hasStatus(EOrderStatus.shipped)
    const isDriverAssigned = lastLogStatus === EOrderStatus.driver_assigned
    const isOrderDone = hasStatus(EOrderStatus.delivered) || hasStatus(EOrderStatus.completed)
    const isOrderCancelled = hasStatus(EOrderStatus.declined) || hasStatus(EOrderStatus.cancelled)
    const isShipped = hasStatus(EOrderStatus.shipped) || hasStatus(EOrderStatus.out_for_delivery)
    const isExchangeComplete = hasStatus(EOrderStatus.exchange_delivered)

    if (isDriverAssigned && isPacked && mainData?.delivery_type === EOrderButton.standard && !isOrderDone && !isOrderCancelled) {
        return { buttonText: EOrderButton.mark_as_shipped, modalContent: 'Mark as Shipped' }
    }
    if (lastLogStatus === EOrderStatus.rto_initiated && !isOrderDone && !isOrderCancelled) {
        return { buttonText: EOrderButton.out_for_delivery, modalContent: 'Out for Delivery' }
    }
    if (lastLogStatus === EOrderStatus.rto_delivered && !isOrderDone && !isOrderCancelled) {
        return { buttonText: EOrderButton.out_for_delivery, modalContent: 'Out for Delivery' }
    }
    if (isDriverAssigned && isPacked && mainData?.delivery_type !== EOrderButton.standard && !isOrderDone && !isOrderCancelled) {
        return { buttonText: EOrderButton.out_for_delivery, modalContent: 'Out for Delivery' }
    }
    if (isDeliveryCreated && !isPacked && !isOrderDone && !isOrderCancelled) {
        return { buttonText: EOrderButton.pick_reject, modalContent: 'Pick and Pack' }
    }
    if (isDeliveryCreated && isPacked && !isOutForDelivery && !isOrderDone && !isOrderCancelled) {
        const buttonText = mainData?.delivery_type === EOrderButton.standard ? EOrderButton.mark_as_shipped : EOrderButton.out_for_delivery
        return { buttonText, modalContent: buttonText.replace('MARK AS ', '') }
    }
    if (lastLogStatus === EOrderStatus.delivery_created || lastLogStatus === EOrderStatus.out_for_pickup) {
        const buttonText = mainData?.delivery_type === EOrderButton.standard ? EOrderButton.mark_as_shipped : EOrderButton.out_for_delivery
        return { buttonText, modalContent: buttonText.replace('MARK AS ', '') }
    }
    if (isOrderDone && delivery_type === EOrderStatus.exchange && !isExchangeComplete) {
        return { buttonText: EOrderButton.exchange_delivered, modalContent: 'Exchange Delivered' }
    }
    if (lastLogStatus === EOrderStatus.packed) {
        return { buttonText: EOrderButton.created_delivery }
    }
    if (lastLogStatus === EOrderStatus.accepted || lastLogStatus === EOrderStatus.picking) {
        return { buttonText: EOrderButton.pick_reject, modalContent: 'Pick and Pack' }
    }
    if (isShipped && !isOrderDone && !isOrderCancelled) {
        return { buttonText: EOrderButton.mark_as_delivered }
    }
    if (lastLogStatus === EOrderStatus.cancelled) {
        return { buttonText: '' }
    }

    return { buttonText: '', modalContent: '', secondaryButtonText: '', secondaryButtonContent: '' }
}

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
    selectedReasons,
}: {
    action: string
    data: any
    bagsCount?: string
    binNumber?: string
    selectedReasons: Record<number, string>
}) => ({
    action,
    data,
    ...(bagsCount ? { packets_count: Number(bagsCount) } : {}),
    ...(binNumber ? { bin_id: binNumber } : {}),
    return_reasons: selectedReasons,
})

export const usePackOrder = ({
    mainData,
    selectedLocations,
    fulfilledQuantities,
    status,
    bagsCount,
    setTriggerPackCall,
    selectedReasons,
}: IOrderPack) => {
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

        // if(Object.entries(selectedReasons).length){
        //     // validation here

        // }

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

        return { zeroQty, required, fulfilled, data, selectedReasons }
    }

    return { handlePack }
}
