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
}

export interface ReturnOrderState {
    returnOrders: ReturnOrder | null
    loading: boolean
    message: string
}

export const getAllReturnOrdersRequest = 'getAllReturnOrdersRequest'
export const getAllReturnOrdersSuccess = createAction<ReturnOrderState>(
    'getAllReturnOrdersSuccess',
)
export const getAllReturnOrdersFailure = createAction<ReturnOrderState>(
    'getAllReturnOrdersFailure',
)
