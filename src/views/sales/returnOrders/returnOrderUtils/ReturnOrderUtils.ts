export const getStatusFilterReturn = (tabSelect: string) => {
    switch (tabSelect) {
        case 'pending':
            return '&status=PENDING'

        case 'accepted':
            return '&status=ACCEPTED'

        case 'pickup_created':
            return '&status=PICKUP_CREATED'

        case 'reverse_pickup_created':
            return '&status=REVERSE_PICKUP_CREATED'

        case 'out_for_pickup':
            return '&status=OUT_FOR_PICKUP'
        case 'rider_assigned':
            return '&status=RIDER_ASSIGNED'

        case 'in_transit':
            return '&status=IN_TRANSIT'

        case 'refunded':
            return '&status=REFUNDED'

        case 'completed':
            return '&status=COMPLETED'

        case 'cancelled':
            return '&status=CANCELLED'

        case 'all':
        default:
            return ''
    }
}
