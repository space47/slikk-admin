/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Modal, Select } from 'antd'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Input } from '@/components/ui'
import { FaRupeeSign, FaTrash } from 'react-icons/fa'
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
    handleLocationClick: any
    selectedLocations: { [productId: number]: { [location: string]: number } }
    handleRemoveLocation: (productId: number, location: string) => void
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
    handleLocationClick,
    selectedLocations,
    handleRemoveLocation,
}) => {
    return (
        <Modal
            title={
                <div className="flex justify-center items-center px-4 py-2 bg-gray-100 rounded-t-md">
                    <div className="flex gap-2">
                        <button
                            className="font-bold px-4 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white"
                            onClick={status === 'ACCEPTED' ? handleReject : handleCancel}
                        >
                            {status === 'ACCEPTED' ? 'REJECT ORDERS' : 'CANCEL'}
                        </button>
                        <button
                            className={`font-bold px-4 py-1 rounded-md text-white ${
                                isButtonClick ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
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
            className="custom-modal"
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <p className="text-lg font-bold mb-4">{modalContent}</p>

            <div className="flex flex-col gap-4 mb-6 bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center text-[18px] font-semibold gap-2">
                    <span>Invoice Id:</span>
                    <span className="text-white bg-red-600 px-3 py-1 rounded-full font-semibold">{invoice_id}</span>
                </div>
                <div className="flex items-center text-[16px] font-semibold">
                    <span>Total Amount:</span>
                    <div className="flex items-center ml-2">
                        <FaRupeeSign className="text-green-600" />
                        <span className="ml-1 font-normal text-gray-700">{payment?.amount}</span>
                    </div>
                </div>
            </div>
            {errorMessage && <div className="text-red-500 mt-4 text-center font-semibold">{errorMessage}</div>}

            <div className="mb-6">
                <label className="block font-semibold mb-2">Bags Count</label>
                <Input
                    value={bagsCount}
                    className="w-1/2 rounded-xl border-gray-300"
                    placeholder="Enter Bags Count"
                    onChange={(e) => setBagsCount(e.target.value)}
                />
            </div>

            {product && product.length > 0 && (
                <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[300px] pr-2">
                    {product?.map((pdts) => (
                        <div
                            key={pdts.id}
                            className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow gap-6"
                        >
                            <div className="flex-shrink-0">
                                <img src={pdts.image.split(',')[0]} alt={pdts.name} className="w-28 h-40 object-cover rounded-lg" />
                            </div>
                            <div className="w-full">
                                <div className="font-semibold text-lg">{pdts.brand}</div>
                                <div className="text-gray-600 text-md truncate">{pdts.name}</div>
                                <div className="text-gray-800 text-sm mb-2">{pdts.sku}</div>
                                <div className="text-gray-800 text-sm mb-2">Loc:{pdts.location}</div>
                                <div className="text-gray-800 text-sm mb-2">Quantity:{pdts.quantity}</div>
                                {pdts?.location && pdts?.location_details && Object.keys(pdts?.location_details).length <= 0 && (
                                    <div className="flex flex-wrap gap-4 items-center text-md">
                                        <div className="flex items-center">
                                            <span>Fulfilled Qty:</span>
                                            <Select
                                                value={fulfilledQuantities[pdts.id] || 0}
                                                className="ml-2 w-20 h-8"
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
                                )}
                                {pdts.location_details && Object.keys(pdts.location_details).length > 0 && (
                                    <div>
                                        <div className="flex gap-10 text-md">
                                            <div className="font-semibold mt-2">Select Location:</div>
                                            <div className="flex gap-2 flex-wrap mt-1">
                                                {Object.entries(pdts.location_details)?.map(([location, qty], index) => (
                                                    <span
                                                        key={index}
                                                        className="text-white text-md cursor-pointer border px-2 py-1 rounded-md bg-blue-800 hover:bg-blue-400"
                                                        onClick={() => handleLocationClick(pdts.id, location, qty, pdts.quantity)}
                                                    >
                                                        {location} ({qty})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {selectedLocations[pdts?.id] && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {Object.entries(selectedLocations[pdts.id]).map(([loc, count]) => (
                                                    <div
                                                        key={loc}
                                                        className="bg-green-100 text-blue-800 px-2 py-1 rounded-xl flex items-center gap-2"
                                                    >
                                                        <span>
                                                            {loc}: {count}
                                                        </span>
                                                        <button
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => handleRemoveLocation(pdts.id, loc)}
                                                        >
                                                            <FaTrash className="text-xl font-bold " />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
                className="flex flex-col items-center justify-center min-w-[18rem] px-6 py-8 
                bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl"
            >
                <p className="mb-6 text-xl font-semibold text-gray-800 text-center">{modalContent}</p>
                <span className="mb-8 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700 shadow-sm">
                    Delivery Partner
                </span>
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

interface props {
    isOpen: boolean
    handleOk: any
    onClose: any
    title: string
    desc: string
    text: string
    isRto?: boolean
}

export const RejectModal = ({ handleOk, isOpen, onClose, text, desc, title }: props) => {
    return (
        <Modal
            title=""
            open={isOpen}
            okText={text}
            cancelText="CANCEL"
            okButtonProps={{
                style: {
                    backgroundColor: '#D32F2F',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                },
            }}
            onOk={handleOk}
            onCancel={onClose}
        >
            <h1 className="text-center text-lg font-bold text-red-600">{title}</h1>
            <p className="text-center text-xl font-semibold mb-10">{desc}</p>
        </Modal>
    )
}
