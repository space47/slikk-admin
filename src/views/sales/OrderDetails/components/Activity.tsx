/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, notification } from 'antd'
import classNames from 'classnames'
import moment from 'moment'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
    ConfirmationModal,
    ConfirmationModalProps,
    CustomModal,
    CustomModal2,
    CustomModal3,
    CustomModal4,
    CustomModal5,
    ExchangeModal,
} from './Modal'
import { ActivityProps, LOGISTIC_PARTNER } from './activityCommon'
import { getButtonAndModalContent, particularApiCall } from './activityFunctions'
import { errorMessage } from '@/utils/responseMessages'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import { FulfilledQuantities, LogisticPartner, NAVIGATION_DELAY, NOTIFICATION_DURATION, SelectedLocations } from '../orderList.common'

export const Activity: React.FC<ActivityProps> = ({ data = [], status, product = [], payment, invoice_id, mainData, delivery_type }) => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<FulfilledQuantities>({})
    const [errorText, setErrorText] = useState<string | null>(null)
    const [action, setAction] = useState('')
    const [triggerApiCall, setTriggerApiCall] = useState(false)
    const [triggerAcceptedCall, setTriggerAcceptedCall] = useState(false)
    const [triggerPackCall, setTriggerPackCall] = useState(false)
    const [triggerShipCall, setTriggerShipCall] = useState(false)
    const [triggerOutDeliveryCall, setTriggerOutDeliveryCall] = useState(false)
    const [triggerDeliveryCall, setTriggerDeliveryCall] = useState(false)
    const [triggerExchangeCall, setTriggerExchangeCall] = useState(false)
    const [cancelCall, setCancelCall] = useState(false)
    const [buttonAfterClick, setButtonAfterClick] = useState(false)
    const [partner, setPartner] = useState<LogisticPartner | null>(null)
    const [rejectModal, setRejectModal] = useState(false)
    const [rtoCancel, setRtoCancel] = useState(false)
    const [bagsCount, setBagsCount] = useState('1')
    const [binNumber, setBinNumber] = useState('1')
    const [selectedLocations, setSelectedLocations] = useState<SelectedLocations>({})

    const fulfilledIDs = useMemo(() => Object.keys(fulfilledQuantities), [fulfilledQuantities])

    const rejectData = useMemo(
        () => mainData.order_items?.filter((item) => !fulfilledIDs.includes(item.id.toString()))?.map((item) => item.id),
        [mainData.order_items, fulfilledIDs],
    )
    const hasStatus = useCallback((targetStatus: any) => data.some((log) => log.status === targetStatus), [data])
    const isPacked = useMemo(() => hasStatus('PACKED'), [hasStatus])
    const isDeliveryCreated = useMemo(() => hasStatus('DELIVERY_CREATED'), [hasStatus])
    const isOrderDone = useMemo(() => hasStatus('DELIVERED') || hasStatus('COMPLETED'), [hasStatus])
    const isExchangeComplete = useMemo(() => hasStatus('EXCHANGE_DELIVERED'), [hasStatus])

    const { buttonText, modalContent: content } = useMemo(
        () => getButtonAndModalContent(data, mainData, delivery_type),
        [data, mainData, delivery_type],
    )
    const showModal = useCallback((content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }, [])

    const handleLocationClick = useCallback((productId: number, location: string, locationQuantity: number, totalQuantity: number) => {
        setSelectedLocations((prev) => {
            const productLocations = prev[productId] || {}
            const currentCount = productLocations[location] || 0
            const totalSelected = Object.values(productLocations).reduce((sum, count) => sum + count, 0)

            if (currentCount > locationQuantity) {
                notification.error({ message: 'Inventory exceeded' })
                return prev
            }

            if (Number(totalSelected) === Number(totalQuantity)) {
                notification.error({ message: 'Item has already been fulfilled' })
                return prev
            }

            if (currentCount < locationQuantity && totalSelected < totalQuantity) {
                return {
                    ...prev,
                    [productId]: {
                        ...productLocations,
                        [location]: currentCount + 1,
                    },
                }
            }

            return prev
        })
    }, [])

    const handleRemoveLocation = useCallback((productId: number, location: string) => {
        setSelectedLocations((prev) => {
            const productLocations = { ...(prev[productId] || {}) }
            if (productLocations[location] > 1) {
                productLocations[location] -= 1
            } else {
                delete productLocations[location]
            }
            const updated = { ...prev }
            if (Object.keys(productLocations).length > 0) {
                updated[productId] = productLocations
            } else {
                delete updated[productId]
            }

            return updated
        })
    }, [])

    const handleSelectChange = useCallback((id: number, value: string) => {
        setFulfilledQuantities((prev) => ({
            ...prev,
            [id]: parseInt(value, 10),
        }))
    }, [])

    const handlePartnerSelect = useCallback((selectedValue: string) => {
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''
        setPartner({ value: selectedValue, label: selectedLabel })
    }, [])

    const handleReject = useCallback(() => {
        const hasFulfilledQty = Object.values(fulfilledQuantities).some((item) => item > 0)

        if (hasFulfilledQty) {
            setTimeout(() => {
                setErrorText('QUANTITY OF ITEMS SHOULD BE 0')
            }, 2000)
        } else {
            setRejectModal(true)
            setIsModalOpen(false)
        }
    }, [fulfilledQuantities])

    const handleCancelOnRTO = useCallback(async () => {
        const body = {
            return_reason: 'RTO Cancel',
        }

        try {
            const response = await axiosInstance.post(`merchant/cancelorder/${invoice_id}`, body)
            notification.success({
                message: 'SUCCESS',
                description: response.data.message || 'Order successfully Cancelled',
            })
            navigate(0)
            setIsModalOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }, [invoice_id, navigate])

    const makeApiCall = useCallback(
        async (requestData: FulfilledQuantities | SelectedLocations) => {
            const body = {
                action,
                data: requestData,
                ...(bagsCount && { packets_count: Number(bagsCount) }),
                ...(binNumber && { bin_id: binNumber }),
            }

            try {
                const response = await axiosInstance.patch(`merchant/order/${invoice_id}`, body)
                notification.success({ message: response?.data?.message })
                setIsModalOpen(false)
                setTriggerApiCall(false)

                setTimeout(() => {
                    navigate(0)
                }, NAVIGATION_DELAY)
            } catch (error) {
                if (error instanceof AxiosError) {
                    errorMessage(error)
                }
            } finally {
                setButtonAfterClick(false)
            }
        },
        [action, bagsCount, binNumber, invoice_id, navigate],
    )

    const handleApiCall = useCallback(
        (trigger: boolean, setTrigger: React.Dispatch<React.SetStateAction<boolean>>, isPacking: boolean) => {
            if (trigger) {
                particularApiCall(action, invoice_id, partner?.value, navigate, isPacking, binNumber)
                setTrigger(false)
            }
        },
        [action, invoice_id, partner?.value, navigate, binNumber],
    )

    useEffect(() => {
        if (triggerApiCall) {
            const sendApiRequest = async () => {
                try {
                    if (status === 'ACCEPTED' && !bagsCount) {
                        notification.error({ message: 'Number of bags Required' })
                        setTimeout(() => navigate(0), NOTIFICATION_DURATION)
                        return
                    }
                    const hasLocationDetails = product.some(
                        (item) => item.location_details && Object.keys(item.location_details).length > 0,
                    )
                    let requestData: FulfilledQuantities | SelectedLocations
                    if (hasLocationDetails) {
                        requestData = Object.entries(selectedLocations).reduce((acc, [productId, locations]) => {
                            Object.entries(locations).forEach(([location, count]) => {
                                acc[Number(productId)] = acc[Number(productId)] || {}
                                ;(acc[Number(productId)] as any)[location] = count
                            })
                            return acc
                        }, {} as SelectedLocations)
                    } else {
                        requestData = Object.entries(fulfilledQuantities).reduce((acc, [id, quantity]) => {
                            if (quantity > 0) {
                                acc[Number(id)] = quantity
                            }
                            return acc
                        }, {} as FulfilledQuantities)
                    }
                    if (Object.keys(requestData).length === 0) {
                        setButtonAfterClick(false)
                        notification.warning({
                            message: 'No Quantities Selected',
                            description: 'Please select at least one item with a valid quantity to proceed.',
                        })
                        setTriggerApiCall(false)
                        return
                    }
                    const hasZeroQuantity = hasLocationDetails
                        ? Object.values(selectedLocations).some((locations) => Object.values(locations).some((count) => count === 0))
                        : Object.values(fulfilledQuantities).some((quantity) => quantity === 0)

                    const totalRequiredQuantity = product.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
                    const totalFulfilledQuantity = hasLocationDetails
                        ? Object.values(selectedLocations)
                              .flatMap((locs) => Object.values(locs))
                              .reduce((sum: number, curr: any) => sum + curr, 0)
                        : Object.values(fulfilledQuantities).reduce((sum, q) => sum + (q || 0), 0)

                    const hasLessQuantity = totalRequiredQuantity > totalFulfilledQuantity
                    if (hasZeroQuantity || hasLessQuantity) {
                        setButtonAfterClick(false)
                        Modal.confirm({
                            title: hasZeroQuantity ? 'Confirm Zero Quantity' : 'Confirm Quantity for Packing',
                            content: hasZeroQuantity
                                ? 'One or more items have a quantity of 0. Do you still want to proceed?'
                                : 'The number of fulfilled quantity is less than actual quantity!',
                            okText: 'Yes',
                            cancelText: 'No',
                            onOk: async () => await makeApiCall(requestData),
                            onCancel: () => setTriggerApiCall(false),
                        })
                        return
                    }
                    await makeApiCall(requestData)
                } catch (error) {
                    setTriggerApiCall(false)
                    setButtonAfterClick(false)
                }
            }

            sendApiRequest()
        }
    }, [triggerApiCall, status, bagsCount, product, selectedLocations, fulfilledQuantities, navigate, makeApiCall])

    useEffect(() => {
        if (cancelCall) {
            const sendApiRequest = async () => {
                try {
                    const cancelData = rejectData?.reduce((acc: FulfilledQuantities, id: number) => {
                        acc[id] = 0
                        return acc
                    }, {})

                    const body = { action, data: cancelData }
                    await axiosInstance.patch(`merchant/order/${invoice_id}`, body)
                    setIsModalOpen(false)
                    setCancelCall(false)
                    navigate(0)
                } catch (error) {
                    console.error('Cancel order error:', error)
                    setCancelCall(false)
                }
            }
            sendApiRequest()
        }
    }, [cancelCall, action, rejectData, invoice_id, navigate])

    useEffect(() => {
        handleApiCall(triggerAcceptedCall, setTriggerAcceptedCall, false)
        handleApiCall(triggerOutDeliveryCall, setTriggerOutDeliveryCall, false)
        handleApiCall(triggerPackCall, setTriggerPackCall, true)
        handleApiCall(triggerShipCall, setTriggerShipCall, false)
        handleApiCall(triggerDeliveryCall, setTriggerDeliveryCall, false)
        handleApiCall(triggerExchangeCall, setTriggerExchangeCall, false)
    }, [
        triggerPackCall,
        triggerShipCall,
        triggerDeliveryCall,
        triggerAcceptedCall,
        triggerOutDeliveryCall,
        triggerExchangeCall,
        handleApiCall,
    ])
    const renderTimeline = () => {
        if (data.length === 0) {
            return <p>No activity data available.</p>
        }
        return data.map((activity, index) => (
            <Timeline.Item
                key={`${activity.status}-${index}-${activity.timestamp}`}
                media={
                    <div className="flex mt-1.5">
                        <Badge innerClass={classNames(activity.timestamp ? 'bg-emerald-500' : 'bg-blue-500')} />
                    </div>
                }
            >
                <div className="font-bold text-md">{activity.status}</div>
                <div>{moment(activity.timestamp).format('DD:MM:YYYY hh:mm a')}</div>
            </Timeline.Item>
        ))
    }

    const renderActionButton = () => {
        if (isDeliveryCreated && !isPacked && !isOrderDone) {
            return (
                <Button variant="solid" onClick={() => showModal('Pick and Pack')}>
                    PACK/REJECT
                </Button>
            )
        }

        if (!buttonText) return null

        return (
            <div className="flex flex-col gap-3 items-center">
                <Button variant="solid" onClick={() => showModal(content)}>
                    {buttonText}
                </Button>
                {data[data.length - 1]?.status === 'RTO_DELIVERED' && (
                    <Button onClick={() => setRtoCancel(true)} className="ml-2" variant="reject">
                        Cancel
                    </Button>
                )}
            </div>
        )
    }

    return (
        <Card className="mb-10 flex flex-col">
            <h5 className="mb-4">Activity</h5>
            <Timeline className="mb-5">{renderTimeline()}</Timeline>
            {renderActionButton()}
            <RejectOrderModal
                visible={rejectModal}
                onConfirm={() => {
                    setAction('PACKED')
                    setCancelCall(true)
                }}
                onCancel={() => setRejectModal(false)}
            />

            {data.length === 0 && (
                <CustomModal5
                    isModalOpen={isModalOpen}
                    handlePack={() => {
                        setAction('ACCEPTED')
                        setTriggerAcceptedCall(true)
                        setButtonAfterClick(true)
                    }}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    invoice={invoice_id}
                    isButtonClick={buttonAfterClick}
                />
            )}

            {data[data.length - 1]?.status === 'PACKED' && (
                <CustomModal2
                    isModalOpen={isModalOpen}
                    handlePack={() => {
                        setAction('CREATE_DELIVERY')
                        setTriggerPackCall(true)
                        setButtonAfterClick(true)
                    }}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    handlePartnerSelect={handlePartnerSelect}
                    partner={partner?.label}
                    isButtonClick={buttonAfterClick}
                    binNumber={binNumber}
                    setBinNumber={setBinNumber}
                />
            )}

            {data[data.length - 1]?.status === 'ACCEPTED' && (
                <CustomModal
                    isModalOpen={isModalOpen}
                    handleOk={() => {
                        setAction('PACKED')
                        setTriggerApiCall(true)
                        setButtonAfterClick(true)
                    }}
                    handleCancel={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    handleReject={handleReject}
                    status={status}
                    invoice_id={invoice_id}
                    payment={payment}
                    product={product}
                    fulfilledQuantities={fulfilledQuantities}
                    handleSelectChange={handleSelectChange}
                    errorMessage={errorText || undefined}
                    isButtonClick={buttonAfterClick}
                    bagsCount={bagsCount}
                    setBagsCount={setBagsCount}
                    handleLocationClick={handleLocationClick}
                    handleRemoveLocation={handleRemoveLocation}
                    selectedLocations={selectedLocations}
                />
            )}

            {buttonText === 'OUT FOR DELIVERY' && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={() => {
                        setAction('SHIPPED')
                        setTriggerShipCall(true)
                        setButtonAfterClick(true)
                    }}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                />
            )}

            {buttonText === 'MARK AS DELIVERED' && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={() => {
                        setAction('DELIVERED')
                        setTriggerDeliveryCall(true)
                        setButtonAfterClick(true)
                    }}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={buttonAfterClick}
                />
            )}

            {buttonText === 'EXCHANGE DELIVERED' && !isExchangeComplete && (
                <ExchangeModal
                    isModalOpen={isModalOpen}
                    handlePack={() => {
                        setAction('EXCHANGE_DELIVERED')
                        setTriggerExchangeCall(true)
                        setButtonAfterClick(true)
                    }}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    invoice={invoice_id}
                    isButtonClick={buttonAfterClick}
                />
            )}
            <CancelOrderModal visible={rtoCancel} onConfirm={handleCancelOnRTO} onCancel={() => setRtoCancel(false)} />
        </Card>
    )
}

const RejectOrderModal: React.FC<Pick<ConfirmationModalProps, 'visible' | 'onConfirm' | 'onCancel'>> = (props) => (
    <ConfirmationModal {...props} title="REJECT ORDER" content="Are you sure you want to reject this order" confirmText="REJECT" />
)

const CancelOrderModal: React.FC<Pick<ConfirmationModalProps, 'visible' | 'onConfirm' | 'onCancel'>> = (props) => (
    <ConfirmationModal {...props} title="CANCEL ORDER" content="Are you sure you want to Cancel this order" confirmText="CANCEL" />
)

export default Activity
