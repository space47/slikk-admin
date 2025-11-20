import { ApiResponse } from './generic.types'

export interface Rider {
    id: number
    user: RiderUser
    rider_type: string // e.g. "FORWARD"
    agency: string
    is_active: boolean
}

export interface RiderUser {
    name: string
    mobile: string
    email: string
}

export interface UserDetails {
    first_name: string
    last_name: string
    email: string
    mobile: string
    checked_in_status: boolean
    latitude: number
    longitude: number
    device_id: string
    gender: string // "M" or "F"
}

export interface CashCollection {
    id: number
    rider: Rider
    expected_cash_collected: number
    cash_collected: number
    cash_deposited: number
    collection_date: string // ISO date string (e.g. "2025-09-26")
    deposited_to: UserDetails | null
    last_updated_by: UserDetails | null
    create_date: string // ISO datetime string
    update_date: string // ISO datetime string
}

export type CashResponseType = ApiResponse<CashCollection>
