/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Modal } from 'antd'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Input } from '@/components/ui'
import { LOGISTIC_PARTNER } from './activityCommon'
import { MdLocalShipping, MdInfoOutline } from 'react-icons/md'
import { BsBoxSeam } from 'react-icons/bs'
import { EOrderStatus } from '../orderList.common'

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
            title={
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <MdLocalShipping className="text-blue-600 text-xl" />
                    Assign Delivery Partner
                </div>
            }
            okText={isButtonClick ? 'SETTING PARTNER...' : 'SELECT PARTNER'}
            cancelText={status === EOrderStatus.pending ? 'REJECT ORDERS' : 'CANCEL'}
            width={800}
            className="custom-modal"
            centered
            okButtonProps={{
                className: 'font-semibold h-10 px-6',
                style: {
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                },
                disabled: !binNumber,
            }}
            cancelButtonProps={{
                className: 'font-semibold h-10 px-6',
                style: {
                    backgroundColor: '#6B7280',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <div className="w-full max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm p-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <BsBoxSeam className="text-2xl text-blue-600" />
                    </div>

                    <p className="text-xl font-semibold text-gray-900">{modalContent}</p>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5">
                        <MdInfoOutline className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">Delivery Partner Required</span>
                    </div>
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Delivery Partner */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            Select Delivery Partner
                            <MdLocalShipping className="text-lg text-gray-500" />
                        </label>

                        <Dropdown
                            className="w-full"
                            title={
                                (
                                    <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                                        <span className={`text-sm ${partner ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {partner || 'Select a delivery partner'}
                                        </span>
                                    </div>
                                ) as any
                            }
                            onSelect={handlePartnerSelect}
                        >
                            <div className="mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                                {LOGISTIC_PARTNER?.map(({ value, label }) => (
                                    <DropdownItem
                                        key={value}
                                        eventKey={value}
                                        className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 transition
                                       hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        {label}
                                    </DropdownItem>
                                ))}
                            </div>
                        </Dropdown>
                    </div>

                    {/* Bin Number */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Bin Number</label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <BsBoxSeam />
                            </span>

                            <Input
                                value={binNumber}
                                placeholder="BIN-12345"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-11
                               text-sm shadow-sm transition
                               focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                onChange={(e) => setBinNumber(e.target.value)}
                            />
                        </div>

                        <p className="mt-2 text-xs text-gray-500">Enter the unique bin number assigned for this delivery</p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-10 border-t border-gray-200 pt-6">
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                        <MdInfoOutline className="mt-0.5 text-gray-400" />
                        <p>Please verify the delivery partner and bin number carefully before proceeding.</p>
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
    isButtonClick?: boolean
}

export const CustomModal3: React.FC<props3> = ({ isModalOpen, handlePack, handleClose, modalContent, status, isButtonClick }) => {
    return (
        <Modal
            title=""
            okText={status === EOrderStatus.pending ? 'ACCEPT & PACK' : 'SELECT'}
            cancelText={status === EOrderStatus.pending ? 'REJECT ORDERS' : 'CANCEL'}
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
            confirmLoading={isButtonClick}
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
            cancelText={status === EOrderStatus.pending ? 'REJECT ORDERS' : 'CANCEL'}
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
            cancelText={status === EOrderStatus.pending ? 'CANCEL' : 'CANCEL'}
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
            cancelText={status === EOrderStatus.pending ? 'CANCEL' : 'CANCEL'}
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
