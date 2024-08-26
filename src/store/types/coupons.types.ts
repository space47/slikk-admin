import { createAction } from '@reduxjs/toolkit'

export interface COUPONDATA {
    code: string
    image: string | null
    type: string
    value: string
    min_cart_value: string
    max_count: string
    maximum_price: string
    valid_from: string
    valid_to: string
    description: string
    max_count_per_user: string
    coupon_used_count: string
    frequency: string | null
    // freq_config: string
    coupon_discount_type: string
    user: string
}

export interface COUPON_STATE {
    coupons: COUPONDATA[]
    couponsEdit: COUPONDATA | null
    globalFilter: string
    pageSize: number
    page: number
    loading: boolean
    message: string
}

export const getAllDivisionRequest = 'getAllDivisionRequest'
export const getAllDivisionSuccess = createAction<COUPON_STATE>(
    'getAllDivisionSuccess'
)
export const getAllDivisionFailure = createAction<COUPON_STATE>(
    'getAllDivisionFailure'
)
