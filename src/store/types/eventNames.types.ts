export type EventNamesData = {
    id?: number
    name?: string
    title?: string | null
    create_date?: string
    update_date?: string
    attributes?: Record<string, string>
}

export type EventNamesResponseType = {
    count?: number
    next?: string | null
    previous?: string | null
    results?: EventNamesData[]
}
