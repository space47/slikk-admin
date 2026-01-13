/* eslint-disable @typescript-eslint/no-explicit-any */
import { SalesOrderDetailsResponse } from '../orderList.common'

export const LOGISTIC_PARTNER = [
    { value: 'porter', label: 'PORTER' },
    { value: 'slikk', label: 'SLIKK' },
]

export type Payment = {
    amount: number
    mode: string
    transaction_time: string
}

export type Product = {
    image: string
    quantity: string
    fulfilled_quantity: string
    final_price: number
    sku: string
    name: string
    id: number
    brand: string
    location?: string
    location_details?: Record<string, number>
}

export type LOGISTIC = {
    attempt_number?: number
    awb_code?: string | null
    cancellation_reason?: string | null
    cancelled_by?: string | null
    create_date?: string
    distance?: string
    drop_otp?: string | null
    drop_time?: string | null
    eta_dropoff?: string
    eta_pickup?: string
    id?: number
    latitude?: number
    log?: any[] // You can replace `any` with a specific type if the log structure is known
    longitude?: number
    order?: number
    partner?: string
    pickup_otp?: string | null
    pickup_time?: string | null
    price?: string | null
    reference_id?: string
    runner_name?: string
    runner_phone_number?: string
    runner_profile_pic_url?: string
    state?: string
    task_id?: string
    total_time?: string
    tracking_url?: string
    update_date?: string
}

export type Event = {
    timestamp: string
    status: string
    event_note?: string
}

export type ActivityProps = {
    mainData: SalesOrderDetailsResponse
    data?: Event[]
    status: string
    product?: Product[]
    payment?: Payment
    invoice_id?: string
    delivery_type: string
}
