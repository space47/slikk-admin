/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReturnOrderItem {
    order_item: number
    return_amount: string
    quantity: string
    return_reason: string
    create_date: string
    update_date: string
}

export interface ReturnDropdownStatus {
    value: string[]
    name: string[]
}

export interface EventArray {
    status: string
    timestamp: string
}

export interface ReturnOrder {
    amount: string
    order: any
    create_date: string
    return_order_delivery: any[]
    return_order_id: string
    return_order_items: ReturnOrderItem[]
    pickup_schedule_slot: number
    pickup_schedule_date: string
    return_type: string
    status: string
    uuid: string
    log: EventArray[]
}

export const SEARCHOPTIONS = [
    { label: 'RETURN_ID', value: 'return_order_id' },
    { label: 'INVOICE', value: 'invoice_id' },
]

export const DELEIVERYRETRUNOPTIONS = [
    { label: 'User_Initiated', value: 'USER_INITIATED' },
    { label: 'Dashboard_Cancelled', value: 'DASHBOARD_CANCELLED' },
    { label: 'Try&Buy', value: 'TRY_AND_BUY' },
]

export const scheduleSlots: any = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}
