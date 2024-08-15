import React from 'react'
import { Modal, Select } from 'antd'
import { Product } from './Activity'

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
                    Invoice Id:{' '}
                    <span className="font-normal">{invoice_id}</span>
                </h1>
                <h1 className="text-[16px] font-semibold">
                    Total Amount:{' '}
                    <span className="font-normal">Rs.{payment?.amount}</span>
                </h1>
            </div>
            {product && product.length > 0 && (
                <table className="w-full text-left border-t">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 font-semibold">SKU</th>
                            <th className="px-4 py-2 font-semibold">
                                PRODUCT IMAGE
                            </th>
                            <th className="px-4 py-2 font-semibold">
                                PRODUCT NAME
                            </th>
                            <th className="px-4 py-2 font-semibold">
                                ORDERED QTY
                            </th>
                            <th className="px-4 py-2 font-semibold">
                                FULFILLED QTY
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((pdts) => (
                            <tr
                                key={pdts.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-2">{pdts.sku}</td>
                                <td className="px-4 py-2">
                                    <img
                                        src={pdts.image.split(',')[0]}
                                        alt=""
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                </td>
                                <td className="px-4 py-2">{pdts.name}</td>
                                <td className="px-4 py-2">{pdts.quantity}</td>
                                <td className="px-4 py-2">
                                    <Select
                                        value={
                                            fulfilledQuantities[pdts.id] || 0
                                        }
                                        className="w-full"
                                        onChange={(value: any) =>
                                            handleSelectChange(pdts.id, value)
                                        }
                                    >
                                        {Array.from(
                                            {
                                                length:
                                                    parseInt(
                                                        pdts.quantity,
                                                        10,
                                                    ) + 1,
                                            },
                                            (_, i) => (
                                                <Option
                                                    key={i}
                                                    value={i.toString()}
                                                >
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
            {errorMessage && (
                <div className="text-red-500 mt-4 text-center">
                    {errorMessage}
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
    status: string
}

export const CustomModal2: React.FC<props2> = ({
    isModalOpen,
    handlePack,
    handleClose,
    modalContent,
    status,
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
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p className="text-lg font-semibold mb-4">{modalContent}</p>
            <h1 className="text-center text-lg font-bold text-green-600">
                MARKED AS PACKED
            </h1>
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

export const CustomModal3: React.FC<props3> = ({
    isModalOpen,
    handlePack,
    handleClose,
    modalContent,
    status,
}) => {
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
            <h1 className="text-center text-lg font-bold text-green-600">
                MARKED AS SHIPPED
            </h1>
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

export const CustomModal4: React.FC<props4> = ({
    isModalOpen,
    handlePack,
    handleClose,
    modalContent,
    status,
}) => {
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
            <h1 className="text-center text-lg font-bold text-green-600">
                MARK AS DELIVERED
            </h1>
        </Modal>
    )
}
