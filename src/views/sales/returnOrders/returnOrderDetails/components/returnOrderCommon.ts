export const getButtonAndModalContent = (
    status: string,
    data: string,
    log: {
        status?: string
        timestamp?: string
    }[],
) => {
    const lastLogStatus = log?.at(-1)?.status
    const hasCompletedLog = log?.some((item) => item?.status?.includes('COMPLETED'))
    const isSlikkOrEmpty = data === 'Slikk' || data === ''

    if ((status === 'PICKUP_CREATED' || status === 'REVERSE_PICKUP_CREATED') && isSlikkOrEmpty) {
        return { buttonText: 'ASSIGN TO RUNNER' }
    }

    if (status === 'PICKUP_CREATED' || (status === 'REVERSE_PICKUP_CREATED' && !isSlikkOrEmpty)) {
        return { buttonText: 'OUT FOR PICKUP' }
    }

    if (!hasCompletedLog && status === 'REFUNDED') {
        return { buttonText: 'COMPLETE' }
    }

    if (log?.length > 0 && lastLogStatus === 'DELIVERED' && !hasCompletedLog) {
        return { buttonText: 'COMPLETE RETURN' }
    }

    const statusButtonMap: Record<string, string> = {
        '': 'CREATE REVERSE PICKUP',
        RIDER_ASSIGNED: 'OUT FOR PICKUP',
        OUT_FOR_PICKUP: 'PICKED UP',
        PICKED_UP: 'IN TRANSIT',
        SHIPPED: 'OUT FOR DELIVERY',
        IN_TRANSIT: 'OUT FOR DELIVERY',
        OUT_FOR_DELIVERY: 'DELIVERED',
    }

    return { buttonText: statusButtonMap[status] || '', modalContent: '' }
}
