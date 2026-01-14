/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Modal, Select } from 'antd'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Input } from '@/components/ui'
import { LOGISTIC_PARTNER } from './activityCommon'
import { FaRupeeSign, FaCamera, FaTimes, FaTrashAlt, FaBoxOpen, FaReceipt, FaWallet, FaTag } from 'react-icons/fa'
import { IoBagOutline } from 'react-icons/io5'
import { MdPhotoCamera, MdInventory, MdLocalShipping, MdInfoOutline } from 'react-icons/md'
import { BsBoxSeam } from 'react-icons/bs'
import { Order } from '@/store/types/newOrderTypes'
import { EOrderStatus } from '../orderList.common'

const { Option } = Select

type Props = {
    isModalOpen: boolean
    handleOk: () => void
    handleCancel: () => void
    modalContent?: string
    status: string
    invoice_id?: string
    payment?: Order['payment']
    product?: Order['order_items']
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
    setIsPhotoCamera: (x: boolean) => void
    setCurrentId: (x: number) => void
    storePhoto: {
        [key: number]: string[]
    }
    setStorePhoto: React.Dispatch<
        React.SetStateAction<{
            [key: number]: string[]
        }>
    >
    handleSetPhoto: (id: number, images: string[]) => Promise<void>
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
    setCurrentId,
    setIsPhotoCamera,
    storePhoto,
    setStorePhoto,
    handleSetPhoto,
}) => {
    return (
        <Modal
            title={
                <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FaBoxOpen className="text-blue-600 text-xl" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Order Packing</h2>
                    </div>
                    <div className="flex xl:flex-row gap-3 p-5 flex-col">
                        <button
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white shadow-sm hover:shadow"
                            onClick={status === EOrderStatus.accepted || status === EOrderStatus.picking ? handleReject : handleCancel}
                        >
                            {status === EOrderStatus.accepted || status === EOrderStatus.picking ? (
                                <>
                                    <FaTimes className="text-sm" />
                                    REJECT ORDERS
                                </>
                            ) : (
                                <>
                                    <FaTimes className="text-sm" />
                                    CANCEL
                                </>
                            )}
                        </button>
                        <button
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                                isButtonClick ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                            } text-white shadow-sm hover:shadow`}
                            disabled={isButtonClick}
                            onClick={handleOk}
                        >
                            {isButtonClick ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    PACKING...
                                </>
                            ) : (
                                <>
                                    <IoBagOutline className="text-lg" />
                                    PACK ORDER
                                </>
                            )}
                        </button>
                    </div>
                </div>
            }
            footer={null}
            width={1200}
            className="custom-modal max-w-[95vw]"
            open={isModalOpen}
            onCancel={handleCancel}
            style={{
                top: '10vh',
                maxHeight: '80vh',
            }}
            styles={{
                body: {
                    maxHeight: 'calc(80vh - 130px)',
                    overflow: 'auto',
                    padding: '24px',
                },
                content: {
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <div className="flex-1">
                <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-700 mb-2">{modalContent}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Invoice Card */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <FaReceipt className="text-red-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-600">Invoice ID</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-lg font-bold text-gray-900">#{invoice_id}</span>
                                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amount Card */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-2 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FaWallet className="text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-600">Total Amount</div>
                                    <div className="flex items-center mt-1">
                                        <FaRupeeSign className="text-green-700 text-lg" />
                                        <span className="text-2xl font-bold text-gray-900 ml-1">{payment?.amount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bags Count Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-2 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <IoBagOutline className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bags Count</label>
                                    <Input
                                        value={bagsCount}
                                        className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 text-lg"
                                        placeholder="Enter number of bags"
                                        onChange={(e) => setBagsCount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center justify-center gap-2 text-red-700 font-semibold">
                            <FaTimes />
                            {errorMessage}
                        </div>
                    </div>
                )}
                {/* Products List */}
                {product && product.length > 0 && (
                    <div className="space-y-4 overflow-y-auto pr-2">
                        {product?.map((pdts) => (
                            <div
                                key={pdts.id}
                                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="lg:w-1/6">
                                            <div className="relative w-full h-48 lg:h-full rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={pdts.image.split(',')[0]}
                                                    alt={pdts.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                                    Qty: {pdts.quantity}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="lg:w-5/6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {/* Product Info */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <FaTag className="text-gray-400" />
                                                        <span className="font-semibold text-lg text-gray-900">{pdts.brand}</span>
                                                    </div>
                                                    <h3 className="text-gray-800 font-medium line-clamp-2">{pdts.name}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="bg-gray-100 px-3 py-1 rounded-lg">SKU: {pdts.sku}</span>
                                                        <span className="flex items-center gap-1">
                                                            <MdInventory className="text-blue-500" />
                                                            Loc: {pdts.location}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Quantity Selection */}
                                                {pdts?.location &&
                                                    (!pdts?.location_details ||
                                                        Object.keys(pdts.location_details).length === 0 ||
                                                        Object.values(pdts.location_details).reduce((sum, qty) => sum + qty, 0) <
                                                            parseInt(pdts.quantity)) && (
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-sm font-medium text-gray-700">Fulfilled Quantity</label>
                                                            <Select
                                                                value={fulfilledQuantities[pdts.id] || 0}
                                                                className="w-full max-w-[200px]"
                                                                size="large"
                                                                onChange={(value: any) => handleSelectChange(pdts.id, value)}
                                                            >
                                                                {Array.from({ length: parseInt(pdts.quantity, 10) + 1 }, (_, i) => (
                                                                    <Option key={i} value={i.toString()}>
                                                                        {i} unit{i !== 1 ? 's' : ''}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    )}
                                            </div>

                                            {/* Location Selection */}
                                            {pdts.location_details &&
                                                Object.keys(pdts.location_details).length > 0 &&
                                                Object.values(pdts.location_details).reduce((sum, qty) => sum + qty, 0) >=
                                                    parseInt(pdts.quantity) && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <MdInventory className="text-blue-500 text-lg" />
                                                            <h4 className="font-semibold text-gray-800">Select Locations</h4>
                                                        </div>

                                                        {/* Location Tags */}
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {Object.entries(pdts.location_details)?.map(([location, qty], index) => (
                                                                <button
                                                                    key={index}
                                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-medium transition-colors duration-200"
                                                                    onClick={() =>
                                                                        handleLocationClick(pdts.id, location, qty, pdts.quantity)
                                                                    }
                                                                >
                                                                    <span>{location}</span>
                                                                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                                        {qty}
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {/* Selected Locations */}
                                                        {selectedLocations[pdts?.id] && (
                                                            <div className="mt-3">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {Object.entries(selectedLocations[pdts.id]).map(([loc, count]) => (
                                                                        <div
                                                                            key={loc}
                                                                            className="flex items-center gap-2 bg-green-50 text-green-800 px-3 py-2 rounded-lg border border-green-200"
                                                                        >
                                                                            <span className="font-medium">{loc}</span>
                                                                            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                                                                                {count}
                                                                            </span>
                                                                            <button
                                                                                className="text-red-500 hover:text-red-700 transition-colors ml-2"
                                                                                onClick={() => handleRemoveLocation(pdts.id, loc)}
                                                                            >
                                                                                <FaTrashAlt className="text-sm" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            {/* Photo Section */}
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
                                                            onClick={() => {
                                                                setIsPhotoCamera(true)
                                                                setCurrentId(pdts?.id)
                                                            }}
                                                        >
                                                            <MdPhotoCamera className="text-lg" />
                                                            Take Photo
                                                        </button>

                                                        {!!storePhoto[pdts?.id]?.length && (
                                                            <button
                                                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
                                                                onClick={() => handleSetPhoto(pdts?.id, storePhoto[pdts?.id])}
                                                            >
                                                                <FaCamera className="text-sm" />
                                                                Save Photo ({storePhoto[pdts?.id]?.length})
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Photo Previews */}
                                                    {storePhoto[pdts?.id]?.length > 0 && (
                                                        <div className="flex flex-wrap gap-3">
                                                            {storePhoto[pdts?.id]?.map((img, index) => (
                                                                <div key={index} className="relative group">
                                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200 bg-gray-50">
                                                                        <img
                                                                            src={img}
                                                                            alt={`Captured ${index + 1}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            setStorePhoto((prev) => ({
                                                                                ...prev,
                                                                                [pdts.id]: prev[pdts.id].filter((_, i) => i !== index),
                                                                            }))
                                                                        }}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                                                                    >
                                                                        <FaTimes className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
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
