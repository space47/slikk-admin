/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NotificationTYPE {
    event_name: string
    notification_type: string
    title: string
    message: string
    template_id: string
    is_active: boolean
    language: string
    config_data: any
}

export const ParametersArray = [
    'name',
    'order_id',
    'address',
    'delivery_time',
    'coupon',
    'amount',
    'loyalty',
    'order_count',
    'DOB',
    'return_order_id',
    'return_amount',
    'refund_amount',
]

export const notificationTypeArray = [
    { value: 'SMS', label: 'SMS' },
    { value: 'EMAIL', label: 'EMAIL' },
    { value: 'WHATSAPP', label: 'WHATSAPP' },
    { value: 'APP', label: 'APP' },
]
