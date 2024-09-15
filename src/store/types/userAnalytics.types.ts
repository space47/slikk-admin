export type User = {
    first_name: string | null
    last_name: string | null
    email: string | null
    mobile: string
}

export type ResponseData = {
    count: number
    next: boolean
    results: User[]
}

export type USERANALYTICS_TYPE = {
    status: string
    total_logged_in: number
    total_otp_verified: number
    data: ResponseData | null
    from: string
    to: string
    loading: boolean
    message: string
}
