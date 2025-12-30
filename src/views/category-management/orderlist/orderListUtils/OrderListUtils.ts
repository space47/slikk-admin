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
