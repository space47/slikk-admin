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
