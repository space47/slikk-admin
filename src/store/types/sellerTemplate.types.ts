export interface NotificationConfigData {
    create_date: string
    event_name: string
    id: number
    is_active: boolean
    message: string
    notification_type: string
    template_id: string
    title: string
    update_date: string
}

export interface NotificationConfigResponse {
    status: string
    data: {
        count: number
        results: NotificationConfigData[]
    }
}

export interface NotificationUpdateBody {
    id?: string
    event_name?: string
    message?: string
    notification_type?: string
    title?: string
    is_active?: boolean
}
