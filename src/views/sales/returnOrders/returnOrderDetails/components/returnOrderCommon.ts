export const getButtonAndModalContent = (status: string, data: string, log: any[]) => {
    if ((status === 'PICKUP_CREATED' || status === 'REVERSE_PICKUP_CREATED') && (data === 'Slikk' || data === '')) {
        return { buttonText: 'ASSIGN TO RUNNER' }
    }

    if (status === 'PICKUP_CREATED' || (status === 'REVERSE_PICKUP_CREATED' && (data !== 'Slikk' || '' || undefined || null))) {
        return { buttonText: 'OUT FOR PICKUP' }
    }
    if (!log?.some((item) => item?.status?.includes('COMPLETED')) && status === 'REFUNDED') {
        return { buttonText: 'COMPLETE' }
    }

    switch (status) {
        case '':
            return { buttonText: 'CREATE REVERSE PICKUP' }
        case 'RIDER_ASSIGNED':
            return { buttonText: 'OUT FOR PICKUP' }
        case 'OUT_FOR_PICKUP':
            return { buttonText: 'PICKED UP' }
        case 'PICKED_UP':
            return { buttonText: 'IN TRANSIT' }
        case 'SHIPPED':
        case 'IN_TRANSIT':
            return { buttonText: 'OUT FOR DELIVERY' }
        case 'OUT_FOR_DELIVERY':
            return { buttonText: 'DELIVERED' }
        case 'DELIVERED':
            return { buttonText: 'COMPLETE RETURN' }
        default:
            return { buttonText: '', modalContent: '' }
    }
}
