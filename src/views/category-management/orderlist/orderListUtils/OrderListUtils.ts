export const getStatusFilter = (tabSelect: string) => {
    switch (tabSelect) {
        case 'pending':
            return '&status=PENDING'
        case 'accepted':
            return '&status=ACCEPTED'
        case 'packed':
            return '&status=PACKED'
        case 'delivery_created':
            return '&status=DELIVERY_CREATED'
        case 'delivery_assigned':
            return '&status=DELIVERY_ASSIGNED'
        case 'delivery_cancelled':
            return '&status=DELIVERY_CANCELLED'
        case 'out_for_delivery':
            return '&status=OUT_FOR_DELIVERY,SHIPPED'
        case 'delivered':
            return '&status=COMPLETED'
        case 'cancelled':
            return '&status=CANCELLED'
        case 'all':
        default:
            return ''
    }
}
