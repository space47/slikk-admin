export interface NotificationTYPE {
    event_name: string
    notification_type: string
    title: string
    message: string
    template_id: string
    is_active: boolean
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
