import React from 'react'
import { Modal, Select } from 'antd'

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
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const CustomModal1: React.FC<props1> = ({ isModalOpen, handlePack, handleClose, modalContent, status }) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'OK'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Are you sure to accept?</h1>
        </Modal>
    )
}

type props2 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const CustomModal2: React.FC<props2> = ({ isModalOpen, handlePack, handleClose, modalContent, status }) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'ACCEPTED' ? 'Accept' : 'OK'}
            cancelText={status === 'cancel' ? 'Cancel' : 'Close'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Are you sure to accept?</h1>
        </Modal>
    )
}

type props3 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const CustomModal3: React.FC<props3> = ({ isModalOpen, handlePack, handleClose, modalContent, status }) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'PICKED_UP' ? 'Picked Up' : 'OK'}
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Your order has been picked</h1>
        </Modal>
    )
}

type props4 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const CustomModal4: React.FC<props4> = ({ isModalOpen, handlePack, handleClose, modalContent, status }) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'out_for_delivery' ? 'Out for Delivery' : 'OK'}
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Your order is out for delivery</h1>
        </Modal>
    )
}

type props5 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
}

export const CustomModal5: React.FC<props5> = ({ isModalOpen, handlePack, handleClose, modalContent, status }) => {
    return (
        <Modal
            {...modalStyles}
            okText={status === 'location_update' ? 'Update Location' : 'OK'}
            cancelText={status === 'PENDING' ? 'Reject Orders' : 'Cancel'}
            okButtonProps={okButtonStyles}
            cancelButtonProps={cancelButtonStyles}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg mb-4">{modalContent}</p>
            <h1 className="text-2xl font-semibold">Your location has been updated</h1>
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

export const CustomModal6: React.FC<props6> = ({ isModalOpen, handlePack, handleClose, modalContent, status }) => {
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
