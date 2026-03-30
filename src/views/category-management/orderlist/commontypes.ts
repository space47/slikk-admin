/* eslint-disable @typescript-eslint/no-explicit-any */

export type ORDER_ITEM_RATING = {
    rating: string
    review: string
}
export type OrderItem = {
    id?: number //You get it in order detail and not in order list
    name?: string
    image?: string
    final_price?: string
    quantity: number
    sp?: string //All below are in order detail only
    mrp?: string
    fulfilled_quantity?: string
    brand: string
    barcode: string
    is_returnable: boolean
    division?: string
    category?: string
    sub_category?: string
    product_type?: string
    size?: string
    color?: string
    order_item_rating: ORDER_ITEM_RATING | null
    create_date: string
}

export type ordercommon = {
    address_name: string

    amount: string
    area: string
    billing_address: string
    cart_id: null
    city: string
    coupon_code: string
    coupon_discount: string
    create_date: string
    delivery: string
    delivery_discount: number
    delivery_type: string
    directions: string
    flat: string
    invoice_id: string
    invoice_name: string
    is_returnable: boolean
    latitude: number
    log: []
    logistic: string
    logistic_partner: string
    longitude: number
    loyalty_discount: string
    manifest_url: string
    order_id: string

    payment_link_id: string
    pincode: string
    points_discount: string

    reference_return: string
    return_order: []
    shipping_label_url: string
    state: string
    status: string

    tax: string
    tracking_url: string
    update_date: string
    user: string
    uuid: string
    waybill_no: string
}

export interface Order {
    invoice_id: string
    create_date: string | Date
    user: {
        name: string
        mobile: string | number
    }
    store: {
        address: string
        latitude: string
        longitude: string
    }
    rating: number
    amount: number
    payment: {
        mode: string
        amount: number
        status?: string
    }
    order_items: OrderItem[]
    status: string
    update_date: string
    from: string
    to: string
    latitude: any
    longitude: any
    user_order_count: number
    order_items_count: number
    delivery_type: string
    distance: number
    picker?: {
        name?: string
    }

    area: string
    pincode: string
    logistic: {
        is_delayed: boolean

        estimate_delivery_time: string
        eta_dropoff_time: string
    }
}

export const ORDER_STATUS = [
    { name: 'PENDING', value: 'PENDING' },
    { name: 'ACCEPTED', value: 'ACCEPTED' },
    { name: 'PACKED', value: 'PACKED' },
    { name: 'READY TO SHIP', value: 'READY_TO_SHIP' },
    { name: 'MANIFESTED', value: 'MANIFESTED' },
    { name: 'DELIVERY_CREATED', value: 'DELIVERY_CREATED' },
    { name: 'SHIPPED', value: 'SHIPPED' },
    { name: 'DELIVERED', value: 'DELIVERED' },
    { name: 'RTO_DELIVERED', value: 'RTO_DELIVERED' },
    { name: 'CANCELLED', value: 'CANCELLED' },
    { name: 'COMPLETED', value: 'COMPLETED' },
    { name: 'CANCELLATION ON HOLD', value: 'CANCELLATION_ON_HOLD' },
    { name: 'DECLINED', value: 'DECLINED' },
]

export const RETURN_ORDERS = [
    { name: 'PICKUP CREATED', value: 'PICKUP_CREATED' },
    { name: 'PENDING', value: 'PENDING' },
    { name: 'CANCELLED', value: 'CANCELLED' },
    { name: 'APPROVED', value: 'APPROVED' },
    { name: 'ACCEPTED', value: 'ACCEPTED' },
    { name: 'REFUNDED', value: 'REFUNDED' },
    { name: 'SHIPPED', value: 'SHIPPED' },
    { name: 'OUT_FOR_DELIVERY', value: 'OUT_FOR_DELIVERY' },
    { name: 'COMPLETED', value: 'COMPLETED' },
]

export const DELEIVERYOPTIONS = [
    { label: 'Express', value: 'EXPRESS' },
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Try&Buy', value: 'TRY_AND_BUY' },
    { label: 'Exchange', value: 'EXCHANGE' },
]

export const PAYMENTOPTIONS = [
    { label: 'COD', value: 'COD' },
    { label: 'ONLINE', value: 'ONLINE' },
    { label: 'POD', value: 'POD' },
    { label: 'POD_CREATED', value: 'POD_CREATED' },
    { label: 'POD_PAID', value: 'POD_PAID' },
    { label: 'POD_COMPLETED', value: 'POD_COMPLETED' },
    { label: 'COMPLETED', value: 'COMPLETED' },
]

export const CHANGE_DELIVERY_OPTIONS = [
    { label: 'EXPRESS', value: 'EXPRESS' },
    { label: 'STANDARD', value: 'STANDARD' },
    { label: 'TRY_AND_BUY', value: 'TRY_AND_BUY' },
]

export const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]
export interface DropdownStatus {
    value: string[]
    name: string[]
}

export const SEARCHOPTIONS = [
    { label: 'INVOICE', value: 'invoice' },
    { label: 'MOBILE', value: 'mobile' },
]

export const SORT_OPTIONS = [{ label: 'CREATE DATE', value: 'create_date' }]
