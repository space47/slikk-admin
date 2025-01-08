import { createAction } from '@reduxjs/toolkit'

interface extra_attributes {
    delivery_free: string
    max_order_count: number
    min_order_count: number
}

export interface COUPONDATA {
    code: string
    imageArray: File[]
    image: string | null
    type: string
    value: number | null
    min_cart_value: number | null
    max_count: number | null
    maximum_price: number | null
    valid_from: string
    valid_to: string
    description: string
    max_count_per_user: number | null
    coupon_used_count: number | null
    frequency: number | null
    user_add_action: string
    // freq_config: string
    coupon_discount_type: string | null
    extra_attributes: extra_attributes
    is_public: boolean
    user: any[]
}

export interface COUPON_STATE {
    coupons: COUPONDATA[]
    couponsEdit: COUPONDATA | null
    globalFilter: string
    pageSize: number
    page: number
    loading: boolean
    message: string
    accessDenied: boolean
}

export const getAllDivisionRequest = 'getAllDivisionRequest'
export const getAllDivisionSuccess = createAction<COUPON_STATE>('getAllDivisionSuccess')
export const getAllDivisionFailure = createAction<COUPON_STATE>('getAllDivisionFailure')
