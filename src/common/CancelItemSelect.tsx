/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import React, { useState, useEffect } from 'react'
import { FaCheckCircle, FaTimes, FaTimesCircle } from 'react-icons/fa'
import CommonAccordion from './CommonAccordion'
import { notification, Select } from 'antd'
import { MdIron, MdPhotoCamera } from 'react-icons/md'
import OrderCameraModal from '@/views/sales/OrderDetails/components/OrderCameraModal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'

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
    orderItems: OrderItems[] | undefined
    payload: Record<string, Record<string, number | any>> | undefined
    setPayload: (x: Record<string, Record<string, number | any>> | undefined) => void
}

interface ItemStatus {
    qc_passed: boolean
    qc_failed: boolean
    refurbished: boolean
}

interface QcFailedData {
    image: string
    reason: string
}

const buildInitialStatuses = (orderItems: OrderItems[], payload?: Record<string, Record<string, number | any>> | undefined) => {
    const result: Record<string, ItemStatus[]> = {}
    orderItems.forEach((item) => {
        if (!item?.order_item) return
        const qty = Math.max(Number(item.quantity) || 1, 1)
        const existing = payload?.[item.order_item] ?? {}
        result[item.order_item] = Array.from({ length: qty }, (_, i) => ({
            qc_passed: i < (existing.qc_passed ?? 0),
            qc_failed: i < (existing.qc_failed ?? 0),
            refurbished: i < (existing.refurbished ?? 0),
        }))
    })
    return result
}

const buildFailedData = (orderItems: OrderItems[], payload?: Record<string, Record<string, number | any>> | undefined) => {
    const photos: { [key: string]: { [key: number]: string[] } } = {}
    const reasons: { [key: string]: { [key: number]: string } } = {}

    orderItems?.forEach((item) => {
        const failedData = (payload?.[item.order_item]?.qc_failed_data as QcFailedData[]) || []
        if (!failedData.length) return
        photos[item.order_item] = {}
        reasons[item.order_item] = {}
        failedData.forEach((data, index) => {
            photos[item.order_item][index] = data.image?.split(',').filter(Boolean) ?? []
            reasons[item.order_item][index] = data.reason ?? ''
        })
    })

    return { photos, reasons }
}

const CancelItemSelect: React.FC<Props> = ({ orderItems, payload, setPayload }) => {
    const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus[]>>({})
    const [isPhotoCamera, setIsPhotoCamera] = useState(false)
    const [storePhoto, setStorePhoto] = useState<{ [key: string]: { [key: number]: string[] } }>({})
    const [storeReason, setStoreReason] = useState<{ [key: string]: { [key: number]: string } }>({})
    const [currentCameraItem, setCurrentCameraItem] = useState<{ orderItemId: string; itemIndex: number } | null>(null)
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [reasonsArray] = useState<{ value: string; label: string }[]>([
        { value: 'Qc Failed', label: 'QC Failed' },
        { value: 'Damaged', label: 'Damaged' },
        { value: 'Wrong Item', label: 'Wrong Item' },
        { value: 'Other', label: 'Other' },
    ])

    useEffect(() => {
        if (!Array.isArray(orderItems)) {
            setItemStatuses({})
            return
        }
        setItemStatuses(buildInitialStatuses(orderItems, payload))
        const { photos, reasons } = buildFailedData(orderItems, payload)
        setStorePhoto((prev) => ({ ...prev, ...photos }))
        setStoreReason((prev) => ({ ...prev, ...reasons }))
    }, [orderItems, payload])

    const handleStatusChange = (orderItemId: string, itemIndex: number, statusType: 'qc_passed' | 'qc_failed' | 'refurbished') => {
        setItemStatuses((prev) => {
            const updatedStatuses = { ...prev }
            if (!updatedStatuses[orderItemId]?.[itemIndex]) return prev
            updatedStatuses[orderItemId][itemIndex] = {
                qc_passed: statusType === 'qc_passed',
                qc_failed: statusType === 'qc_failed',
                refurbished: statusType === 'refurbished',
            }
            return updatedStatuses
        })
    }

    const handleUpload = async (file: File) => {
        if (!currentCameraItem) return
        const formData = new FormData()
        formData.append('file', file)
        formData.append('file_type', 'orders')
        formData.append('compression_service', 'slikk')
        try {
            const response = await axioisInstance.post('fileupload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            const newUrl = response.data.url
            successMessage(response)
            setStorePhoto((prev) => {
                const { orderItemId, itemIndex } = currentCameraItem
                const orderItemPhotos = prev[orderItemId] || {}
                const itemPhotos = orderItemPhotos[itemIndex] || []
                return { ...prev, [orderItemId]: { ...orderItemPhotos, [itemIndex]: [...itemPhotos, newUrl] } }
            })
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    const handleSave = () => {
        const newPayload: Record<
            string,
            {
                qc_passed: number
                qc_failed: number
                refurbished: number
                qc_failed_data?: QcFailedData[]
            }
        > = {}

        Object.entries(itemStatuses).forEach(([orderItemId, statusArray]) => {
            const counts = { qc_passed: 0, qc_failed: 0, refurbished: 0 }
            const failedItemsData: QcFailedData[] = []

            statusArray.forEach((status, index) => {
                if (status.qc_passed) counts.qc_passed++
                else if (status.qc_failed) {
                    counts.qc_failed++
                    const itemPhotos = storePhoto[orderItemId]?.[index] || []
                    const itemReason = storeReason[orderItemId]?.[index] || ''
                    failedItemsData.push({ image: itemPhotos.join(','), reason: itemReason })
                } else if (status.refurbished) counts.refurbished++
            })

            if (counts.qc_passed || counts.qc_failed || counts.refurbished) {
                newPayload[orderItemId] = {
                    qc_passed: counts.qc_passed,
                    qc_failed: counts.qc_failed,
                    refurbished: counts.refurbished,
                }
                if (failedItemsData.length > 0) {
                    newPayload[orderItemId].qc_failed_data = failedItemsData
                }
            }
        })
        setPayload(Object.keys(newPayload).length ? newPayload : undefined)
        notification.success({ message: 'Status has been set' })
    }

    const handleClear = () => {
        setItemStatuses({})
        setStorePhoto({})
        setStoreReason({})
        setPayload(undefined)
        notification.success({ message: 'All data cleared' })
    }

    const handleRemovePhoto = (orderItemId: string, itemIndex: number, photoIndex: number) => {
        setStorePhoto((prev) => {
            const orderItemPhotos = prev[orderItemId] || {}
            const itemPhotos = orderItemPhotos[itemIndex] || []
            return {
                ...prev,
                [orderItemId]: {
                    ...orderItemPhotos,
                    [itemIndex]: itemPhotos.filter((_, i) => i !== photoIndex),
                },
            }
        })
    }

    const handleOpenCamera = (orderItemId: string, itemIndex: number) => {
        setCurrentCameraItem({ orderItemId, itemIndex })
        setIsPhotoCamera(true)
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

            {orderItems?.map((item) => {
                if (!item) return null
                const quantity = Math.max(Number(item.quantity) || 1, 1)
                const statuses = itemStatuses[item.order_item] || []

                return (
                    <div key={item.order_item} className="overflow-y-scroll">
                        <CommonAccordion header={`Item - ${item.order_item}`}>
                            <div className="border rounded-lg p-3 bg-white shadow-xs hover:shadow-sm transition-shadow">
                                <div className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.sku || 'Product image'}
                                            className="w-10 h-10 object-cover rounded border"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-sm truncate">SKU: {item.product?.sku || 'N/A'}</h3>
                                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                                <span>Size: {item.product?.size || 'N/A'}</span>
                                                <span>•</span>
                                                <span>Qty: {quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t space-y-4">
                                    {Array.from({ length: quantity }).map((_, index) => {
                                        const status = statuses[index] || { qc_passed: false, qc_failed: false, refurbished: false }
                                        const isQcFailed = status?.qc_failed ?? false
                                        const itemPhotos = storePhoto[item.order_item]?.[index] || []
                                        const itemReason = storeReason[item.order_item]?.[index] || ''

                                        return (
                                            <React.Fragment key={index}>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-3 hover:bg-gray-50 rounded-lg border">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded">
                                                            Item #{index + 1}
                                                        </span>
                                                        {isQcFailed && (
                                                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                                                                QC Failed
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-center">
                                                        {status?.qc_passed && (
                                                            <div className="flex items-center space-x-2 text-green-600">
                                                                <FaCheckCircle size={16} />
                                                                <span className="text-sm font-medium">QC Passed</span>
                                                            </div>
                                                        )}
                                                        {status?.qc_failed && (
                                                            <div className="flex items-center space-x-2 text-red-600">
                                                                <FaTimesCircle size={16} />
                                                                <span className="text-sm font-medium">QC Failed</span>
                                                            </div>
                                                        )}
                                                        {status?.refurbished && (
                                                            <div className="flex items-center space-x-2 text-blue-600">
                                                                <MdIron size={16} />
                                                                <span className="text-sm font-medium">Refurbished</span>
                                                            </div>
                                                        )}
                                                        {!status?.qc_passed && !status?.qc_failed && !status?.refurbished && (
                                                            <span className="text-gray-400 text-sm">Not set</span>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-center space-x-4">
                                                        <button
                                                            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${status?.qc_passed ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                                                            title="QC Passed"
                                                            onClick={() => handleStatusChange(item.order_item, index, 'qc_passed')}
                                                        >
                                                            <FaCheckCircle size={22} />
                                                            <span className="text-xs mt-1">Passed</span>
                                                        </button>

                                                        <button
                                                            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${status?.qc_failed ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`}
                                                            title="QC Failed"
                                                            onClick={() => handleStatusChange(item.order_item, index, 'qc_failed')}
                                                        >
                                                            <FaTimesCircle size={22} />
                                                            <span className="text-xs mt-1">Failed</span>
                                                        </button>

                                                        <button
                                                            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${status?.refurbished ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                                                            title="Refurbished"
                                                            onClick={() => handleStatusChange(item.order_item, index, 'refurbished')}
                                                        >
                                                            <MdIron size={22} />
                                                            <span className="text-xs mt-1">Refurbished</span>
                                                        </button>
                                                    </div>

                                                    {isQcFailed && (
                                                        <div className="col-span-full mt-4 p-4 bg-red-50 rounded-lg border border-red-100 space-y-4">
                                                            <div className="flex justify-center">
                                                                <button
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
                                                                    onClick={() => handleOpenCamera(item.order_item, index)}
                                                                >
                                                                    <MdPhotoCamera className="text-lg" />
                                                                    Take Photo
                                                                </button>
                                                            </div>

                                                            {itemPhotos.length > 0 && (
                                                                <div className="space-y-2">
                                                                    <h4 className="text-sm font-medium text-gray-700">Photos:</h4>
                                                                    <div className="flex flex-wrap gap-3">
                                                                        {itemPhotos.map((img, photoIndex) => (
                                                                            <div key={photoIndex} className="relative group">
                                                                                <div
                                                                                    className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200 bg-gray-50 cursor-pointer"
                                                                                    onClick={() => setPreviewImages([img])}
                                                                                >
                                                                                    <img
                                                                                        src={img}
                                                                                        alt={`Captured ${photoIndex + 1}`}
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                </div>
                                                                                <button
                                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                                                                                    onClick={() =>
                                                                                        handleRemovePhoto(
                                                                                            item.order_item,
                                                                                            index,
                                                                                            photoIndex,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <FaTimes className="w-3 h-3" />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-medium text-gray-700">
                                                                    Reason for QC Failure:
                                                                </h4>
                                                                <Select
                                                                    className="w-full"
                                                                    placeholder="Select Reason"
                                                                    value={itemReason || undefined}
                                                                    onChange={(value) => {
                                                                        setStoreReason((prev) => ({
                                                                            ...prev,
                                                                            [item.order_item]: {
                                                                                ...prev[item.order_item],
                                                                                [index]: value,
                                                                            },
                                                                        }))
                                                                    }}
                                                                    options={reasonsArray}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        </CommonAccordion>
                    </div>
                )
            })}

            <div className="sticky bottom-0 bg-white pt-3 mt-2 border-t flex items-center justify-center">
                <div className="flex items-center gap-4">
                    <Button variant="blue" size="sm" onClick={handleSave} className="px-6 py-2">
                        Save Status Data
                    </Button>
                    <Button variant="reject" size="sm" disabled={!payload} onClick={handleClear} className="px-6 py-2">
                        Clear Data
                    </Button>
                </div>
            </div>

            <OrderCameraModal
                isOpen={isPhotoCamera}
                setIsOpen={setIsPhotoCamera}
                currentId={0}
                setStorePhoto={() => {}}
                handleManually={handleUpload}
            />
            {previewImages.length > 0 && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewImages([])}
                >
                    <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300"
                            onClick={() => setPreviewImages([])}
                        >
                            ×
                        </button>
                        <img src={previewImages[0]} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default CancelItemSelect
