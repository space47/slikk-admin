type Logistic = {
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
    price: string | null
    total_time: string | null
    tracking_url: string
    pickup_time: string | null
    drop_time: string | null
    pickup_otp: string | null
    drop_otp: string | null
    attempt_number: number
    create_date: string
    update_date: string
    cancellation_reason: string | null
    order: number
}

type Payment = {
    amount: string
    transaction_time: string
    gateway_transaction_id: string
    mode: string
}

type ReturnOrderItem = {
    order_item: number
    return_amount: string
    quantity: string
    return_reason: string
    create_date: string
    update_date: string
}

type ReturnOrderDelivery = {
    id: number
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
    price: string | null
    total_time: string | null
    tracking_url: string
    pickup_time: string | null
    drop_time: string | null
    pickup_otp: string | null
    drop_otp: string | null
    attempt_number: number
    create_date: string
    update_date: string
    return_reason: string | null
    quantity: string
    prorated_price: string
    current_location: string | null
    partner: number
    order_item: number | null
    return_order: number
}

type ReturnOrder = {
    amount: string
    uuid: string
    return_order_id: string
    status: string
    return_type: string
    create_date: string
    return_order_items: ReturnOrderItem[]
    return_order_delivery: ReturnOrderDelivery[]
    order: string
}

type OrderItem = {
    id: number
    name: string
    image: string
    final_price: string
    quantity: string
    sp: string
    mrp: string
    fulfilled_quantity: string
    brand: string
    barcode: string
    sku: string
    is_returnable: boolean
    division: string
    category: string
    sub_category: string
    product_type: string
    size: string
    color: string | null
    order_item_rating: string | null
    returnable_quantity: number
    create_date: string
}

type Store = {
    latitude: number
    longitude: number
    address: string
}

type User = {
    name: string
    mobile: string
}

type Log = {
    status: string
    timestamp: string
}

export type Order = {
    id: number
    logistic: Logistic
    payment: Payment
    return_order: ReturnOrder[]
    order_items: OrderItem[]
    store: Store
    is_returnable: boolean
    user: User
    flat: string
    area: string
    directions: string
    address_name: string
    billing_address: string
    latitude: number
    longitude: number
    amount: string
    delivery: string
    tax: string
    status: string
    uuid: string
    order_id: string
    invoice_id: string
    city: string
    state: string
    pincode: string
    create_date: string
    update_date: string
    coupon_code: string | null
    coupon_discount: string
    points_discount: string
    loyalty_discount: string
    rating: string | null
    waybill_no: string | null
    tracking_url: string | null
    manifest_url: string | null
    shipping_label_url: string | null
    log: Log[]
    invoice_name: string | null
    logistic_partner: string | null
    delivery_discount: number
    payment_link: string | null
    payment_link_id: string | null
    delivery_type: string
    invoice: string | null
    cart_id: number
    reference_return: string | null
}

export interface DropdownStatus {
    value: string
    name: string
}

export interface OPTIONType {
    label: string
    value: string
}

export interface OrderState {
    orders: Order[]
    loading: boolean
    message: string
    orderCount: number
    dropdownStatus: DropdownStatus[]
    searchInput: string
    currentSelectedPage: any
    deliveryType: OPTIONType
    paymentType: OPTIONType
    pageSize: number
    page: number
    from: string
    to: string
}
