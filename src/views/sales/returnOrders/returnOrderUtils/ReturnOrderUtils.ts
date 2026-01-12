export const getStatusFilterReturn = (tabSelect: string) => {
    switch (tabSelect) {
        case 'pending':
            return '&status=PENDING'

        case 'accepted':
            return '&status=ACCEPTED'

        case 'pickup_created':
            return '&status=PICKUP_CREATED,REVERSE_PICKUP_CREATED'

        // case 'reverse_pickup_created':
        //     return '&status=REVERSE_PICKUP_CREATED'
        case 'pickup_rescheduled':
            return '&status=RETURN_RESCHEDULED'
        case 'qc_failed':
            return '&status=QC_FAILED,ATTEMPT_FAILED'
        case 'return_rejected':
            return '&status=RETURN_REJECTED'

        case 'out_for_pickup':
            return '&status=OUT_FOR_PICKUP'
        case 'picked_up':
            return '&status=PICKED_UP'
        case 'rider_assigned':
            return '&status=RIDER_ASSIGNED'

        case 'delivered':
            return '&status=DELIVERED'

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

export enum EReturnOrderStatus {
    pending = 'PENDING',
    accepted = 'ACCEPTED',
    pickup_created = 'PICKUP_CREATED',
    reverse_pickup_created = 'REVERSE_PICKUP_CREATED',
    return_rescheduled = 'RETURN_RESCHEDULED',
    qc_failed = 'QC_FAILED',
    pickup_attempt_failed = 'PICKUP_ATTEMPT_FAILED',
    attempt_failed = 'ATTEMPT_FAILED',
    return_rejected = 'RETURN_REJECTED',
    out_for_pickup = 'OUT_FOR_PICKUP',
    picked_up = 'PICKED_UP',
    rider_assigned = 'RIDER_ASSIGNED',
    delivered = 'DELIVERED',
    refunded = 'REFUNDED',
    completed = 'COMPLETED',
    cancelled = 'CANCELLED',
    partially_accepted = 'PARTIALLY_ACCEPTED',
    pickup_generate = 'PICKUP_GENERATE',
    in_transit = 'IN_TRANSIT',
    shipped = 'SHIPPED',
}
