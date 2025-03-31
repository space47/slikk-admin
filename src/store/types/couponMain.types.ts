export type CouponMainTypes = {
    code: string
    image: string
    user: {
        first_name: string
        last_name: string
        email: string
        mobile: string
        checked_in_status: boolean
    }[]
    coupon_series: {
        id: number
        discount_type: 'PERCENT_OFF' | 'FLAT_OFF' | string
        value: string
        image: string
        min_cart_value: string
        max_count: string
        maximum_discount: string
        valid_from: string
        valid_to: string
        description: string
        max_count_per_user: string
        frequency: string | null
        freq_config: Record<string, unknown>
        campaign: string
        coupon_type: 'COUPON' | 'VOUCHER' | string
        is_public: boolean
        extra_attributes: {
            new_users_only: boolean
            applicable_categories: string[]
        }
    }
    max_count: string
    maximum_price: string
    coupon_used_count: string
    create_date: string
    update_date: string
}

export type CouponResponseTypes = {
    status: string
    message: string
    data: {
        count: number
        results: CouponMainTypes[]
    }
}
