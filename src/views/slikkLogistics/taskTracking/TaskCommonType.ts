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
    credits_key: string
    contact_number: string
}

type ClientOrderDetails = {
    order_id: string
    is_prepaid: boolean
    cash_to_be_collected: number
    delivery_charge_to_be_collected_from_customer: boolean
}

export type TaskDetails = {
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
}
