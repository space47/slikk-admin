export type RiderProfile = {
    first_name: string
    last_name: string
    email: string
    mobile: number
    country_code: string
    dob: string
    gender: string | null
    image: string | null
    device_id: string
}

export type RiderTaskData = {
    TOTAL: number
    DELIVERED: number
    ASSIGNED: number
    OUT_FOR_PICKUP: number
    OUT_FOR_DELIVERY: number
    PICKED_UP: number
    PICKUP_FAILED: number
    COMPLETED: number
    distance_covered: number
}

export type RiderData = {
    profile: RiderProfile
    task_data: RiderTaskData
}
