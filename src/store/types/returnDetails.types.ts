/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction } from '@reduxjs/toolkit'

// src/features/returnOrders/returnOrderTypes.ts

export interface ReturnOrderProduct {
    name: string
    sku: string
    brand: string
    sp: number
    mrp: number
    image: string
}

export interface ReturnOrderItem {
    order_item: number
    return_amount: string
    quantity: string
    return_reason: string
    product: ReturnOrderProduct
    create_date: string
}

export interface ReturnOrderUser {
    first_name: string
    last_name: string
    email: string
    mobile: string
}

export interface ReturnOrderStore {
    id: number
    code: string
    name: string
    is_fulfillment_center: boolean
}

export type Logistic = {
    id: number
    partner: string
    reference_id: string
    state: string
    task_id: string
    distance: string
    eta_pickup: string
    eta_dropoff: string
    runner_name: string
    runner_phone_number: string
    runner_profile_pic_url: string
    latitude: number
    longitude: number
    cancelled_by: string | null
    price: number | null
    total_time: number | null
    tracking_url: string
    pickup_time: string | null
    drop_time: string | null
    pickup_otp: string | null
    drop_otp: string | null
    awb_code: string | null
    attempt_number: number
    create_date: string
    update_date: string
    cancellation_reason: string | null
    order: number
}

export interface ReturnOrder {
    id: number
    return_order_items: ReturnOrderItem[]
    return_order_delivery: any[]
    order: {
        order_id: string
        invoice_id: string
        create_date: string
        delivery_type: string
        invoice: any
        waybill_no: any
        rating: number
        amount: string
        delivery: string
        user: ReturnOrderUser
        store: ReturnOrderStore
    }
    user: ReturnOrderUser
    amount: string
    delivery: string
    uuid: string
    return_order_id: string
    status: string
    is_synced_to_logistic: boolean
    return_invoice_id: string
    return_pickup_date: string | null
    return_delivery_created: boolean
    waybill_no: string | null
    tracking_url: string | null
    logistic_partner: string | null
    log: any[]
    return_type: string
    create_date: string
    update_date: string
    logistic: Logistic
    pickup_schedule_date: string
    pickup_schedule_slot: number
    user_account_details: {
        account_details: {
            account_number: string
            beneficiary_name: string
            ifsc_code: string
        }
        upi: string
    }
}

export interface ReturnOrderState {
    returnOrders: ReturnOrder | null
    loading: boolean
    message: string
}

export const getAllReturnOrdersRequest = 'getAllReturnOrdersRequest'
export const getAllReturnOrdersSuccess = createAction<ReturnOrderState>('getAllReturnOrdersSuccess')
export const getAllReturnOrdersFailure = createAction<ReturnOrderState>('getAllReturnOrdersFailure')
