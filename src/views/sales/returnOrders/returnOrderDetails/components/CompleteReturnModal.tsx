/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Modal } from 'antd'
import CancelItemSelect from '@/common/CancelItemSelect'

interface ReturnItem {
    order_item: number
    quantity: number
    location: string
    product?: {
        sku: string
    }
}

interface Props {
    isModalOpen: boolean
    setIsModalOpen: (val: boolean) => void
    handleAction: (action: string, locationWiseDetails: any) => void
    valueInsideModal: { refundAmount: string; refundId: string }
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isCompleting: boolean
    orderItems: ReturnItem['order_item']
}

const CompleteReturnModal: React.FC<Props> = ({
    isModalOpen,
    setIsModalOpen,
    handleAction,
    valueInsideModal,
    handleInputChange,
    isCompleting,
    orderItems,
}) => {
    const [payload, setPayload] = useState<Record<string, Record<string, number>>>()

    return (
        <Modal
            open={isModalOpen}
            okText={'Return Order'}
            width={1200}
            okButtonProps={{
                disabled: isCompleting,
                loading: isCompleting,
            }}
            height={1200}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => handleAction('return_completed', payload)}
        >
            <div>Locations</div>

            <CancelItemSelect orderItems={orderItems as any} payload={payload} setPayload={setPayload} />
            <div className="mt-10 font-semibold">Refund Details</div>
            <div className="italic text-lg flex flex-row items-center justify-start gap-5 mt-6">
                <input
                    type="text"
                    name="refundAmount"
                    value={valueInsideModal.refundAmount}
                    placeholder="Enter Refund Amount"
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="refundId"
                    value={valueInsideModal.refundId}
                    placeholder="Enter Refund Id"
                    onChange={handleInputChange}
                />
            </div>
        </Modal>
    )
}

export default CompleteReturnModal
