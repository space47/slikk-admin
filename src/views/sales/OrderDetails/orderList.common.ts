type RETURNORDER = {
    amount: string
    create_date: string
    order: string
    return_order_delivery: any
    return_order_id: string
    return_order_items: any
    return_type: string
    status: string
    uuid: string
}

export type SalesOrderDetailsResponse = {
    amount: string
    invoice_id?: string
    progressStatus?: number
    payementStatus?: number
    create_date?: string
    dateTime?: number
    payment?: {
        amount: number
        mode: string
        transaction_time: string
        status: string
    }
    coupon_discount: string
    delivery: string
    delivery_discount: number
    delivery_type: string
    tax: string | number
    address_name: string
    logistic?: {
        partner: number
        price: number
        create_date: number
        drop_time: number
        shippingLogo: string
        runner_name: string
        runner_phone_number: string
        runner_profile_pic_url: string
        state: string
    }

    logistic_partner: any
    order_items?: {
        barcode: string
        brand: string
        name: string
        color: string
        size: string
        product_type: string
        image: string
        sp: number
        quantity: string
        location: string
        sub_category: string
        mrp: number
        fulfilled_quantity: string
        final_price: number
        sku: string
        id: number
        returnable_quantity: number
    }[]

    log: {
        timestamp: string
        status: string
    }[]
    user: {
        name: string
        mobile: string
    }
    store: {
        address: string
        latitude: number
        longitude: number
    }
    billing_address: string
    status: string
    loyalty_discount: string
    points_discount: string
    location_url: string
    return_order: RETURNORDER[]
}
