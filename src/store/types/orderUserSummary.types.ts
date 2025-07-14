/* eslint-disable @typescript-eslint/no-explicit-any */
type Order = {
    count: number
    total_amount: number
}

type CartItemVariant = {
    name: string
    variant_type: string
    value?: string
}

export type CartItem = {
    id?: number
    variants?: CartItemVariant[]
    barcode?: string
    brand?: string
    cart?: number
    category?: string
    color?: string | null
    coupon?: string | null
    coupon_discount?: string
    create_date?: string
    delivery_type?: string
    division?: string
    final_price?: string
    image?: string
    inventory_count?: number
    is_free_item?: boolean
    is_returnable?: string
    is_try_and_buy?: boolean
    loyalty_discount?: string
    loyalty_tier_discount?: string
    mrp?: string
    name?: string
    offer?: string
    offer_discount?: string
    points_discount?: string
    product?: number
    product_type?: string
    prorated_price?: string
    quantity?: string
    size?: string
    sku?: string
    sp?: string
    store?: number
    sub_category?: string
    update_date?: string
}

type Cart = {
    id: number
    other_charges_data?: any
    coupon_code: string | null
    coupon_discount: number
    create_date: string
    delivery: string
    delivery_discount: number
    address_name: string
    amount: string
    area: string
    billing_address: string
    delivery_type: string
    directions: string
    flat: string
    free_items: CartItem[]
    latitude: number
    longitude: number
    loyalty_tier_discount: number
    payment_link: string | null
    points_discount: string
    session_id: string | null
    tax: string
    update_date: string
    user: string
    cartItems: CartItem[]
}

type Profile = {
    first_name: string
    last_name: string
    email: string
    mobile: number
    country_code: string
    device_id: string
    dob: string
    gender: string
    image: string
}

export type ReferralEntry = {
    user: string | null
    status: string
    mobile: string
    earned: number
}

export type ReferralData = {
    referral_code: string
    referral_count: number
    referral_data: ReferralEntry[]
    total_earned: number
    total_pending: number
    total_redeemed: number
}

export type CustomerEventData = {
    event_code: string
    order: string
    other_conditions_accepted: boolean
    status: string
    terms_and_conditions_accepted: boolean
}

type Data = {
    orders: Order
    cart: Cart
    profile: Profile
    event: CustomerEventData[]
    referral: ReferralData
}

export type OrderSummaryTYPE = {
    customerData: Data | undefined
    loading: boolean
    message: string
    errorMessage?: string
}
