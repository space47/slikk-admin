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

export interface PickerTableData {
    id: number
    user: {
        first_name: string
        last_name: string
        email: string
        mobile: string
        checked_in_status: boolean
        latitude: number
        longitude: number
        device_id: string | null
        gender: string | null
    }
    image: string | null
    store: {
        id: number
        code: string
        name: string
        is_fulfillment_center: boolean
        latitude: number
        longitude: number
    }[]
    is_active: boolean
    kyc_status: boolean
    kyc_data: Record<string, any>
    bank_details: Record<string, any>
    shift_start_time: string
    shift_end_time: string
    compensation_info: Record<string, any>
    other_info: Record<string, any>
    create_date: string
    update_date: string
}

export interface pickerResponseType {
    status: string
    data: PickerTableData[]
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
