export const getButtonAndModalContent = (status: string) => {
    switch (status) {
        case '':
            return {
                buttonText: 'CREATE REVERSE PICKUP',
            }
        case 'RIDER_ASSIGNED':
        case 'PICKUP_CREATED':
        case 'REVERSE_PICKUP_CREATED':
            return {
                buttonText: 'OUT FOR PICKUP',
            }
        case 'OUT_FOR_PICKUP':
            return {
                buttonText: 'PICKED UP',
            }
        case 'PICKED_UP':
            return {
                buttonText: 'IN TRANSIT',
            }
        case 'SHIPPED':
        case 'IN_TRANSIT':
            return {
                buttonText: 'OUT_FOR_DELIVERY',
            }

        case 'OUT_FOR_DELIVERY':
            return {
                buttonText: 'DELIVERED',
            }
        case 'DELIVERED':
            return {
                buttonText: 'COMPLETE RETURN',
            }

        default:
            return {
                buttonText: '',
                modalContent: '',
            }
    }
}
