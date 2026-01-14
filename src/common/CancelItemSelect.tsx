/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import React, { useState, useEffect } from 'react'
import { FaCheckCircle, FaTimesCircle, FaTools, FaTrash } from 'react-icons/fa'
import CommonAccordion from './CommonAccordion'

interface OrderItems {
    product: {
        image: string
        size: string
        sku: string
    }
    quantity: string
    order_item: string
}

interface Props {
    orderItems: OrderItems[]
    payload: Record<string, Record<string, number>> | undefined
    setPayload: (x: any) => void
}

interface ItemStatus {
    qc_passed: boolean
    qc_failed: boolean
    refurbished: boolean
}

const CancelItemSelect: React.FC<Props> = ({ orderItems, payload, setPayload }) => {
    const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus[]>>({})

    useEffect(() => {
        if (!Array.isArray(orderItems)) {
            setItemStatuses({})
            return
        }
        const initial: Record<string, ItemStatus[]> = {}
        orderItems.forEach((item) => {
            if (!item?.order_item) return
            const qty = Math.max(Number(item.quantity) || 1, 1)
            const existing = payload ? payload[item.order_item] : {}
            initial[item.order_item] = Array.from({ length: qty }, (_, i) => ({
                qc_passed: i < (existing?.qc_passed ?? 0),
                qc_failed: i < (existing?.qc_failed ?? 0),
                refurbished: i < (existing?.refurbished ?? 0),
            }))
        })

        setItemStatuses(initial)
    }, [orderItems, payload])

    const handleRadioChange = (orderItemId: string, itemIndex: number, statusType: 'qc_passed' | 'qc_failed' | 'refurbished') => {
        setItemStatuses((prev) => {
            const updatedStatuses = { ...prev }
            if (!updatedStatuses[orderItemId] || !updatedStatuses[orderItemId][itemIndex]) {
                return prev
            }
            updatedStatuses[orderItemId][itemIndex] = {
                qc_passed: statusType === 'qc_passed',
                qc_failed: statusType === 'qc_failed',
                refurbished: statusType === 'refurbished',
            }

            return updatedStatuses
        })
    }

    const handleSetData = () => {
        const newPayload: Record<string, Record<string, number>> = { ...payload }
        Object.entries(itemStatuses).forEach(([orderItemId, statusArray]) => {
            if (!statusArray || !Array.isArray(statusArray)) {
                return
            }
            const counts = {
                qc_passed: 0,
                qc_failed: 0,
                refurbished: 0,
            }

            statusArray.forEach((status) => {
                if (status?.qc_passed) counts.qc_passed++
                if (status?.qc_failed) counts.qc_failed++
                if (status?.refurbished) counts.refurbished++
            })

            const existingData = payload ? payload[orderItemId] : {}

            if (existingData) {
                counts.qc_passed += existingData.qc_passed || 0
                counts.qc_failed += existingData.qc_failed || 0
                counts.refurbished += existingData.refurbished || 0
            }

            newPayload[orderItemId] = counts
        })

        setPayload(newPayload)
    }

    const handleClearItem = (orderItemId: string) => {
        setItemStatuses((prev) => {
            const updated = { ...prev }

            if (!updated[orderItemId]) return prev

            updated[orderItemId] = updated[orderItemId].map(() => ({
                qc_passed: false,
                qc_failed: false,
                refurbished: false,
            }))

            return updated
        })

        setPayload((prev: any) => {
            if (!prev) return prev

            const updatedPayload = { ...prev }
            delete updatedPayload[orderItemId]

            return updatedPayload
        })
    }

    const handleClearData = () => {
        const clearedStatuses: Record<string, ItemStatus[]> = {}
        const clearedPayload: Record<string, Record<string, number>> = {}

        orderItems.forEach((item) => {
            if (!item?.order_item) return

            const qty = Math.max(Number(item.quantity) || 1, 1)

            clearedStatuses[item.order_item] = Array.from({ length: qty }, () => ({
                qc_passed: false,
                qc_failed: false,
                refurbished: false,
            }))

            clearedPayload[item.order_item] = {
                qc_passed: 0,
                qc_failed: 0,
                refurbished: 0,
            }
        })

        setItemStatuses({})
        setPayload(null)
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">No order items to display</p>
            </div>
        )
    }

    return (
        <div className="space-y-3 max-h-[calc(80vh-200px)] overflow-y-auto p-2">
            <div className="sticky top-0 bg-white z-10 pb-2 border-b">
                <h2 className="text-lg font-bold text-gray-800">Items</h2>
                <p className="text-xs text-gray-500 mt-1">Select status for each item quantity</p>
            </div>

            {orderItems?.map((item, index) => {
                if (!item) return null
                const quantity = parseInt(item.quantity) || 1
                const itemStatusArray = itemStatuses[item.order_item] || []

                return (
                    <div key={`${item.order_item}-${index}`} className="overflow-y-scroll">
                        <CommonAccordion header={`Item - ${item.order_item}`}>
                            <div className="border rounded-lg p-3 bg-white shadow-xs hover:shadow-sm transition-shadow">
                                <div className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.sku || 'Product image'}
                                            className="w-10 h-10 object-cover rounded border"
                                            onError={(e) => {
                                                ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Img'
                                            }}
                                        />
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-sm truncate">SKU: {item.product?.sku || 'N/A'}</h3>
                                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                                <span>Size: {item.product?.size || 'N/A'}</span>
                                                <span>•</span>
                                                <span>Qty: {item.quantity || '1'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end" onClick={() => handleClearItem(item.order_item)}>
                                        <FaTrash />
                                    </div>
                                </div>
                                {
                                    <div className="mt-3 pt-3 border-t space-y-2">
                                        <div className="grid grid-cols-3 gap-2 mb-2">
                                            <div className="text-xs font-medium text-gray-500 text-center">Item</div>
                                            <div className="text-xs font-medium text-gray-500 text-center">Status</div>
                                            <div className="text-xs font-medium text-gray-500 text-center">Actions Select</div>
                                        </div>

                                        {Array.from({ length: quantity }).map((_, index) => {
                                            const itemStatus = itemStatusArray[index]
                                            return (
                                                <div
                                                    key={index}
                                                    className="grid grid-cols-3 gap-2 items-center p-2 hover:bg-gray-50 rounded"
                                                >
                                                    <div className="text-sm font-medium">Item {index + 1}</div>

                                                    <div className="flex justify-center">
                                                        {itemStatus?.qc_passed && (
                                                            <div className="flex items-center space-x-1 text-green-600 text-xs">
                                                                <FaCheckCircle size={12} />
                                                                <span>Passed</span>
                                                            </div>
                                                        )}
                                                        {itemStatus?.qc_failed && (
                                                            <div className="flex items-center space-x-1 text-red-600 text-xs">
                                                                <FaTimesCircle size={12} />
                                                                <span>Failed</span>
                                                            </div>
                                                        )}
                                                        {itemStatus?.refurbished && (
                                                            <div className="flex items-center space-x-1 text-blue-600 text-xs">
                                                                <FaTools size={12} />
                                                                <span>Refurbished</span>
                                                            </div>
                                                        )}
                                                        {!itemStatus?.qc_passed && !itemStatus?.qc_failed && !itemStatus?.refurbished && (
                                                            <span className="text-gray-400 text-xs">Not set</span>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-center space-x-3">
                                                        <div className="flex flex-col items-center space-x-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleRadioChange(item.order_item, index, 'qc_passed')
                                                                }}
                                                                className={`p-1.5 rounded ${itemStatus?.qc_passed ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                                                                title="QC Passed"
                                                            >
                                                                <FaCheckCircle size={20} />
                                                            </button>
                                                            <span>Qc_Passed</span>
                                                        </div>

                                                        <div className="flex flex-col items-center space-x-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleRadioChange(item.order_item, index, 'qc_failed')
                                                                }}
                                                                className={`p-1.5 rounded ${itemStatus?.qc_failed ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`}
                                                                title="QC Failed"
                                                            >
                                                                <FaTimesCircle size={20} />
                                                            </button>
                                                            <span>Qc_Failed</span>
                                                        </div>

                                                        <div className="flex flex-col items-center space-x-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleRadioChange(item.order_item, index, 'refurbished')
                                                                }}
                                                                className={`p-1.5 rounded ${itemStatus?.refurbished ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                                                                title="Refurbished"
                                                            >
                                                                <FaTools size={20} />
                                                            </button>
                                                            <span>Refurbished</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        </CommonAccordion>
                    </div>
                )
            })}

            <div className="sticky bottom-0 bg-white pt-3 mt-2 border-t flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Button variant="blue" size="sm" onClick={handleSetData}>
                        Save Status Data
                    </Button>
                    <Button variant="reject" size="sm" onClick={handleClearData}>
                        Clear All Data
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CancelItemSelect
