/* eslint-disable @typescript-eslint/no-explicit-any */
type RETURNORDER = {
    amount: string
    create_date: string
    order: string
    return_order_delivery: any
    return_order_id: string
    return_order_items: any
    return_type: string
    status: string
    uuid: string
}

export type SalesOrderDetailsResponse = {
    amount: string
    original_order: string
    exchange_order_id: string[]
    invoice_id?: string
    progressStatus?: number
    payementStatus?: number
    create_date?: string
    dateTime?: number
    latitude: number
    longitude: number
    distance: number
    order_id: string
    payment?: {
        amount: number
        mode: string
        transaction_time: string
        status: string
        gateway_transaction_id: string
    }
    coupon_discount: string
    delivery: string
    delivery_discount: number
    delivery_type: string
    delivery_schedule_slot: number
    delivery_schedule_date: string
    tax: string | number
    address_name: string
    logistic?: {
        partner: string
        price: number
        create_date: number
        drop_time: number
        shippingLogo: string
        runner_name: string
        runner_phone_number: string
        runner_profile_pic_url: string
        state: string
        task_id: any
        tracking_url: string
        awb_code: any
    }
    rider: {
        mobile: string | number
    }
    logistic_partner: any
    order_items: {
        barcode: string
        brand: string
        name: string
        color: string
        size: string
        product_type: string
        image: string
        sp: number
        delivery_type?: string
        quantity: string
        location: string
        sub_category: string
        mrp: number
        fulfilled_quantity: string
        final_price: number
        sku: string
        id: number
        returnable_quantity: number
    }[]

    log: {
        timestamp: string
        status: string
    }[]
    user: {
        name: string
        mobile: string
    }
    store: {
        address: string
        latitude: number
        longitude: number
    }
    billing_address: string
    status: string
    loyalty_discount: string
    points_discount: string
    location_url: string
    return_order: RETURNORDER[]
    tracking_url: string
    utm_params: any
    other_charges_data?: any
    reference_return?: string | number | undefined
}

export type ShippingInfoProps = {
    data?: {
        price: number
        create_date: number
        drop_time: number
        shippingLogo: string

        runner_name: string
        runner_phone_number: string
        runner_profile_pic_url: string
        state: string
        tracking_url: string
        awb_code: any
        task_id: any
    }
    rider: Record<string, string | number | any>
    logistic_partner: any
    delivery_type: string
    setShowRiderModal: (x: boolean) => void
}

export const scheduleSlots: any = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}
