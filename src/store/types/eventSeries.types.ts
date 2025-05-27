/* eslint-disable @typescript-eslint/no-explicit-any */
export type eventSeriesResponseTypes = {
    id?: number
    name?: string
    event_type?: string
    description?: string
    image_web?: string
    image_mobile?: string
    total_slots?: number
    registration_start_date?: string // ISO date string with timezone
    registration_end_date?: string
    event_start_time?: string
    event_end_time?: string
    code_prefix?: string
    is_active?: boolean
    is_public?: boolean
    latitude?: number
    longitude?: number
    create_date?: string
    update_date?: string
    extra_attributes?: any
    last_updated_by?: string
    venue?: string
    terms_and_conditions?: string
}

export type GetEventSeriesTypes = {
    eventSeriesData?: eventSeriesResponseTypes[]
    count?: number
    from?: string
    to?: string
    page?: number
    pageSize?: number
}

export type EventData = {
    name?: string
    event_type?: string
    description?: string
    image_web?: string
    image_mobile?: string
    total_slots?: number
    registration_start_date?: string
    registration_end_date?: string
    event_start_time?: string
    event_end_time?: string
    code_prefix?: string
    is_active?: boolean
    is_public?: boolean
    latitude?: number
    longitude?: number
    extra_attributes?: any
    venue: string
    terms_and_conditions: string
}

export interface EventUser {
    event_code: string
    terms_and_conditions_accepted: boolean
    other_conditions_accepted: boolean
    status: string
    user: {
        name: string | null
        mobile: string
        email: string | null
    }
}

// export interface ExtraAttributes {
//     venue: string
//     category: string
//     sponsors: string[]
//     special_instructions: string

// }

export interface EventSeriesDetailsType {
    id: number
    available_slots: number
    is_joined: boolean
    is_unlocked: boolean
    event_users: EventUser[]
    name: string
    event_type: string
    description: string
    image_web: string
    image_mobile: string
    total_slots: number
    registration_start_date: string
    registration_end_date: string
    event_start_time: string
    event_end_time: string
    code_prefix: string
    is_active: boolean
    is_public: boolean
    latitude: number
    longitude: number
    create_date: string
    update_date: string
    extra_attributes: any
    last_updated_by: string
    venue?: string
    terms_and_conditions?: string
    redeem_count?: number
}

export interface EventSeriesActionTypes {
    mobile?: string | number
    event_id: number | string
    replace_event_id?: number
    action: string
}
