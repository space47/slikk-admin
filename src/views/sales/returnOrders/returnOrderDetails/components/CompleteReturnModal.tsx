/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd'

interface ReturnItem {
    order_item: number
    quantity: number
    location: string
    product?: {
        sku: string
    }
}

interface LocationDetail {
    location: string
    quantity: number
    product?: {
        sku: string
    }
}

interface Props {
    returnOrderItems: ReturnItem[]
    isModalOpen: boolean
    setIsModalOpen: (val: boolean) => void
    handleAction: (action: string, locationWiseDetails: any) => void
    valueInsideModal: { refundAmount: string; refundId: string }
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isCompleting: boolean
}

const CompleteReturnModal: React.FC<Props> = ({
    returnOrderItems,
    isModalOpen,
    setIsModalOpen,
    handleAction,
    valueInsideModal,
    handleInputChange,
    isCompleting,
}) => {
    const [locationWiseDetails, setLocationWiseDetails] = useState<Record<number, LocationDetail[]>>({})
    const [locationStore, setLocationStore] = useState<Record<number, string>>({})

    useEffect(() => {
        returnOrderItems.map((item) => {
            console.log('item', item)
            setLocationStore((prev) => ({ ...prev, [item.order_item]: item.location || '' }))
        })
    }, [isModalOpen])

    useEffect(() => {
        if (isModalOpen) {
            const init: Record<number, LocationDetail[]> = {}
            returnOrderItems.forEach((item) => {
                init[item.order_item] = Array.isArray(locationWiseDetails[item.order_item]) ? locationWiseDetails[item.order_item] : []
            })
            setLocationWiseDetails(init)
        }
    }, [isModalOpen, returnOrderItems])

    const addLocation = (order_item: number, maxQty: number) => {
        const current = Array.isArray(locationWiseDetails[order_item]) ? locationWiseDetails[order_item] : []
        const usedQty = current.reduce((sum, loc) => sum + (Number(loc.quantity) || 0), 0)

        if (usedQty >= maxQty) {
            alert(`You cannot assign more than ${maxQty} units for this item.`)
            return
        }

        setLocationWiseDetails({
            ...locationWiseDetails,
            [order_item]: [...current, { location: '', quantity: 0 }],
        })
    }

    const updateLocationDetail = (order_item: number, index: number, field: keyof LocationDetail, value: string | number) => {
        const updated = [...(Array.isArray(locationWiseDetails[order_item]) ? locationWiseDetails[order_item] : [])]
        updated[index] = { ...updated[index], [field]: value }
        setLocationWiseDetails({
            ...locationWiseDetails,
            [order_item]: updated,
        })
    }

    const removeLocation = (order_item: number, index: number) => {
        const updated = [...(Array.isArray(locationWiseDetails[order_item]) ? locationWiseDetails[order_item] : [])]
        updated.splice(index, 1)
        setLocationWiseDetails({
            ...locationWiseDetails,
            [order_item]: updated,
        })
    }

    return (
        <Modal
            open={isModalOpen}
            okText={'Return Order'}
            width={600}
            okButtonProps={{
                disabled: isCompleting,
                loading: isCompleting,
            }}
            onOk={() => handleAction('return_completed', locationWiseDetails)}
            onCancel={() => setIsModalOpen(false)}
            height={400}
        >
            <div>Locations</div>

            <div className="max-h-50 overflow-y-auto pr-2 bg-blue-50 p-2">
                {returnOrderItems.map((item) => {
                    const assignedQty = (
                        Array.isArray(locationWiseDetails[item.order_item]) ? locationWiseDetails[item.order_item] : []
                    ).reduce((sum, l) => sum + (Number(l.quantity) || 0), 0)

                    const findLocation = locationStore[item.order_item] || ''

                    console.log('findLocation', findLocation)

                    return (
                        <div key={item.order_item} className="mb-4 border p-3 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Order Item: {item.order_item}</span>
                                <Button
                                    type="primary"
                                    size="small"
                                    disabled={assignedQty >= Number(item.quantity)}
                                    onClick={() => addLocation(item.order_item, item.quantity)}
                                >
                                    Add
                                </Button>
                            </div>

                            {(Array.isArray(locationWiseDetails[item.order_item]) ? locationWiseDetails[item.order_item] : []).map(
                                (loc, idx) => (
                                    <div key={idx} className="flex gap-3 mb-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={loc.location}
                                            onChange={(e) => updateLocationDetail(item.order_item, idx, 'location', e.target.value)}
                                            className="border p-1"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            min={0}
                                            max={item.quantity}
                                            value={loc.quantity}
                                            onChange={(e) => updateLocationDetail(item.order_item, idx, 'quantity', Number(e.target.value))}
                                            className="border p-1 w-20"
                                        />
                                        <Button type="default" danger size="small" onClick={() => removeLocation(item.order_item, idx)}>
                                            Remove
                                        </Button>
                                    </div>
                                ),
                            )}
                            <div className="flex flex-col gap-1">
                                <small className="text-gray-500">
                                    Location from which the item picked : <span className="font-bold">{findLocation}</span>
                                </small>
                                <small className="text-gray-500">
                                    Max Qty: {item.quantity} | Assigned: {assignedQty}
                                </small>
                            </div>
                        </div>
                    )
                })}
            </div>
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
