/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { DeliveredModal, OutForDeliveryModal, OutforDeliveryModal, PickedUpModal } from './RefundModal'

interface ReturnActionProps {
    returnDetails: any
    handleAction: (value: string) => void
    setIsModalOpen: (value: React.SetStateAction<boolean>) => void
    modalContent: string | undefined
    isModalOpen: boolean
}

const ReturnActionActivity = ({ returnDetails, handleAction, setIsModalOpen, modalContent, isModalOpen }: ReturnActionProps) => {
    return (
        <div>
            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'REVERSE_PICKUP_CREATED' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKUP_CREATED' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'RIDER_ASSIGNED') && (
                <OutforDeliveryModal
                    isModalOpen={isModalOpen}
                    handleoutForDelivery={() => handleAction('out_for_pickup')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'OUT_FOR_PICKUP' && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={() => handleAction('picked_up')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKED_UP' && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={() => handleAction('in_transit')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'IN_TRANSIT' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'SHIPPED') && (
                <OutForDeliveryModal
                    isModalOpen={isModalOpen}
                    handleOutForDelivery={() => handleAction('out_for_delivery')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}
            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'OUT_FOR_DELIVERY' && (
                <DeliveredModal
                    isModalOpen={isModalOpen}
                    handleDelivered={() => handleAction('delivered')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}
        </div>
    )
}

export default ReturnActionActivity
