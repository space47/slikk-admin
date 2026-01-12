/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { DeliveredModal, OutForDeliveryModal, OutforDeliveryModal, PickedUpModal } from './RefundModal'
import TrackModal from '@/views/slikkLogistics/taskTracking/TrackModal'

interface ReturnActionProps {
    returnDetails: any
    handleAction: (value: string) => void
    setIsModalOpen: (value: React.SetStateAction<boolean>) => void
    modalContent: string | undefined
    isModalOpen: boolean
    currentButton: any
    buttonText?: any
}

const ReturnActionActivity: React.FC<ReturnActionProps> = ({
    returnDetails,
    handleAction,
    setIsModalOpen,
    modalContent,
    isModalOpen,
    currentButton,
    buttonText,
}) => {
    return (
        <div>
            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'REVERSE_PICKUP_CREATED' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKUP_CREATED') &&
                (returnDetails?.return_order_delivery[0]?.partner === 'Slikk' ||
                    returnDetails?.return_order_delivery[0]?.partner === '' ||
                    undefined ||
                    null) && (
                    <TrackModal
                        isReturn
                        isOrder
                        handleCloseModal={() => setIsModalOpen(false)}
                        showTaskModal={isModalOpen}
                        setShowAssignModal={setIsModalOpen}
                        taskId={returnDetails?.return_order_delivery[0]?.task_id}
                    />
                )}

            {buttonText === 'OUT FOR PICKUP' && (
                <OutforDeliveryModal
                    isModalOpen={isModalOpen}
                    handleoutForDelivery={() => handleAction('out_for_pickup')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    currentButton={currentButton}
                />
            )}

            {}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'OUT_FOR_PICKUP' && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={() => handleAction('picked_up')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails.status}
                    currentButton={currentButton}
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
                    currentButton={currentButton}
                />
            )}
            {buttonText === 'DELIVERED' && (
                <DeliveredModal
                    isModalOpen={isModalOpen}
                    handleDelivered={() => handleAction('delivered')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails.status}
                    currentButton={currentButton}
                />
            )}
        </div>
    )
}

export default ReturnActionActivity
