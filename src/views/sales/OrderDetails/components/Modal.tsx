/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Modal, Select } from 'antd'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Input } from '@/components/ui'
import { FaRupeeSign } from 'react-icons/fa'
import { LOGISTIC_PARTNER, Product } from './activityCommon'

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
    bagsCount: string
    setBagsCount: (x: string) => void
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
    bagsCount,
    setBagsCount,
}) => {
    return (
        <Modal
            title={
                <div className="flex justify-around items-center">
                    <div className="flex gap-2">
                        <button
                            className="font-bold px-4 py-1 rounded-md bg-gray-500 text-white"
                            onClick={status === 'ACCEPTED' ? handleReject : handleCancel}
                        >
                            {status === 'ACCEPTED' ? 'REJECT ORDERS' : 'CANCEL'}
                        </button>
                        <button
                            className="font-bold px-4 py-1 rounded-md bg-blue-500 text-white"
                            disabled={isButtonClick}
                            onClick={handleOk}
                        >
                            {isButtonClick ? 'PACKING...' : 'PACK'}
                        </button>
                    </div>
                </div>
            }
            footer={null}
            width={800}
            className="custom-modal overflow-scroll scrollbar-hide"
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <p className="text-lg font-bold mb-4">{modalContent}</p>
            <div className="">
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
                <div className="flex flex-col gap-2 justify-end">
                    <span>Bags Count</span>
                    <Input
                        value={bagsCount}
                        className="w-3/4 rounded-xl"
                        placeholder="Enter Bags Count"
                        onChange={(e) => setBagsCount(e.target.value)}
                    />
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

type props2 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    handlePartnerSelect: any
    partner: any
    status: any
    isButtonClick?: any
    binNumber: string
    setBinNumber: (x: string) => void
}

export const CustomModal2: React.FC<props2> = ({
    isModalOpen,
    handlePack,
    handleClose,
    modalContent,
    status,
    handlePartnerSelect,
    partner,
    isButtonClick,
    binNumber,
    setBinNumber,
}) => {
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
                disabled: !binNumber,
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
            <div
                className="flex flex-col items-center justify-center min-w-[22rem] px-6 py-8 
                bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl"
            >
                <p className="mb-6 text-xl font-semibold text-gray-800 text-center">{modalContent}</p>
                <span className="mb-8 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700 shadow-sm">
                    Delivery Partner
                </span>
                <label className="mb-6 flex w-full flex-col items-start gap-2">
                    <span className="text-sm font-medium text-gray-700">Bin Number</span>
                    <Input
                        value={binNumber}
                        placeholder="Enter Bin Number"
                        className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-2 text-base
                        shadow-inner transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={(e) => setBinNumber(e.target.value)}
                    />
                </label>
                <div className="flex w-full flex-col items-center gap-4">
                    <span className="text-base font-semibold text-gray-800">Select Delivery Partner</span>

                    <Dropdown
                        className="relative w-full rounded-xl bg-gray-50 text-gray-900 shadow-sm
                 transition focus-within:ring-2 focus-within:ring-indigo-400"
                        title={partner || 'SELECT_PARTNER'}
                        onSelect={handlePartnerSelect}
                    >
                        <div className="max-h-64 overflow-y-auto rounded-xl bg-white/90 shadow-md">
                            {LOGISTIC_PARTNER?.map(({ value, label }) => (
                                <DropdownItem
                                    key={value}
                                    eventKey={value}
                                    className="block px-4 py-2 text-left text-sm font-medium text-gray-800 
                       transition hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100"
                                >
                                    {label}
                                </DropdownItem>
                            ))}
                        </div>
                    </Dropdown>
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
