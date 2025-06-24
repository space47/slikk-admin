export interface pickerBoardData {
    average_pickup_time: number
    checked_in_status: boolean
    items_count: number
    items_picked: number
    mobile: string
    name: string
    orders: {
        id: number
        invoice_id: string
        items_count: number
        pickup_time: number
        status: string
    }[]

    orders_count: number
    pending: number
    picked: number
    total_pickup_time: number
}

export interface pickerResponseType {
    status: string
    data: pickerBoardData[]
}

export interface particularPickerType {
    data: {
        create_date: string
        delivery_type: string
        invoice_id: string
        items_count: number
        payment_mode: string
        status: string
        total_amount: number
    }[]
    order_counts: {
        pending: number
        picked: number
        total: number
    }
    profile: {
        checked_in_status: boolean
        email: string
        first_name: string
        last_name: string
        latitude: number
        longitude: number
        mobile: string
    }
}
