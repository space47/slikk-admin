import { Order } from '@/store/types/newOrderTypes'

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ShippingInfoProps = {
    data?: Order['logistic']
    rider: Record<string, string | number | any>
    logistic_partner: any
    delivery_type: string
    tnb_return_otp?: string
    setShowRiderModal: (x: boolean) => void
}

export const scheduleSlots: any = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}

export type CommonOrderProduct = Partial<{
    id: number
    barcode: string
    brand: string
    name: string
    color: string
    size: string
    product_type: string
    image: string
    sp: string | undefined | number
    quantity: string
    sub_category: string | undefined
    location: string
    mrp: string | undefined | number
    fulfilled_quantity: string
    final_price: number
    sku: string
    category: string | undefined
    is_gift_wrap: boolean
    llinfo?: string
    location_details: Record<string, string>
    packing_images: string
}>

export interface FulfilledQuantities {
    [key: number]: number
}

export interface SelectedLocations {
    [productId: number]: {
        [location: string]: number
    }
}

export interface LogisticPartner {
    value: string
    label: string
}

export const NOTIFICATION_DURATION = 3000
export const NAVIGATION_DELAY = 2000

export interface QuantityValidation {
    totalItemQuantity: number
    calculatedQuantity: number
    isValid: boolean
}

export interface LocationDetail {
    location: string
    quantity: number
    product?: {
        sku: string
    }
}

export interface IOrderPack {
    mainData: Order
    selectedLocations: Record<number, Record<string, number>>
    fulfilledQuantities: Record<number, number>
    status: string
    bagsCount: string
    setTriggerPackCall: (x: boolean) => void
}

export enum EOrderStatus {
    packed = 'PACKED',
    pending = 'PENDING',
    accepted = 'ACCEPTED',
    out_for_delivery = 'OUT_FOR_DELIVERY',
    picked_up = 'PICKED_UP',
    delivery_created = 'DELIVERY_CREATED',
    delivered = 'DELIVERED',
    completed = 'COMPLETED',
    cancelled = 'CANCELLED',
    declined = 'DECLINED',
    in_transit = 'IN_TRANSIT',
    shipped = 'SHIPPED',
    exchange_delivered = 'EXCHANGE_DELIVERED',
    add_item_packing = 'ADD_ITEM_PACKING_IMAGES',
    created_delivery = 'CREATED_DELIVERY',
    rto_delivered = 'RTO_DELIVERED',
    rto_initiated = 'RTO_INITIATED',
    picking = 'PICKING',
    paid = 'PAID',
    pod = 'POD',
    pod_paid = 'POD_PAID',
    pod_created = 'POD_CREATED',
    failed = 'FAILED',
    exchange = 'EXCHANGE',
    driver_assigned = 'DRIVER_ASSIGNED',
    out_for_pickup = 'OUT_FOR_PICKUP',
}

export enum EOrderButton {
    accept = 'ACCEPT',
    out_for_delivery = 'OUT FOR DELIVERY',
    standard = 'STANDARD',
    mark_as_shipped = 'MARK AS SHIPPED',
    mark_as_delivered = 'MARK AS DELIVERED',
    exchange_delivered = 'EXCHANGE DELIVERED',
    created_delivery = 'CREATE DELIVERY',
    pick_reject = 'PICK/REJECT',
}
