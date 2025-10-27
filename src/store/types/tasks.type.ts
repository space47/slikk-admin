type TaskItem = {
    name: string
    images: string
    brand: string
    mrp: string
    sp: string
    quantity: string
    sku: string
    barcode: string
    create_date: string
    update_date: string
}

type RunnerDetail = {
    name: string
    mobile: string
    photo: string
}

type LocationDetails = {
    name: string
    address: string
    landmark: string
    latitude: number
    longitude: number
    contact_number: string
    alternate_number?: string
}

type EventLog = {
    status: string
    timestamp: string
    failure_reason?: string
    rto_reason?: string
    RIDER?: string
}

type ClientOrderDetails = {
    order_id: string
    cash_collected?: boolean
    cash_to_be_collected?: number
    delivery_charge_to_be_collected_from_customer?: boolean
    is_prepaid?: boolean
    payment_mode?: string
}

type UserDetails = {
    contact_number: string
}

export type TaskData = {
    task_id: string
    status: string
    slikklogistic_item: TaskItem[]
    runner_latitude: number
    runner_longitude: number
    runner_detail: RunnerDetail
    pickup_details: LocationDetails
    drop_details: LocationDetails
    user_details: UserDetails
    client_order_details: ClientOrderDetails
    client_order_id: string
    create_date: string
    event_logs: EventLog[]
    update_date: string
}

export type TASKDETAILS = {
    taskData: TaskData
    loading: boolean
    message: string
}
