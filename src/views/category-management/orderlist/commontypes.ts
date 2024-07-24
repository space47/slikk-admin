export type ORDER_ITEM_RATING = {
    rating: string
    review: string
}
export type OrderItem = {
    id?: number //You get it in order detail and not in order list
    name?: string
    image?: string
    final_price?: string
    quantity: number
    sp?: string //All below are in order detail only
    mrp?: string
    fulfilled_quantity?: string
    brand: string
    barcode: string
    is_returnable: boolean
    division?: string
    category?: string
    sub_category?: string
    product_type?: string
    size?: string
    color?: string
    order_item_rating: ORDER_ITEM_RATING | null
}

export type ordercommon = {
    address_name: string

    amount: string
    area: string
    billing_address: string
    cart_id: null
    city: string
    coupon_code: string
    coupon_discount: string
    create_date: string
    delivery: string
    delivery_discount: number
    delivery_type: string
    directions: string
    flat: string
    invoice_id: string
    invoice_name: string
    is_returnable: boolean
    latitude: number
    log: []
    logistic: string
    logistic_partner: string
    longitude: number
    loyalty_discount: string
    manifest_url: string
    order_id: string

    payment_link_id: string
    pincode: string
    points_discount: string

    reference_return: string
    return_order: []
    shipping_label_url: string
    state: string
    status: string

    tax: string
    tracking_url: string
    update_date: string
    user: string
    uuid: string
    waybill_no: string
}
