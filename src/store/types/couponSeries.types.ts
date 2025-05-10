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
    extra_attributes: {
        new_users_only?: boolean
        applicable_categories?: string[]
        filters?: Record<string, string | number>
        min_filters_products_amount?: number
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
    // frequency?: "MONTHLY" | "WEEKLY" | "DAILY"; // Uncomment if needed
    // freq_config?: { interval: number; unit: "month" | "week" | "day" }; // Uncomment if needed
    campaign?: string
    coupon_type?: string
    is_public?: boolean
    extra_attributes?: {
        applicable_categories?: string[]
        new_users_only?: boolean
        filters?: Record<string, string | number>
        min_filters_products_amount?: number
    }
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
