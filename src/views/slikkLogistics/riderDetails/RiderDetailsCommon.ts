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
    { label: 'CareBazaar', value: 'careBazaar' },
    { label: 'WD', value: 'WD' },
    { label: 'Shadow Fax', value: 'shadowfax' },
    { label: 'SENDIT', value: 'sendit' },
]

export const DEBOUNCE_DELAY = 600
export const RIDER_TYPES = [
    { label: 'INSTANT RETURN', value: 'instant_return_rider' },
    { label: 'BACKLOG RETURN', value: 'backlog_return_rider' },
]
export const RIDER_TYPES_FILTER = [
    { label: 'FORWARD', value: 'FORWARD' },
    { label: 'RETURN', value: 'RETURN' },
]
export const SEARCH_TYPES = ['mobile', 'name'] as const
export const STATUS_TABS = ['checkin', 'checkout'] as const
export const BUSY_STATUS_TABS = ['', 'free', 'busy'] as const

export interface StoreOption {
    label: string
    value: {
        lat: number
        long: number
        id: number
    }
}

export interface DeliveryType {
    label: string | undefined
    value: string | undefined
}

export const RiderDownloadOptions = [
    { label: 'Summary Report', value: 'summary' },
    { label: 'Order Level Report', value: 'order_level' },
]
