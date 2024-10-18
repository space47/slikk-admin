interface LOGS {
    status: string
    timestamp: string
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
}

type UserDetails = {
    contact_number: string
}

type ClientOrderDetails = {
    order_id: string
}

export type LogisticTask = {
    task_id: string
    status: string
    runner_latitude: number
    runner_longitude: number
    runner_detail: RunnerDetail
    pickup_details: LocationDetails
    drop_details: LocationDetails
    user_details: UserDetails
    client_order_details: ClientOrderDetails
    client_order_id: string
    create_date: string // ISO 8601 string
    update_date: string // ISO 8601 string
}

export interface TRIPDETAIL {
    trip_id: string
    status: string
    distance_expected: number
    distance_actual: number
    runner_latitude: number
    runner_longitude: number
    location_data: Record<string, unknown>
    create_date: string
    update_date: string
    assigned_to: string
    event_logs: LOGS[]
    logistic_tasks: LogisticTask[]
}
