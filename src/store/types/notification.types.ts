interface configData {
    body: string
    image_url: string
    page_title: string
    target_page: string
    notification_title: string
}

export interface NotificationEvent {
    id: number
    event_name: string
    notification_type: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'APP'
    title: string
    message: string
    is_active: boolean
    template_id: string
    config_data: configData
    create_date: string
    update_date: string
}

export interface NotificationData {
    notification: NotificationEvent[]
    loading: boolean
    message: string
    page: number
    pageSize: number
    count: number
}
