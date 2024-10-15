export interface SHORTURLTYPE {
    id: number
    short_url: string
    short_code: string
    web_url: string
    android_url: string
    ios_url: string
    default_url: string
    create_date: string
    update_date: string
}

export interface URLSHORTNERTYPE {
    result: SHORTURLTYPE[]
    loading: boolean
    message: string
    count: number
    page: number
    pageSize: number
    // from: any
    // to: any
}
