export const getStatusFilter = (tabSelect: string) => {
    switch (tabSelect) {
        case 'pending':
            return 'PENDING'
        case 'accepted':
            return 'ACCEPTED'
        case 'packed':
            return 'PACKED'
        case 'picking':
            return 'PICKING'
        case 'delivery_created':
            return 'DELIVERY_CREATED'
        case 'reached_at_location':
            return 'REACHED_AT_LOCATION'
        case 'delivery_assigned':
            return 'DELIVERY_ASSIGNED'
        case 'rto_delivered':
            return 'RTO_DELIVERED'
        case 'delivery_cancelled':
            return 'DELIVERY_CANCELLED'
        case 'out_for_delivery':
            return 'OUT_FOR_DELIVERY,SHIPPED'
        case 'delivered':
            return 'COMPLETED'
        case 'cancelled':
            return 'CANCELLED'
        case 'all':
        default:
            return ''
    }
}

export enum OrderColumns {
    AREA = 'area',
    COUPON_CODE = 'coupon_code',
    PAYMENT_STATUS = 'payment.status',
    DELAY_STATUS = 'is_delayed',
    TOTAL_TIME_TAKEN = 'total_time',
    DELAY_TIME = 'delayed_time',
    ETA_DROP_OFF = 'eta_dropoff_time',
    ESTIMATE_DELIVERY = 'eta_duration',
    DEVICE_TYPE = 'device_type',
    CUSTOMER_NAME = 'user.name',
    PICKER_NAME = 'picker.name',
    UPDATE_DATE = 'update_date',
    PRINTER = 'printer',
}
