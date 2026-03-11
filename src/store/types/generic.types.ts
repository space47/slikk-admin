export interface ApiResponse<T> {
    data: {
        results: T[]
        count: number
        next?: boolean
        previous?: boolean
    }
    status: string
    message?: string
}

export interface ApiDataResponse<T> {
    status: string
    message: string
    data: T[]
}
