import React from 'react'
import { Modal } from 'antd'

const modalStyles = {
    title: '',
    width: 600,
    padding: '20px',
    borderRadius: '12px',
}

const okButtonStyles = {
    className: 'font-bold',
    style: {
        backgroundColor: '#1890ff',
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        padding: '6px 20px',
    },
}

const cancelButtonStyles = {
    className: 'font-bold',
    style: {
        backgroundColor: '#f0f0f0',
        color: '#595959',
        borderRadius: '8px',
        border: 'none',
        padding: '6px 20px',
    },
}

type props0 = {
    isModalOpen: boolean
    handlePickupGenerate: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const PickedUpGenerateModal: React.FC<props0> = ({
    isModalOpen,
    handlePickupGenerate,
    handleClose,
    modalContent,
    status,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'PICKUP_GENERATE' ? 'Pick_up Generate' : 'OK'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePickupGenerate}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Set Your PickUp</h1>
        </Modal>
    )
}

type props1 = {
    isModalOpen: boolean
    handlePickup: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const PickedUpModal: React.FC<props1> = ({
    isModalOpen,
    handlePickup,
    handleClose,
    modalContent,
    status,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'PICKED_UP' ? 'Picked_up' : 'OK'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePickup}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Your Item is Picked Up</h1>
        </Modal>
    )
}

type props2 = {
    isModalOpen: boolean
    handleoutForDelivery: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const OutforDeliveryModal: React.FC<props2> = ({
    isModalOpen,
    handleoutForDelivery,
    handleClose,
    modalContent,
    status,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'OUT_FOR_PICKUP' ? 'OK' : 'OK'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handleoutForDelivery}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Item is Out for PICKUP</h1>
        </Modal>
    )
}

type props3 = {
    isModalOpen: boolean
    handleInTransit: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const InTransitModal: React.FC<props3> = ({
    isModalOpen,
    handleInTransit,
    handleClose,
    modalContent,
    status,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'IN_TRANSIT' ? 'Transit' : 'OK'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handleInTransit}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Item is In Transit state</h1>
        </Modal>
    )
}

type props4 = {
    isModalOpen: boolean
    handleOutForDelivery: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const OutForDeliveryModal: React.FC<props4> = ({
    isModalOpen,
    handleOutForDelivery,
    handleClose,
    modalContent,
    status,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'OK'}
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handleOutForDelivery}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">
                Your order is out for Delivery
            </h1>
        </Modal>
    )
}

type props5 = {
    isModalOpen: boolean
    handleDelivered: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const DeliveredModal: React.FC<props5> = ({
    isModalOpen,
    handleDelivered,
    handleClose,
    modalContent,
    status,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'DELIVERED' ? 'Deliver' : 'OK'}
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handleDelivered}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Your Item is Delivered</h1>
        </Modal>
    )
}
