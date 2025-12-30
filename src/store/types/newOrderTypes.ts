export interface StatusLog {
    status: string
    timestamp: string
}

export interface Rider {
    first_name: string
    last_name: string
    email: string
    mobile: string
    gender: string

    latitude: number
    longitude: number

    device_id: string
    checked_in_status: boolean
}

export interface Payment {
    amount: string
    mode: string
    status: string

    transaction_time: string
    gateway_transaction_id: string | null

    payment_link: string | null
    payment_link_id: string | null
    payment_qr_code: string | null
}

export interface Logistic {
    id: number
    reference_id: string
    partner: string
    state: string
    task_id: string

    is_delayed: boolean
    attempt_number: number

    latitude: number
    longitude: number

    runner_name: string
    runner_phone_number: string
    runner_profile_pic_url: string

    awb_code: string | null
    pickup_otp: string | null
    drop_otp: string | null

    actual_pickup_time: string | null
    actual_drop_time: string | null
    reached_at_location_time: string | null
    total_time: string | null

    tracking_url: string
    update_date: string

    log: StatusLog[]
}

export interface Order {
    id: number
    uuid: string
    order_id: string
    invoice_id: string
    cart_id: number

    status: string
    device_type: string
    delivery_type: string

    amount: string
    tax: string
    delivery: string
    coupon_discount: string
    loyalty_discount: string
    offer_discount: string
    points_discount: string
    other_charges: number

    create_date: string
    update_date: string
    completion_date: string | null

    billing_address: string
    address_name: string
    area: string
    city: string
    state: string
    pincode: string
    directions: string

    latitude: number
    longitude: number
    location_url: string

    distance: number | string
    eta_duration: number
    estimate_delivery_time: string
    eta_dropoff_time: string
    current_eta_dropoff: string

    is_gift_wrap: boolean
    is_returnable: boolean
    is_exchangeable: boolean
    is_internal_order: boolean
    is_split_order: boolean
    inventory_reversed: boolean
    is_synced_to_nosql: boolean

    order_items_count: number
    packets_count: number
    user_order_count: number

    coupon_code: string | null
    coupon_code_issued: string | null
    promotional_event: string | null
    original_order: string | null
    split_order_id: string | null

    payment: Payment
    logistic: Logistic
    rider: Rider
    store: {
        latitude: number
        longitude: number
        address: string
    }
    user: {
        name: string
        mobile: string
    }

    log: StatusLog[]
}

export type NewOrderResponseType = {
    status: string
    data: {
        count: number
        results: Order[]
    }
}
