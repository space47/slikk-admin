interface queryData {
    date: string
    daily_active_sessions: string
}

export interface QUERYNAMETYPE {
    data: queryData[]
    total: number
    loading: boolean
    message: string
}
