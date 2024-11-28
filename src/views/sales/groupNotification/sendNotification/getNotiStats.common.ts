export interface NOTIFYSTATS {
    id: number
    name: string
    title: string
    message: string
    total_users: number
    rules: string
    success: number
    failure: number
    create_date: string
    update_date: string
    notification: string | null
}

export interface NotifyResponse {
    results: NOTIFYSTATS[]
}
export const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

export type SchedulerConfig = {
    day: string
    hour: string
    year: string
    month: string
    minute: string
}

export type OtherConfig = {
    key: string
    filters: string[]
    page_title: string
    target_page: string
}

export type Rules = {
    min_purchase: number
}

export type User = {
    first_name: string
    last_name: string
    email: string | null
    mobile: string
}

export type SchedularTypes = {
    id: number
    users: User[]
    group: any[]
    notification_group: string | null
    name: string
    title: string
    message: string
    redirect_url: string
    template_id: string
    image: string
    is_active: boolean
    scheduler_config: SchedulerConfig
    next_run_time: string | null
    last_run_time: string | null
    other_config: OtherConfig
    rules: Rules
    status_logs: Record<string, unknown>
    expiry_date: string
    create_date: string
    update_date: string
}
