import { RTLActions } from '@/views/sales/returnItems/returnItemsUtils/returnItemcommons'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type LocationReturnType = {
    latitude: string
    longitude: string
    amount: string
    status: string
    return_order_id: string
    rider: {
        name: string
        mobile: string
    }
}

export interface ReturnOrderResponse {
    data: ReturnOrder
    status: string
}

// Main types
export interface ReturnOrder {
    amount: string
    bin_id: string | null
    create_date: string
    delivery: string
    exchange_order: any | null
    id: number
    is_synced_to_logistic: boolean
    log: StatusLog[]
    logistic_partner: string | null
    order: Order
    waybill_no: string | null
    packet_ids: string[]
    pickup_schedule_date: string | null
    pickup_schedule_slot: number
    reschedule_count: number
    return_delivery_created: boolean
    return_invoice_id: string
    return_order_delivery: ReturnOrderDelivery[]
    return_order_id: string
    return_order_items: ReturnOrderItem[]
    return_type: string
    status: string
    tracking_url: string | null
    update_date: string
    user: User
    user_account_details: {
        account_details: {
            account_number: string
            beneficiary_name: string
            ifsc_code: string
        }
        upi: string
    }
}

// Status log types
export interface StatusLog {
    status: string
    timestamp: string
    RIDER?: string
}

// Order types
export interface Order {
    amount: string
    create_date: string
    delivery: string
    delivery_type: string
    invoice: string
    invoice_id: string
    order_id: string
    rating: number | null
    store: Store
    user: User
}

export interface Store {
    id: number
    code: string
    name: string
    is_fulfillment_center: boolean
    // Add other store properties as needed
}

// Return order delivery types
export interface ReturnOrderDelivery {
    id?: number
    partner?: string
    reference_id?: string
    state?: string
    task_id?: string
    actual_drop_time?: string | null
    actual_pickup_time?: string | null
    attempt_number?: number
    awb_code?: string
    cancelled_by?: string | null
    create_date?: string
    current_eta_dropoff?: string | null
    current_location?: string | null
    distance?: string
    drop_otp?: string | null
    estimate_delivery_time?: string | null
    eta_dropoff_time?: string | null
    eta_pickup?: string
    is_delayed?: boolean
    latitude?: number
    log?: DeliveryLog[]
    longitude?: number
    order_item?: any | null
    pickup_otp?: string | null
    price?: string | number | null
    prorated_price?: string
    quantity?: string
    reached_at_location_time?: string | null
    return_order?: number
    return_reason?: string | null
    runner_name?: string
    runner_phone_number?: string
    runner_profile_pic_url?: string
    total_time?: string
    tracking_url?: string
    update_date?: string
}

export interface DeliveryLog {
    RIDER?: string
    status: string
    timestamp: string
}

// Return order item types
export interface ReturnOrderItem {
    order_item: number
    return_amount: number
    quantity: string
    return_reason: string
    create_date: string
    location: string
    product: Product
    update_date: string
}

export interface Product {
    brand: string
    color: string
    image: string
    mrp: number
    name: string
    size: string
    sku: string
    sp: number
}

// User types
export interface User {
    first_name: string
    last_name: string
    email: string
    checked_in_status: boolean
    device_id: string
    gender: string
    latitude: number
    longitude: number
    mobile: string
    user_account_details: UserAccountDetails
    uuid: string
}

export interface UserAccountDetails {
    upi: string
    account_details: AccountDetails
}

export interface AccountDetails {
    ifsc_code: string
    account_number: string
    beneficiary_name: string
}

export interface ReturnLocationRequestData {
    action?: RTLActions.ADD | RTLActions.REMOVE | RTLActions.MOVE
    sku?: string
    quantity?: number
    location?: string
    id?: number | string
    return_item_id?: string
    from_status?: string
    to_status?: string
}

export interface RTLData {
    sku: string
    quantity: number
    location: string
}

export interface ReturnToLocationResponse {
    status: string
    message: string
    data: RTLData
}

export interface ReturnData {
    id: number
    return_order_item: string
    quantity: number
    qc_passed: number
    qc_failed: number
    refurbished: number
    synced_quantity: number
    product_images?: string
    inventory_sync_error: []
    last_updated_by: Record<string, string>
    sku: string
    create_date: string
    update_date: string
}

export interface ReturnManagementResponse {
    status: string
    data: {
        count: number
        results: ReturnData[]
    }
}

export type ReturnItemConfigurationResponse = {
    config: ReturnItemConfiguration
}
export type ReturnItemConfiguration = {
    id: number
    name: string
    value: ReturnItemConfigurationValue
    is_active: boolean
    previous_configurations: unknown[]
    create_date: string
    update_date: string
    last_updated_by: string
}

export type ReturnItemConfigurationValue = {
    reasons: string[]
}
