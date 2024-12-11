type RunnerDetail = {
    name: string
    mobile: string
    photo: string
}

type LocationDetails = {
    name: string
    address: string
    landmark: string
    latitude: any
    longitude: any
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
    create_date: string
    update_date: string
}

export type Option = {
    value: number
    label: string
}

export const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

export const SEARCHOPTIONS = [
    { label: 'Client Id', value: 'client_order_id' },
    { label: 'Mobile', value: 'mobile' },
]
export const STATUSARRAY = [
    { label: 'CREATED', value: 'CREATED' },
    { label: 'ASSIGNED', value: 'ASSIGNED' },
    { label: 'OUT_FOR_DELIVERY', value: 'OUT_FOR_DELIVERY' },
    { label: 'COMPLETED', value: 'COMPLETED' },
    { label: 'CANCELLED', value: 'CANCELLED' },
]
