/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import { IoIosAddCircle, IoIosCheckmarkCircle, IoIosInformationCircle, IoIosListBox, IoIosWarning } from 'react-icons/io'
import { AxiosError } from 'axios'
import { Button, Dialog, Dropdown, Spinner } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { OrderCancelReasons } from '@/constants/commonArray.constant'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { EOrderStatus, LocationDetail } from '../orderList.common'
import { Order } from '@/store/types/newOrderTypes'
import CancelItemSelect from '@/common/CancelItemSelect'

interface RtoCancelModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    orderItems: Order['order_items']
    invoice_id: string | undefined
    isCancel?: boolean
    status?: string
}

const RtoCancelModal: React.FC<RtoCancelModalProps> = ({ isOpen, setIsOpen, orderItems, invoice_id, isCancel = false, status }) => {
    const navigate = useNavigate()
    const [locationWiseDetails, setLocationWiseDetails] = useState<Record<number, LocationDetail[]>>({})
    const [payload, setPayload] = useState<Record<string, Record<string, number>>>()
    const [cancelReason, setCancelReason] = useState<string>('')
    const [showCancelInput, setShowCancelInput] = useState(false)
    const [customReason, setCustomReason] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const orderItemsCuration = useMemo(
        () =>
            orderItems?.map((item) => ({
                product: {
                    image: item?.image?.split(',')[0],
                    size: item?.size,
                    sku: item?.sku,
                },
                quantity: item?.quantity,
                order_item: item?.id?.toString(),
            })),
        [orderItems],
    )

    const filteredOrderItems = useMemo(
        () =>
            orderItems?.filter((item) =>
                typeof item?.fulfilled_quantity === 'number' ? item?.fulfilled_quantity > 0 : parseInt(item?.fulfilled_quantity) > 0,
            ) || [],
        [orderItems],
    )

    useEffect(() => {
        if (!isOpen) return
        const initialLocationStore: Record<number, string> = {}
        const initialLocationDetails: Record<number, LocationDetail[]> = {}
        filteredOrderItems.forEach((item) => {
            initialLocationStore[item.id] = item.location || ''
            initialLocationDetails[item.id] = locationWiseDetails[item.id] || []
        })

        setLocationWiseDetails(initialLocationDetails)
    }, [isOpen, filteredOrderItems, locationWiseDetails])

    const getCancelReason = useCallback((): string => {
        if (customReason) return customReason
        if (cancelReason) return cancelReason
        return isCancel ? '' : 'RTO Cancel'
    }, [cancelReason, customReason, isCancel])

    const handleCancelOrder = async () => {
        const isAccepted = status === EOrderStatus.accepted

        if (isAccepted) {
            const payloadId = Object.keys(payload || {}) || []
            const totalIdsInLocationWiseDetails = Object.keys(locationWiseDetails)
            const checkIfAllKeysExist = totalIdsInLocationWiseDetails?.every((item) => payloadId.includes(item?.toString()))
            if (!checkIfAllKeysExist) {
                notification.error({ message: 'All the items are required to proceed further' })
                return
            }
        }

        if (isCancel && !cancelReason && !customReason) {
            notification.error({ message: 'Reason Required : Please select or enter a cancel reason before proceeding.' })
            return
        }
        const body: any = { return_reason: getCancelReason() }
        if (!isAccepted) body.items_details = payload

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
                                className="px-3"
                                onClick={() => {
                                    setShowCancelInput(false)
                                    setCustomReason('')
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const cancelHeaderSection = () => {
        return (
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
                    <Button variant="gray" className="min-w-24" disabled={isLoading} onClick={() => setIsOpen(false)}>
                        {`Don't Cancel`}
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
        )
    }

    return (
        <Dialog preventScroll isOpen={isOpen} width={1000} height={'auto'} onClose={() => setIsOpen(false)}>
            <div className="p-0 xl:h-[80vh] h-[90vh] overflow-scroll">
                {cancelHeaderSection()}
                {status !== EOrderStatus.accepted && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <IoIosListBox className="text-blue-600 text-xl" />
                            <h3 className="text-lg font-semibold text-gray-800">Order Items & Locations</h3>
                        </div>
                        <div>
                            <CancelItemSelect orderItems={orderItemsCuration} payload={payload} setPayload={setPayload} />
                        </div>
                    </div>
                )}
                {renderCancelReasonSection()}
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
