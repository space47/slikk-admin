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
