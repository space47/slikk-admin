/* eslint-disable @typescript-eslint/no-explicit-any */
export type RiderAddTypes = {
    task_id?: string
    mobile?: string
    first_name?: string
    last_name?: string
    rider_type?: string
    service_latitude?: number
    service_longitude?: number
    shift_start_time?: string
    shift_end_time?: string
}

export type RiderAttendanceResults = Partial<{
    id: number
    checkin_date: string
    checkin_time: string
    checkout_time: string
    user_type: string
    distance_covered: number
    latitude: number
    longitude: number
    other_data: {
        orders_count: number
        cash_collected: number
        actual_distance: number
        estimated_distance: number
    }
    create_date: string
    update_date: string
    user: string
}>

export type RiderAttendanceResponseType = {
    status?: string
    data?: {
        count?: number
        next?: string
        previous?: string
        results?: RiderAttendanceResults[]
    }
}

// Rider Data

export type TaskData = Partial<{
    TOTAL: number
    DELIVERED: number
    ASSIGNED: number
    OUT_FOR_PICKUP: number
    OUT_FOR_DELIVERY: number
    PICKED_UP: number
    PICKUP_FAILED: number
    COMPLETED: number
    distance_covered: number
    active_time: number
    check_in_time: string | null
    checkout_time: string | null
}>

export type UserProfile = Partial<{
    first_name: string
    last_name: string
    email: string
    mobile: number
    gender: string
    dob: string
    country_code: string
    device_id: string
    date_joined: string
    last_otp_tried_time: string
    image: string | null
    checked_in_status: boolean
    current_location: {
        latitude: string
        longitude: string
    }
}>

export type RiderDetails = Partial<{
    profile: UserProfile
    task_data: TaskData
}>

export type RiderDetailResponseType = {
    status?: string
    data?: {
        count: number
        results?: RiderDetails[]
    }
}

export type RiderSlice = {
    riderAttendance: RiderAttendanceResults[]
    count: number
    page: number
    pageSize: number
    from: string
    to: string
}

export interface RiderProfileData {
    id: number
    user: {
        first_name: string
        last_name: string
        email: string
        mobile: number
        country_code: string
        dob: string
        gender: string
        image: string
        device_id: string
        date_joined: string
        last_otp_tried_time: string
        current_location: {
            latitude: string
            longitude: string
        }
        checked_in_status: boolean
    }
    rider_type: string
    service_latitude: number
    service_longitude: number
    image: string | null
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

export type RiderProfileResponseType = {
    status?: string
    data?: RiderProfileData[]
}
