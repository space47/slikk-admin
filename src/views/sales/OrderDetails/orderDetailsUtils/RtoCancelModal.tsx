/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import { IoIosAddCircle, IoIosCheckmarkCircle, IoIosCube, IoIosInformationCircle, IoIosListBox, IoIosWarning } from 'react-icons/io'
import { AxiosError } from 'axios'
import { Button, Dialog, Dropdown, Spinner } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Product } from '../components/activityCommon'
import { OrderCancelReasons } from '@/constants/commonArray.constant'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { LocationDetail, QuantityValidation } from '../orderList.common'
import { FaTrash } from 'react-icons/fa'

interface RtoCancelModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    orderItems: Product[]
    invoice_id: string | undefined
    isCancel?: boolean
    status?: string
}

const RtoCancelModal: React.FC<RtoCancelModalProps> = ({ isOpen, setIsOpen, orderItems, invoice_id, isCancel = false, status }) => {
    const navigate = useNavigate()
    const [locationWiseDetails, setLocationWiseDetails] = useState<Record<number, LocationDetail[]>>({})
    const [locationStore, setLocationStore] = useState<Record<number, string>>({})
    const [cancelReason, setCancelReason] = useState<string>('')
    const [showCancelInput, setShowCancelInput] = useState(false)
    const [customReason, setCustomReason] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const filteredOrderItems = useMemo(
        () =>
            orderItems?.filter((item) =>
                typeof item?.fulfilled_quantity === 'number' ? item?.fulfilled_quantity > 0 : parseInt(item?.fulfilled_quantity) > 0,
            ) || [],
        [orderItems],
    )

    const totalItemQuantity = useMemo(
        () => filteredOrderItems.reduce((total: number, item) => total + Number(item.quantity), 0),
        [filteredOrderItems],
    )

    // const locationWiseArray = useMemo(
    //     () =>
    //         filteredOrderItems?.map((item) => ({
    //             order_id: item.id,
    //             quantity: item.quantity,
    //         })) || [],
    //     [filteredOrderItems],
    // )

    useEffect(() => {
        if (!isOpen) return
        const initialLocationStore: Record<number, string> = {}
        const initialLocationDetails: Record<number, LocationDetail[]> = {}
        filteredOrderItems.forEach((item) => {
            initialLocationStore[item.id] = item.location || ''
            initialLocationDetails[item.id] = locationWiseDetails[item.id] || []
        })

        setLocationStore(initialLocationStore)
        setLocationWiseDetails(initialLocationDetails)
    }, [isOpen, filteredOrderItems])

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
            if (currentLocations.length <= index) return prev
            const updatedLocations = [...currentLocations]
            updatedLocations[index] = {
                ...updatedLocations[index],
                [field]: value,
            }
            return { ...prev, [orderItemId]: updatedLocations }
        })
    }, [])

    const removeLocation = useCallback((orderItemId: number, index: number) => {
        setLocationWiseDetails((prev) => {
            const currentLocations = prev[orderItemId] || []
            const updatedLocations = currentLocations.filter((_, i) => i !== index)
            return { ...prev, [orderItemId]: updatedLocations }
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
            const numericId = Number(id)
            if (Array.isArray(details) && details.length > 0) {
                transformed[numericId] = details.reduce(
                    (acc, { location, quantity }) => {
                        if (location && location.trim() !== '') {
                            acc[location] = (acc[location] || 0) + quantity
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

    const handleCancelOrder = useCallback(async () => {
        const isAccepted = status === 'ACCEPTED'
        if (!isAccepted) {
            const validation = validateQuantities()
            if (!validation.isValid) {
                notification.warning({
                    message: 'Quantity Mismatch',
                    description: `Total item quantity does not match assigned quantity or Location is not selected. Please ensure all fields are properly assigned.`,
                })
                return
            }
            let hasEmptyLocation = false
            Object.entries(locationWiseDetails).forEach(([id, details]) => {
                details.forEach(({ location }, index) => {
                    if (!location || location.trim() === '') {
                        hasEmptyLocation = true
                        notification.error({
                            message: `Location Required : Please select a valid location for item ${id} at position ${index + 1}.`,
                        })
                    }
                })
            })
            if (hasEmptyLocation) return
        }

        if (isCancel && !cancelReason && !customReason) {
            notification.error({ message: 'Reason Required : Please select or enter a cancel reason before proceeding.' })
            return
        }
        const body: any = { return_reason: getCancelReason() }
        if (!isAccepted) body.items_location = transformLocationDetails()

        try {
            setIsLoading(true)
            const response = await axioisInstance.post(`merchant/cancelorder/${invoice_id}`, body)
            successMessage(response)
            navigate(0)
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setIsLoading(false)
        }
    }, [
        status,
        validateQuantities,
        locationWiseDetails,
        isCancel,
        cancelReason,
        customReason,
        getCancelReason,
        transformLocationDetails,
        invoice_id,
        setIsOpen,
        navigate,
    ])

    const renderLocationInputs = (item: Product) => {
        const locations = locationWiseDetails[item.id] || []
        const assignedQuantity = locations.reduce((sum, loc) => sum + (Number(loc.quantity) || 0), 0)
        const remainingQuantity = Number(item.quantity) - assignedQuantity
        const storedLocation = locationStore[item.id] || ''

        return (
            <div key={item.id} className="mb-4 border p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Order Item: {item.id}</span>
                    <Button
                        variant="blue"
                        disabled={assignedQuantity >= Number(item.quantity)}
                        onClick={() => addLocation(item.id, Number(item.quantity))}
                    >
                        Add Location
                    </Button>
                </div>

                {locations.map((location, index) => (
                    <div key={index} className="flex xl:flex-row md:flex-row flex-col gap-3 mb-2 items-center">
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
                            max={remainingQuantity + location.quantity}
                            value={location.quantity || ''}
                            onChange={(e) => updateLocationDetail(item.id, index, 'quantity', Number(e.target.value) || 0)}
                            className="border p-2 rounded w-32"
                        />
                        <Button variant="reject" onClick={() => removeLocation(item.id, index)}>
                            <FaTrash />
                        </Button>
                    </div>
                ))}

                <div className="flex flex-col gap-1 mt-2">
                    <small className="text-gray-500">
                        Original location: <span className="font-bold">{storedLocation}</span>
                    </small>
                    <small className="text-gray-500">
                        Max Quantity: {item.quantity} | Assigned: {assignedQuantity} | Remaining: {remainingQuantity}
                    </small>
                    {remainingQuantity < 0 && (
                        <small className="text-red-500 font-semibold">Warning: You have assigned more than the available quantity!</small>
                    )}
                </div>
            </div>
        )
    }

    const renderCancelReasonSection = () => {
        if (!isCancel) return null

        return (
            <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <IoIosWarning className="text-red-500 text-xl" />
                    <h3 className="text-lg font-bold text-red-700">REASON FOR CANCELLATION</h3>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                        <Dropdown
                            className="bg-white border border-gray-300 rounded-lg flex-1 shadow-sm hover:shadow-md transition-shadow"
                            title={
                                cancelReason
                                    ? OrderCancelReasons.find((reason) => reason.value === cancelReason)?.label
                                    : 'Select cancellation reason'
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
                            className="p-2 text-green-600 hover:text-green-700 transition-colors bg-white border border-green-200 rounded-lg hover:bg-green-50"
                            aria-label="Add custom reason"
                            onClick={() => setShowCancelInput(true)}
                        >
                            <IoIosAddCircle size={24} />
                        </button>
                    </div>

                    {showCancelInput && (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Enter custom reason..."
                                value={customReason}
                                className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                onChange={(e) => setCustomReason(e.target.value)}
                            />
                            <Button
                                variant="reject"
                                onClick={() => {
                                    setShowCancelInput(false)
                                    setCustomReason('')
                                }}
                                className="px-3"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={1000} height={'85vh'} preventScroll>
            <div className="p-0 h-[80vh] overflow-scroll">
                {/* Header */}
                <div
                    className="  flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8
    sticky top-0 bg-blue-50 dark:bg-gray-900 z-20 shadow-sm p-2 rounded-md"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                            <IoIosWarning className="text-red-600 text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Cancel Order</h2>
                            <p className="text-gray-600 text-sm">Please review and confirm order cancellation</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center">
                        <Button variant="reject" disabled={isLoading} onClick={() => setIsOpen(false)} className="min-w-24">
                            Cancel
                        </Button>
                        <Button
                            variant="accept"
                            className="flex items-center gap-2 min-w-32 bg-red-600 hover:bg-red-700"
                            disabled={isLoading}
                            onClick={handleCancelOrder}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner size={20} color="white" />
                                    <span>Cancelling...</span>
                                </>
                            ) : (
                                <>
                                    <IoIosCheckmarkCircle size={18} />
                                    <span>Confirm Cancel</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Order Items Section */}
                {status !== 'ACCEPTED' && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <IoIosListBox className="text-blue-600 text-xl" />
                            <h3 className="text-lg font-semibold text-gray-800">Order Items & Locations</h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto pr-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {filteredOrderItems?.length > 0 ? (
                                filteredOrderItems.map(renderLocationInputs)
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <IoIosCube className="mx-auto text-3xl mb-2" />
                                    <p>No order items to display</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Cancel Reason Section */}
                {renderCancelReasonSection()}

                {/* Footer Note */}
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <IoIosInformationCircle className="text-yellow-600 text-lg mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> This action cannot be undone. Once cancelled, the order will be permanently marked as
                            cancelled in the system.
                        </p>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default RtoCancelModal
