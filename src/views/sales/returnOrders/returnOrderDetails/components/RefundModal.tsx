import React from 'react'
import { Modal } from 'antd'
import { EReturnOrderStatus } from '../../returnOrderUtils/ReturnOrderUtils'

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

export const PickedUpGenerateModal: React.FC<props0> = ({ isModalOpen, handlePickupGenerate, handleClose, modalContent, status }) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === EReturnOrderStatus.pickup_generate ? 'Pick_up Generate' : 'OK'}
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
    currentButton: boolean
}

export const PickedUpModal: React.FC<props1> = ({ isModalOpen, handlePickup, handleClose, modalContent, status, currentButton }) => {
    return (
        <Modal
            {...modalStyles}
            okText={currentButton ? 'PICKING.....' : 'PICK UP'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePickup}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Create Pickup Generate</h1>
        </Modal>
    )
}

type props2 = {
    isModalOpen: boolean
    handleoutForDelivery: () => void
    handleClose: () => void
    modalContent?: string
    status?: string
    currentButton: boolean
}

export const OutforDeliveryModal: React.FC<props2> = ({
    isModalOpen,
    handleoutForDelivery,
    handleClose,
    modalContent,
    status,
    currentButton,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={currentButton ? 'OUT FOR PICKUP.....' : 'OUT FOR PICKUP'}
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

export const InTransitModal: React.FC<props3> = ({ isModalOpen, handleInTransit, handleClose, modalContent, status }) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === EReturnOrderStatus.in_transit || status === 'SHIPPED' ? 'Transit' : 'SHIP'}
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
    currentButton: boolean
}

export const OutForDeliveryModal: React.FC<props4> = ({
    isModalOpen,
    handleOutForDelivery,
    handleClose,
    modalContent,
    status,
    currentButton,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={currentButton ? 'DELIVERING....' : 'OUT FOR DELIVERY'}
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handleOutForDelivery}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Your order is out for Delivery</h1>
        </Modal>
    )
}

type props5 = {
    isModalOpen: boolean
    handleDelivered: () => void
    handleClose: () => void
    modalContent?: string
    status: string
    currentButton: boolean
}

export const DeliveredModal: React.FC<props5> = ({ isModalOpen, handleDelivered, handleClose, modalContent, status, currentButton }) => {
    return (
        <Modal
            {...modalStyles}
            okText={currentButton ? 'DOING.....' : 'DELIVER'}
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handleDelivered}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-xl font-semibold">
                Are you sure you want to mark as <span className="font-bold text-red-700">Delivered</span> for the current number of packets
            </h1>
        </Modal>
    )
}
