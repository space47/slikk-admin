import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import { IoIosAddCircle, IoIosWarning } from 'react-icons/io'
import { AxiosError } from 'axios'
import { Button, Dialog, Dropdown, Spinner } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Product } from '../components/activityCommon'
import { OrderCancelReasons } from '@/constants/commonArray.constant'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'

interface LocationDetail {
    location: string
    quantity: number
    product?: {
        sku: string
    }
}

interface RtoCancelModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    orderItems: Product[]
    invoice_id: string | undefined
    isCancel?: boolean
}

interface QuantityValidation {
    totalItemQuantity: number
    calculatedQuantity: number
    isValid: boolean
}

const RtoCancelModal: React.FC<RtoCancelModalProps> = ({ isOpen, setIsOpen, orderItems, invoice_id, isCancel = false }) => {
    const navigate = useNavigate()
    const [locationWiseDetails, setLocationWiseDetails] = useState<Record<number, LocationDetail[]>>({})
    const [locationStore, setLocationStore] = useState<Record<number, string>>({})
    const [cancelReason, setCancelReason] = useState<string>('')
    const [showCancelInput, setShowCancelInput] = useState(false)
    const [customReason, setCustomReason] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const locationWiseArray = useMemo(
        () =>
            orderItems?.map((item) => ({
                order_id: item.id,
                quantity: item.quantity,
            })) || [],
        [orderItems],
    )

    const totalItemQuantity = useMemo(
        () => locationWiseArray.reduce((total: number, item) => total + Number(item.quantity), 0),
        [locationWiseArray],
    )

    useEffect(() => {
        if (!isOpen) return
        const initialLocationStore: Record<number, string> = {}
        orderItems.forEach((item) => {
            initialLocationStore[item.id] = item.location || ''
        })
        setLocationStore(initialLocationStore)
    }, [isOpen, orderItems])

    useEffect(() => {
        if (!isOpen) return
        const initialLocationDetails: Record<number, LocationDetail[]> = {}
        orderItems.forEach((item) => {
            initialLocationDetails[item.id] = Array.isArray(locationWiseDetails[item.id]) ? locationWiseDetails[item.id] : []
        })
        setLocationWiseDetails(initialLocationDetails)
    }, [isOpen, orderItems])

    const addLocation = useCallback(
        (orderItemId: number, maxQuantity: number) => {
            const currentLocations = locationWiseDetails[orderItemId] || []
            const usedQuantity = currentLocations.reduce((sum, loc) => sum + (Number(loc.quantity) || 0), 0)
            if (usedQuantity >= maxQuantity) {
                notification.warning({
                    message: 'Quantity Limit',
                    description: `You cannot assign more than ${maxQuantity} units for this item.`,
                })
                return
            }
            setLocationWiseDetails((prev) => ({
                ...prev,
                [orderItemId]: [...currentLocations, { location: '', quantity: 0 }],
            }))
        },
        [locationWiseDetails],
    )

    const updateLocationDetail = useCallback((orderItemId: number, index: number, field: keyof LocationDetail, value: string | number) => {
        setLocationWiseDetails((prev) => {
            const currentLocations = prev[orderItemId] || []
            const updatedLocations = [...currentLocations]
            updatedLocations[index] = { ...updatedLocations[index], [field]: value }
            return {
                ...prev,
                [orderItemId]: updatedLocations,
            }
        })
    }, [])

    const removeLocation = useCallback((orderItemId: number, index: number) => {
        setLocationWiseDetails((prev) => {
            const currentLocations = prev[orderItemId] || []
            const updatedLocations = currentLocations.filter((_, i) => i !== index)
            return {
                ...prev,
                [orderItemId]: updatedLocations,
            }
        })
    }, [])

    const validateQuantities = useCallback((): QuantityValidation => {
        const transformedDetails = transformLocationDetails()
        const calculatedQuantity = calculateTotalQuantity(transformedDetails)
        return {
            totalItemQuantity,
            calculatedQuantity,
            isValid: calculatedQuantity === totalItemQuantity,
        }
    }, [locationWiseDetails, totalItemQuantity])

    const transformLocationDetails = useCallback((): Record<number, Record<string, number>> => {
        const transformed: Record<number, Record<string, number>> = {}
        Object.entries(locationWiseDetails).forEach(([id, details]) => {
            if (Array.isArray(details)) {
                transformed[Number(id)] = details.reduce(
                    (acc, { location, quantity }) => {
                        if (location) {
                            acc[location] = quantity
                        }
                        return acc
                    },
                    {} as Record<string, number>,
                )
            }
        })

        return transformed
    }, [locationWiseDetails])

    const calculateTotalQuantity = useCallback((transformedDetails: Record<number, Record<string, number>>): number => {
        return Object.values(transformedDetails).reduce((sum, locationQuantities) => {
            return sum + Object.values(locationQuantities).reduce((a, b) => a + b, 0)
        }, 0)
    }, [])

    const getCancelReason = useCallback((): string => {
        if (customReason) return customReason
        if (cancelReason) return cancelReason
        return isCancel ? '' : 'RTO Cancel'
    }, [cancelReason, customReason, isCancel])

    // API calls
    const handleCancelOrder = useCallback(async () => {
        if (isCancel && !cancelReason && !customReason) {
            notification.error({
                message: 'Reason Required',
                description: 'Please select or enter a cancel reason before proceeding.',
            })
            return
        }

        const body = {
            // items_location: transformLocationDetails(),
            return_reason: getCancelReason(),
        }

        try {
            setIsLoading(true)
            const response = await axioisInstance.post(`merchant/cancelorder/${invoice_id}`, body)

            if (isCancel) {
                notification.success({
                    message: 'Success',
                    description: response.data.message || 'Order successfully cancelled',
                })
                setIsOpen(false)
            } else {
                successMessage(response)
                navigate(0)
                setIsOpen(false)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Order failed to cancel',
                })
            }
        } finally {
            setIsLoading(false)
        }
    }, [isCancel, cancelReason, customReason, getCancelReason, transformLocationDetails, invoice_id, setIsOpen, navigate])

    // Component rendering helpers
    const renderLocationInputs = (item: Product) => {
        const locations = locationWiseDetails[item.id] || []
        const assignedQuantity = locations.reduce((sum, loc) => sum + (Number(loc.quantity) || 0), 0)
        const storedLocation = locationStore[item.id] || ''

        return (
            <div key={item.id} className="mb-4 border p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Order Item: {item.id}</span>
                    <Button
                        variant="blue"
                        disabled={assignedQuantity >= Number(item.quantity)}
                        onClick={() => addLocation(item.id, parseInt(item.quantity))}
                    >
                        Add Location
                    </Button>
                </div>

                {locations.map((location, index) => (
                    <div key={index} className="flex gap-3 mb-2 items-center">
                        <input
                            type="text"
                            placeholder="Location"
                            value={location.location}
                            onChange={(e) => updateLocationDetail(item.id, index, 'location', e.target.value)}
                            className="border p-2 rounded flex-1"
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            min={0}
                            max={item.quantity}
                            value={location.quantity}
                            onChange={(e) => updateLocationDetail(item.id, index, 'quantity', Number(e.target.value))}
                            className="border p-2 rounded w-20"
                        />
                        <Button variant="reject" onClick={() => removeLocation(item.id, index)}>
                            Remove
                        </Button>
                    </div>
                ))}

                <div className="flex flex-col gap-1 mt-2">
                    <small className="text-gray-500">
                        Original location: <span className="font-bold">{storedLocation}</span>
                    </small>
                    <small className="text-gray-500">
                        Max Quantity: {item.quantity} | Assigned: {assignedQuantity}
                    </small>
                </div>
            </div>
        )
    }

    const renderCancelReasonSection = () => {
        if (!isCancel) return null

        return (
            <div className="mt-4">
                <div className="text-base font-bold mb-2 text-red-500">REASON FOR CANCELLING</div>
                <div className="flex gap-2 items-center">
                    <Dropdown
                        className="bg-gray-100 border rounded-lg flex-1"
                        title={
                            cancelReason
                                ? OrderCancelReasons.find((reason) => reason.value === cancelReason)?.label
                                : 'SELECT RETURN REASON'
                        }
                        onSelect={setCancelReason}
                    >
                        {OrderCancelReasons.map((reason) => (
                            <DropdownItem key={reason.value} eventKey={reason.value}>
                                {reason.label}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                    <button
                        onClick={() => setShowCancelInput(true)}
                        className="p-2 text-green-600 hover:text-green-700 transition-colors"
                        aria-label="Add custom reason"
                    >
                        <IoIosAddCircle size={24} />
                    </button>
                </div>

                {showCancelInput && (
                    <input
                        type="text"
                        placeholder="Enter custom reason"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="mt-2 border p-2 rounded-lg w-full"
                    />
                )}
            </div>
        )
    }

    const renderRTOCancelSection = () => {
        if (isCancel) return null

        return (
            <div className="text-center py-4">
                <h1 className="text-lg font-bold text-red-600 mb-2">RTO Cancel</h1>
                <p className="text-xl font-semibold">Are you sure you want to cancel the RTO order?</p>
            </div>
        )
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={1000}>
            <div className="p-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                        CANCEL ORDER
                        <IoIosWarning className="text-yellow-600 text-2xl" />
                    </h2>
                    <div className="flex gap-2 items-center">
                        <Button variant="reject" onClick={() => setIsOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            variant="accept"
                            className="flex items-center gap-2 min-w-24"
                            onClick={handleCancelOrder}
                            disabled={isLoading}
                        >
                            <span>Confirm</span>
                            {isLoading && <Spinner size={20} color="white" />}
                        </Button>
                    </div>
                </div>
                {/* <div className="max-h-[230px] overflow-y-auto pr-2 bg-blue-50 p-4 rounded-lg">{orderItems?.map(renderLocationInputs)}</div> */}
                {renderCancelReasonSection()}
                {renderRTOCancelSection()}
            </div>
        </Dialog>
    )
}

export default RtoCancelModal
