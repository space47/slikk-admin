export const getStatusFilterReturn = (tabSelect: string) => {
    switch (tabSelect) {
        case 'pending':
            return '&status=PENDING'

        case 'accepted':
            return '&status=ACCEPTED,PARTIALLY_ACCEPTED'

        case 'pickup_created':
            return '&status=PICKUP_CREATED'
        case 'picked_up':
            return '&status=PICKED_UP'

        case 'out_for_pickup':
            return '&status=OUT_FOR_PICKUP'

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
