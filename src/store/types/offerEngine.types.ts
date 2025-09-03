type DailyTimeWindow = {
    start: string
    end: string
}

export type OfferDataTypes = {
    id: number
    store_id: number
    slab_id: number
    offer_name: string
    discount_type: 'PERCENTAGE' | 'FLAT' | string // extend if you have fixed values
    discount_value: number
    min_purchase_amount: number
    max_discount_amount: number
    start_date: string // ISO Date string
    end_date: string // ISO Date string
    is_active: boolean
    created_at: string
    updated_at: string
    min_order_quantity: number | null
    max_order_quantity: number | null
    is_multi_unit_eligible: boolean
    set_size: number
    max_sets: number
    buy_quantity: number
    buy_filter_id: number
    get_quantity: number
    get_filter_id: number
    get_reward_type: 'FREE' | 'DISCOUNT' | string // extend if more enums
    get_reward_value: number
    daily_time_windows: DailyTimeWindow[]
}

export interface OfferGetData {
    id: number
    store_id: number
    slab_id: number
    offer_name: string
    offer_scope: string // could be union if limited values, e.g. "USER" | "STORE"
    discount_type: string // e.g. "FLAT" | "PERCENTAGE"
    discount_value: number
    min_purchase_amount: number
    max_discount_amount: number
    start_date: string // ISO datetime
    end_date: string // ISO datetime
    is_active: boolean
    created_at: string // ISO datetime
    updated_at: string // ISO datetime
    min_order_quantity: number
    max_order_quantity: number
    is_multi_unit_eligible: boolean
    set_size: number
    max_sets: number
    buy_quantity: number
    buy_filter_id: number
    get_quantity: number
    get_filter_id: number
    get_reward_type: string // e.g. "FREE"
    get_reward_value: number
    daily_time_windows: DailyTimeWindow[]
}

export interface OfferResponse {
    body: {
        data: {
            offers: OfferGetData[]
            total: number
        }
        message: string
        success: boolean
    }
    httpStatus: number
}
export interface OfferDetailResponse {
    body: {
        data: OfferGetData
        message: string
        success: boolean
    }
    httpStatus: number
}
