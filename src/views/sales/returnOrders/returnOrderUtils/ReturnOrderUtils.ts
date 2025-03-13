export const getStatusFilterReturn = (tabSelect: string) => {
    switch (tabSelect) {
        case 'pending':
            return '&status=PENDING'

        case 'accepted':
            return '&status=ACCEPTED'

        case 'approved':
            return '&status=APPROVED'

        case 'pickup_created':
            return '&status=PICKUP_CREATED'

        case 'out_for_delivery':
            return '&status=OUT_FOR_DELIVERY,SHIPPED'

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
