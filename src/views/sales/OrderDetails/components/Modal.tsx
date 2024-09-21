import React from 'react'
import { Modal, Select } from 'antd'
import { Product } from './Activity'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown } from '@/components/ui'

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
}) => {
    return (
        <Modal
            title=""
            okText={status === 'PENDING' ? 'ACCEPT & PACK' : 'PACKED'}
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
                onClick: status === 'PENDING' ? handleReject : handleCancel,
            }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p className="text-lg font-semibold mb-4">{modalContent}</p>
            <div className="flex flex-col gap-2 mb-4">
                <h1 className="text-[20px] font-semibold">
                    Invoice Id: <span className="font-normal">{invoice_id}</span>
                </h1>
                <h1 className="text-[16px] font-semibold">
                    Total Amount: <span className="font-normal">Rs.{payment?.amount}</span>
                </h1>
            </div>
            {product && product.length > 0 && (
                <table className="w-full text-left border-t">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 font-semibold">SKU</th>
                            <th className="px-4 py-2 font-semibold">PRODUCT IMAGE</th>
                            <th className="px-4 py-2 font-semibold">PRODUCT NAME</th>
                            <th className="px-4 py-2 font-semibold">ORDERED QTY</th>
                            <th className="px-4 py-2 font-semibold">FULFILLED QTY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((pdts) => (
                            <tr key={pdts.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{pdts.sku}</td>
                                <td className="px-4 py-2">
                                    <img src={pdts.image.split(',')[0]} alt="" className="w-20 h-20 object-cover rounded" />
                                </td>
                                <td className="px-4 py-2">{pdts.name}</td>
                                <td className="px-4 py-2">{pdts.quantity}</td>
                                <td className="px-4 py-2">
                                    <Select
                                        value={fulfilledQuantities[pdts.id] || 0}
                                        className="w-full"
                                        onChange={(value: any) => handleSelectChange(pdts.id, value)}
                                    >
                                        {Array.from(
                                            {
                                                length: parseInt(pdts.quantity, 10) + 1,
                                            },
                                            (_, i) => (
                                                <Option key={i} value={i.toString()}>
                                                    {i}
                                                </Option>
                                            ),
                                        )}
                                    </Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            okText={status === 'PENDING' ? 'ACCEPT & PACK' : 'PACKED'}
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
                    <div className="text-center text-lg font-bold text-green-600">MARKED AS PACKED</div>
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
            okText={status === 'PENDING' ? 'ACCEPT & PACK' : 'SHIPPED'}
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
            <h1 className="text-center text-lg font-bold text-green-600">MARKED AS SHIPPED</h1>
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
            title=""
            okText={status === 'PENDING' ? 'ACCEPT & PACK' : 'DELIVERED'}
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
            <h1 className="text-center text-lg font-bold text-green-600">MARK AS DELIVERED</h1>
        </Modal>
    )
}
