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
    current_location: {
        latitude: string
        longitude: string
    }
    checked_in_status: boolean
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

export const RiderAgency = [
    { label: 'Pidge', value: 'pidge' },
    { label: 'Pico', value: 'pico' },
    { label: 'Care Bazaar', value: 'careBazaar' },
    { label: 'Shadow Fax', value: 'shadowfax' },
]
