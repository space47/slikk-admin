interface LOGS {
    status: string
    timestamp: string
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
    logistic_tasks: any[]
}
