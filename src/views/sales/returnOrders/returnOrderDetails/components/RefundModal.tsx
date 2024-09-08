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
            okText={status === 'PICKED_UP' ? 'Picked_up' : 'ok'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePickup}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Set Your PickUp</h1>
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
            okText={status === 'PICKED_UP' ? 'Out for pickup' : 'ok'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handleoutForDelivery}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">
                Set Your Out for Delivery
            </h1>
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
            okText={status === 'PICKED_UP' ? 'Out for pickup' : 'ok'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handleInTransit}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Set Your #In transit</h1>
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
            okText={status === 'out_for_delivery' ? 'Out for Delivery' : 'OK'}
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
            okText={status === 'location_update' ? 'Update Location' : 'OK'}
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

type props6 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const CustomModal6: React.FC<props6> = ({
    isModalOpen,
    handlePack,
    handleClose,
    modalContent,
    status,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'delivered' ? 'Mark as Delivered' : 'OK'}
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Mark as Delivered</h1>
        </Modal>
    )
}

export const CustomModal7: React.FC<props3> = ({
    //change here the props
    isModalOpen,
    handlePack,
    handleClose,
    modalContent,
    status,
}) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'PICKED_UP' ? 'Picked Up' : 'OK'} // set the status for showing data
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">
                Your order has been picked
            </h1>
        </Modal>
    )
}
