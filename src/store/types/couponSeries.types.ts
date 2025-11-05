/* eslint-disable @typescript-eslint/no-explicit-any */
export type CouponResults = {
    id?: number
    discount_type?: string
    value: number
    image: string
    min_cart_value: number
    max_count: number
    maximum_discount: number
    valid_from: string
    valid_to: string
    description: string
    max_count_per_user: number
    frequency: null
    freq_config: null
    campaign: string
    coupon_type: string
    is_public: boolean
    event_name?: string
    coupon_active_event_name?: string
    max_coupons_per_user?: number
    series_type?: string
    store_id?: string
    extra_attributes: {
        new_users_only?: boolean
        applicable_categories?: string[]
        filters?: Record<string, string | number>
        min_filters_products_amount?: number
        filter_id_exclude?: string
        min_item_quantity?: number
        max_item_quantity?: number
    }
}

export type CouponSeriesTypes = {
    status: string
    data: {
        count: number
        results: CouponResults[]
    }
}

export type CouponSeriesBodyType = {
    discount_type?: string
    value?: number
    image?: string
    min_cart_value?: number
    max_count?: number
    maximum_discount?: number
    valid_from?: string // ISO date string
    valid_to?: string // ISO date string
    description?: string
    max_count_per_user?: number
    max_coupons_per_user?: number
    series_type?: string
    campaign?: string
    coupon_type?: string
    is_public?: boolean
    event_name?: string
    coupon_active_event_name?: string
    store_id?: string
    extra_attributes?: any
}

export type CouponGenerateBodyType = {
    id?: string
    auto_generate?: boolean
    mobiles?: string
    prefix?: string
    unique_user_code?: string
    code_length?: number
    code_text_type?: string
    coupons_count?: number
    code?: string
    series_diff?: string
    is_random?: boolean
    coupon_series?: string
    auto_generate_code?: boolean
    users?: string
    length?: number
    auto_generate_type?: string
    coupon_code_name?: string
    numeric_type?: string
    docsArray?: File[]
}
