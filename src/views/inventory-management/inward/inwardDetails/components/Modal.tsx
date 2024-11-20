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
}) => {
    return (
        <Modal
            title=""
            okText={status === 'PENDING' ? 'ACCEPT & PACK' : 'PACKED'}
            cancelText={status === 'PENDING' ? 'REJECT ORDERS' : 'CANCEL'}
            width={800}
            height={800}
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '15px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: 'gray',
                    color: 'white',
                    borderRadius: '15px',
                },
            }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p>{modalContent}</p>
            <div className="flex flex-col">
                <h1 className="text-[20px]">
                    Invoice Id: <span className="font-normal">{invoice_id}</span>
                </h1>
                <h1 className="text-[16px]">
                    Total Amount: <span className="font-normal">Rs.{payment?.amount}</span>
                </h1>
            </div>
            {product && product.length > 0 && (
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">SKU</th>
                            <th className="px-4 py-2">PRODUCT IMAGE</th>
                            <th className="px-4 py-2">PRODUCT NAME</th>
                            <th className="px-4 py-2">ORDERED QTY</th>
                            <th className="px-4 py-2">FULFILLED QTY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((pdts) => (
                            <tr key={pdts.id} className="border-t">
                                <td className="px-4 py-2">{pdts.sku}</td>
                                <td className="px-4 py-2">
                                    <img src={pdts.image} alt="" className="w-20 h-30 object-cover" />
                                </td>
                                <td className="px-4 py-2">{pdts.name}</td>
                                <td className="px-4 py-2">{pdts.quantity}</td>
                                <td className="px-4 py-2">
                                    <Select
                                        value={fulfilledQuantities[pdts.id] || 0}
                                        className="w-full"
                                        onChange={(value) => handleSelectChange(pdts.id, value)}
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
            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
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
            title=""
            okText={status === 'PENDING' ? 'ACCEPT & PACK' : 'PACKED'}
            cancelText={status === 'PENDING' ? 'REJECT ORDERS' : 'CANCEL'}
            width={800}
            height={800}
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '15px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: 'gray',
                    color: 'white',
                    borderRadius: '15px',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p>{modalContent}</p>

            <h1>MARKED AS PACKED</h1>
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
            height={800}
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '15px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: 'gray',
                    color: 'white',
                    borderRadius: '15px',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p>{modalContent}</p>

            <h1>MARKED AS SHIPPED</h1>
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
            height={800}
            okButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '15px',
                },
            }}
            cancelButtonProps={{
                className: 'font-bold',
                style: {
                    backgroundColor: 'gray',
                    color: 'white',
                    borderRadius: '15px',
                },
            }}
            open={isModalOpen}
            onOk={handlePack}
            onCancel={handleClose}
        >
            <p>{modalContent}</p>

            <h1>MARK AS DELIVERED</h1>
        </Modal>
    )
}
