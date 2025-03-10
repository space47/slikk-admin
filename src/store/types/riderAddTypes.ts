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

export type RiderSlice = {
    riderAttendance: RiderAttendanceResults[]
    count: number
    page: number
    pageSize: number
    from: string
    to: string
}
