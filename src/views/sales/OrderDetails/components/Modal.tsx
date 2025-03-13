/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Modal, Select } from 'antd'
import { Product } from './Activity'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown } from '@/components/ui'
import { FaRupeeSign } from 'react-icons/fa'

const { Option } = Select

type Props = {
    isModalOpen: boolean
    handleOk: () => void
    handleCancel: () => void
    modalContent?: string
    status: string
    invoice_id?: string
    payment?: {
        amount: number
    }
    product?: Product[]
    fulfilledQuantities: { [key: number]: number }
    handleSelectChange: (id: number, value: string) => void
    errorMessage?: string
    handleReject: () => void
    isButtonClick?: boolean
}

export const CustomModal: React.FC<Props> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    modalContent,
    status,
    invoice_id,
    payment,
    product,
    fulfilledQuantities,
    handleSelectChange,
    errorMessage,
    handleReject,
    isButtonClick,
}) => {
    return (
        <Modal
            title=""
            okText={isButtonClick ? 'PACKING...' : 'PACK'}
            cancelText={status === 'ACCEPTED' ? 'REJECT ORDERS' : 'CANCEL'}
            width={800}
            className="custom-modal overflow-scroll scrollbar-hide"
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#1D4ED8',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#6B7280',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
                onClick: status === 'ACCEPTED' ? handleReject : handleCancel,
            }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p className="text-lg font-semibold mb-4">{modalContent}</p>
            <div className="flex flex-col gap-4 mb-6 p-4 bg-white shadow-md rounded-lg">
                <div className="flex items-center text-[20px] font-semibold gap-2">
                    <span>Invoice Id:</span>
                    <span className="text-white bg-red-600 flex items-center justify-center px-2  rounded-[10px] font-semibold cursor-pointer">
                        {invoice_id}
                    </span>
                </div>
                <div className="flex gap-2 items-center text-[16px] font-semibold">
                    <span>Total Amount:</span>
                    <div className="flex items-center">
                        <FaRupeeSign className="text-green-600 " />
                        <span className="font-normal text-gray-700">{payment?.amount}</span>
                    </div>
                </div>
            </div>
            {product && product.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {product.map((pdts) => (
                        <div
                            key={pdts.id}
                            className="flex items-center p-6 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow xl:gap-12"
                        >
                            <div className="flex-shrink-0">
                                <img src={pdts.image.split(',')[0]} alt={pdts.name} className="w-28 xl:w-44 h-52 object-cover rounded-lg" />
                            </div>
                            <div className="ml-6 w-full">
                                <div className="font-semibold text-md xl:text-2xl">{pdts.brand}</div>
                                <div className="font-semibold text-md text-gray-500 xl:text-2xl w-[100px] xl:w-full">{pdts.name}</div>
                                <div className="text-gray-900 mb-3 xl:text-lg w-[100px] xl:w-full">{pdts.sku}</div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col xl:flex-row xl:gap-6 xl:items-center gap-2">
                                        <div className="text-lg xl:text-xl">Qty: {pdts.quantity}</div>
                                        <div className="text-lg xl:text-xl flex items-center">
                                            Fulfilled Qty:
                                            <Select
                                                value={fulfilledQuantities[pdts.id] || 0}
                                                className="ml-3 mt-2 xl:mt-0 w-16 h-7"
                                                onChange={(value: any) => handleSelectChange(pdts.id, value)}
                                            >
                                                {Array.from({ length: parseInt(pdts.quantity, 10) + 1 }, (_, i) => (
                                                    <Option key={i} value={i.toString()}>
                                                        {i}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {errorMessage && <div className="text-red-500 mt-4 text-center">{errorMessage}</div>}
        </Modal>
    )
}

type LOGISTIC = {
    order: number
    partner: string
}

type props2 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
    logistic: LOGISTIC
    handlePartnerSelect: any
    partner: any
    isButtonClick?: any
}

export const CustomModal2: React.FC<props2> = ({
    isModalOpen,
    handlePack,
    handleClose,
    modalContent,
    status,
    logistic,
    handlePartnerSelect,
    partner,
    isButtonClick,
}) => {
    const LOGISTIC_PARTNER = [
        { value: 'porter', label: 'PORTER' },
        { value: 'shiprocket', label: 'SHIPROCKET' },
        { value: 'shadowfax', label: 'SHADOWFAX' },
        { value: 'slikk', label: 'SLIKK' },
        { value: 'pidge', label: 'PIDGE' },
    ]

    const selectedPartner = logistic?.partner

    return (
        <Modal
            title=""
            okText={isButtonClick ? 'SELECT PARTNER' : 'SELECT PARTNER'}
            cancelText={status === 'PENDING' ? 'REJECT ORDERS' : 'CANCEL'}
            width={800}
            className="custom-modal"
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#1D4ED8',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#6B7280',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <div className="flex flex-col justify-center items-center">
                <p className="text-lg font-semibold mb-4">{modalContent}</p>

                <div className="flex flex-col gap-5 justify-center items-center">
                    <div className="text-center text-lg font-bold text-green-600">Delivery Partner</div>
                    <div className="flex flex-col gap-2 justify-center items-center w-[250px] p-4 rounded-lg">
                        <span className="font-bold text-lg">Select Delivery Partner:</span>
                        <div className="border border-gray-300 w-[150px] rounded-lg">
                            <Dropdown
                                className="w-[150px] text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm font-bold items-center flex justify-center"
                                title={partner || 'SELECT_PARTNER'}
                                onSelect={(value) => handlePartnerSelect(value)}
                            >
                                <div className="max-h-60 overflow-y-auto">
                                    {LOGISTIC_PARTNER.map((item, key) => (
                                        <DropdownItem
                                            key={key}
                                            eventKey={item.value}
                                            className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                        >
                                            <span className="font-bold">{item.label}</span>
                                        </DropdownItem>
                                    ))}
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
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
            title=""
            okText={status === 'PENDING' ? 'ACCEPT & PACK' : 'SELECT'}
            cancelText={status === 'PENDING' ? 'REJECT ORDERS' : 'CANCEL'}
            width={800}
            className="custom-modal"
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#1D4ED8',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#6B7280',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg font-semibold mb-4">{modalContent}</p>
            <h1 className="text-center text-lg font-bold text-green-600">{modalContent}</h1>
        </Modal>
    )
}

type props4 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
    isButtonClick?: boolean
}

export const CustomModal4: React.FC<props4> = ({ isModalOpen, handlePack, handleClose, modalContent, status, isButtonClick }) => {
    return (
        <Modal
            title=""
            okText={isButtonClick ? 'Delivering....' : 'DELIVER'}
            cancelText={status === 'PENDING' ? 'REJECT ORDERS' : 'CANCEL'}
            width={800}
            className="custom-modal"
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#1D4ED8',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#6B7280',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg font-semibold mb-4">{modalContent}</p>
            <h1 className="text-center text-lg font-bold text-green-600">Mark as Deliver to complete the order</h1>
        </Modal>
    )
}

type props5 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
    invoice: any
    isButtonClick?: any
}

export const CustomModal5: React.FC<props5> = ({ isModalOpen, handlePack, handleClose, modalContent, status, invoice, isButtonClick }) => {
    return (
        <Modal
            title=""
            okText={isButtonClick ? 'ACCEPTING...' : 'ACCEPT'}
            cancelText={status === 'PENDING' ? 'CANCEL' : 'CANCEL'}
            width={800}
            className="custom-modal"
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#1D4ED8',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#6B7280',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg font-semibold mb-4">{modalContent}</p>
            <h1 className="text-center text-lg font-bold text-green-600">ACCEPT ORDER</h1>
            <p className="text-center text-xl font-semibold ">
                Are you sure you want to accept the order: <span className="font-bold underline text-red-600">{invoice}</span>{' '}
            </p>
            <br />
        </Modal>
    )
}

type prop6 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
    invoice: any
    isButtonClick?: any
}

export const ExchangeModal: React.FC<prop6> = ({ isModalOpen, handlePack, handleClose, modalContent, status, invoice, isButtonClick }) => {
    return (
        <Modal
            title=""
            okText={isButtonClick ? 'COMPLETING...' : 'COMPLETE'}
            cancelText={status === 'PENDING' ? 'CANCEL' : 'CANCEL'}
            width={800}
            className="custom-modal"
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#1D4ED8',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: '#6B7280',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg font-semibold mb-4">{modalContent}</p>

            <h1 className="text-center text-lg font-bold text-green-600">COMPLETE EXCHANGE ORDER</h1>
            <p className="text-center text-xl font-semibold ">
                Mark to set the Excange Delivery Complete for order:<span className="font-bold underline text-red-600">{invoice}</span>{' '}
            </p>
            <br />
        </Modal>
    )
}
