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
    is_active?: boolean
    agency?: string
    lat?: number
    long?: number
    store?: number[]
    rider_delivery_type?: string
}

type UserType = {
    first_name: string
    last_name: string
    email: string
    mobile: string
    user_type: string
}

export type RiderAttendanceResults = Partial<{
    id: number
    active_time: number
    bonus_earnings: number
    checkin_count: number
    checkin_date: string
    checkin_time: string
    checkout_time: string
    create_date: string
    distance_covered: number
    earnings: number
    order_processed: number
    other_order_data: {
        orders_count: number
        cash_collected: number
        actual_distance: number
        estimated_distance: number
    }
    update_date: string
    user: UserType
    checked_in_status: boolean
    email: string
    first_name: string
    last_name: string
    latitude: number
    longitude: number
    mobile: string
    user_type: string
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
    rider_type: string
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
    recent_task_detail: {
        assigned_at: string
        delivered_at: string
        distance: number
        estimate_time: string
        order_id: string
    }
    rider_status: boolean
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
export type RiderAttendanceReportSliceType = {
    riderAttendanceReport: RiderAttendanceResults[]
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
    agency?: string
    rider_delivery_type?: string
    store: any
}

export type RiderProfileResponseType = {
    status?: string
    data?: RiderProfileData[]
}

export type RiderDownloadResponse = {
    status: string
    message: string
}
