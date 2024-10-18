export interface REVERSETask {
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
    create_date: string
    update_date: string
}

interface RunnerDetail {
    name: string
    mobile: string
    photo: string
}

interface LocationDetails {
    name: string
    address: string
    landmark: string
    latitude: number
    longitude: number
    contact_number: string
}

interface UserDetails {
    contact_number: string
}

interface ClientOrderDetails {
    order_id: string
}

export interface Data {
    count: number
    next: boolean
    results: REVERSETask[]
}
