/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { DeliveredModal, OutForDeliveryModal, OutforDeliveryModal, PickedUpModal } from './RefundModal'
import TrackModal from '@/views/slikkLogistics/taskTracking/TrackModal'
import { EReturnOrderStatus } from '../../returnOrderUtils/ReturnOrderUtils'

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
            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.reverse_pickup_created ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.pickup_created) &&
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

            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.in_transit ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.shipped) && (
                <OutForDeliveryModal
                    isModalOpen={isModalOpen}
                    handleOutForDelivery={() => handleAction('out_for_delivery')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails.status}
                    currentButton={currentButton}
                />
            )}
            {buttonText === EReturnOrderStatus.delivered && (
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
