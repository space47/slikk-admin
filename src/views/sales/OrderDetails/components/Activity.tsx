/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import Button from '@/components/ui/Button'
import React, { useState, useEffect } from 'react'
import { Modal, notification } from 'antd'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import { CustomModal, CustomModal2, CustomModal3, CustomModal4, CustomModal5, ExchangeModal, RejectModal } from './Modal'
import { ActivityProps, LOGISTIC_PARTNER } from './activityCommon'
import { getButtonAndModalContent, particularApiCall } from './activityFunctions'
import { AxiosError } from 'axios'
import RtoCancelModal from '../orderDetailsUtils/RtoCancelModal'

const Activity = ({ data = [], status, product = [], payment, invoice_id, mainData, delivery_type }: ActivityProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<{ [key: number]: number }>({})
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
    const navigate = useNavigate()
    const [partner, setPartner] = useState<{ value: string; label: string } | null>(null)
    const fulfilledIDs = Object.keys(fulfilledQuantities)
    const [rejectModal, setRejectModal] = useState(false)
    const hasStatus = (status: string) => data.some((log) => log.status === status)
    const isPacked = data.some((log) => log?.status === 'PACKED')
    const isDeliveryCreated = data.some((log) => log?.status === 'DELIVERY_CREATED')
    const isOrderDone = data.some((log) => log.status === 'DELIVERED' || log.status === 'COMPLETED')
    const isExchangeComplete = hasStatus('EXCHANGE_DELIVERED')
    const [rtoCancel, setRtoCancel] = useState(false)
    const [bagsCount, setBagsCount] = useState('1')
    const [binNumber, setBinNumber] = useState('1')
    const [selectedLocations, setSelectedLocations] = useState<{ [productId: number]: { [location: string]: number } }>({})

    const rejectData = mainData.order_items?.filter((item) => !fulfilledIDs.includes(item.id.toString()))?.map((item) => item.id)

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    const handleLocationClick = (productId: number, location: string, locationQuantity: number, totalQuantity: number) => {
        setSelectedLocations((prev) => {
            const productLocations = prev[productId] || {}
            const currentCount = productLocations[location] || 0
            const totalSelected = Object.values(productLocations).reduce((sum, count) => sum + count, 0)

            if (currentCount === locationQuantity) {
                notification.error({ message: 'Inventory exceeded' })
                return prev
            }

            if (totalSelected === Number(totalQuantity)) {
                notification.error({ message: 'item has already been fulfilled' })
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
    }

    const handleRemoveLocation = (productId: number, location: string) => {
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
    }

    const handleSelectChange = (id: number, value: string) => {
        setFulfilledQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: parseInt(value, 10),
        }))
    }

    useEffect(() => {
        if (triggerApiCall) {
            const sendApiRequest = async () => {
                try {
                    if (status === 'ACCEPTED' && !bagsCount) {
                        notification.error({ message: 'Number of bags Required' })
                        setInterval(() => {
                            navigate(0)
                        }, 3000)
                        return
                    }
                    const itemsWithLocationDetails = product?.filter(
                        (item) =>
                            item.location_details &&
                            Object.values(item.location_details).reduce((sum, qty) => sum + qty, 0) >= parseInt(item.quantity),
                    )
                    const itemsWithoutLocationDetails = product?.filter(
                        (item) =>
                            !item.location_details ||
                            Object.values(item.location_details).reduce((sum, qty) => sum + qty, 0) < parseInt(item.quantity),
                    )
                    const data: Record<number, any> = {}
                    if (itemsWithLocationDetails?.length > 0) {
                        const locationData = Object.entries(selectedLocations).reduce(
                            (acc, [productId, locations]) => {
                                Object.entries(locations).forEach(([location, count]) => {
                                    acc[productId as any] = acc[productId as any] || {}
                                    acc[productId as any][location] = count
                                })
                                return acc
                            },
                            {} as { [key: number]: { [location: string]: number } },
                        )
                        Object.assign(data, locationData)
                    }
                    if (itemsWithoutLocationDetails?.length > 0) {
                        const quantityData = Object.entries(fulfilledQuantities).reduce(
                            (acc, [id, quantity]: any) => {
                                if (quantity > 0) {
                                    acc[id] = quantity
                                }
                                return acc
                            },
                            {} as { [key: number]: number },
                        )
                        Object.assign(data, quantityData)
                    }
                    if (Object.keys(data).length === 0) {
                        setButtonAfterClick(false)
                        notification.warning({ message: 'Please select at least one item with a valid quantity to proceed.' })
                        setTriggerApiCall(false)
                        return
                    }
                    const hasZeroQuantity =
                        Object.values(selectedLocations).some((locations) => Object.values(locations).some((count) => count === 0)) ||
                        Object.values(fulfilledQuantities).some((quantity) => quantity === 0)

                    if (hasZeroQuantity) {
                        setButtonAfterClick(false)
                        Modal.confirm({
                            title: 'Confirm Zero Quantity',
                            content: 'One or more items have a quantity of 0. Do you still want to proceed?',
                            okText: 'Yes',
                            cancelText: 'No',
                            onOk: async () => {
                                await makeApiCall(data)
                            },
                            onCancel: () => {
                                setTriggerApiCall(false)
                            },
                        })
                        return
                    }
                    const totalRequiredQuantity = product?.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
                    const totalFulfilledQuantity =
                        Object.values(selectedLocations)
                            .flatMap((locs) => Object.values(locs))
                            .reduce((sum, curr) => sum + curr, 0) + Object.values(fulfilledQuantities).reduce((sum, q) => sum + (q || 0), 0)

                    const hasLessQuantity = totalRequiredQuantity > totalFulfilledQuantity
                    if (hasLessQuantity && !hasZeroQuantity) {
                        setButtonAfterClick(false)
                        Modal.confirm({
                            title: 'Confirm Quantity for Packing',
                            content: 'The number of fulfilled quantity is less than actual quantity!',
                            okText: 'Yes',
                            cancelText: 'No',
                            onOk: async () => {
                                console.log('data is', data)
                                await makeApiCall(data)
                            },
                            onCancel: () => {
                                setTriggerApiCall(false)
                            },
                        })
                        return
                    }
                    console.log('yyyuyruyuryer', data)
                    await makeApiCall(data)
                } catch (error) {
                    setTriggerApiCall(false)
                } finally {
                    setButtonAfterClick(false)
                }
            }
            const makeApiCall = async (data: { [key: number]: number }) => {
                const body = {
                    action,
                    data,
                    ...(bagsCount ? { packets_count: Number(bagsCount) } : {}),
                    ...(binNumber ? { bin_id: binNumber } : {}),
                }
                try {
                    const response = await axiosInstance.patch(`merchant/order/${invoice_id}`, body)
                    notification.success({ message: response?.data?.message })
                    setIsModalOpen(false)
                    setTriggerApiCall(false)
                } catch (error) {
                    if (error instanceof AxiosError) {
                        notification.error({ message: error?.response?.data?.message })
                    }
                } finally {
                    setInterval(() => {
                        navigate(0)
                    }, 2000)
                }
            }
            sendApiRequest()
        }
    }, [triggerApiCall, navigate])

    const handleReject = () => {
        const hasFulfilledQty = Object.values(fulfilledQuantities).some((item) => item > 0)
        if (hasFulfilledQty) {
            setTimeout(() => {
                setErrorText('QUANTITY OF ITEMS SHOULD BE 0')
            }, 2000)
        } else {
            setRejectModal(true)
            setIsModalOpen(false)
        }
    }

    useEffect(() => {
        if (cancelCall) {
            const sendApiRequest = async () => {
                try {
                    const cancelData = rejectData?.reduce((acc: any, id: any) => {
                        acc[id] = 0
                        return acc
                    }, {})
                    const body = {
                        action,
                        data: cancelData,
                    }
                    const response = await axiosInstance.patch(`merchant/order/${invoice_id}`, body)
                    console.log(response)
                    setIsModalOpen(false)
                    setCancelCall(false)
                    navigate(0)
                } catch (error) {
                    console.error(error)
                    setCancelCall(false)
                }
            }
            sendApiRequest()
        }
    }, [cancelCall, navigate])

    const handleApiCall = (trigger: boolean, setTrigger: React.Dispatch<React.SetStateAction<boolean>>, isPacking: boolean) => {
        if (trigger) {
            particularApiCall(action, invoice_id, partner?.value, navigate, isPacking, binNumber)
            setTrigger(false)
        }
    }

    useEffect(() => {
        handleApiCall(triggerAcceptedCall, setTriggerAcceptedCall, false)
        handleApiCall(triggerOutDeliveryCall, setTriggerOutDeliveryCall, false)
        handleApiCall(triggerPackCall, setTriggerPackCall, true)
        handleApiCall(triggerShipCall, setTriggerShipCall, false)
        handleApiCall(triggerDeliveryCall, setTriggerDeliveryCall, false)
        handleApiCall(triggerExchangeCall, setTriggerExchangeCall, false)
    }, [triggerPackCall, triggerShipCall, triggerDeliveryCall, action, invoice_id, partner, navigate])

    const handlePartnerSelect = (selectedValue: any) => {
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''
        setPartner({ value: selectedValue, label: selectedLabel })
    }

    const { buttonText, modalContent: content } = getButtonAndModalContent(data, mainData, delivery_type)

    return (
        <Card className="mb-10 flex flex-col">
            <h5 className="mb-4">Activity</h5>
            <Timeline className="mb-5">
                {data.length === 0 ? (
                    <p>No activity data available.</p>
                ) : (
                    data.map((activity, i) => (
                        <Timeline.Item
                            key={activity.status + i}
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
                )}
            </Timeline>

            {isDeliveryCreated && !isPacked && !isOrderDone ? (
                <Button variant="solid" onClick={() => showModal('Pick and Pack')}>
                    PACK/REJECT
                </Button>
            ) : (
                buttonText && (
                    <div className="flex flex-col gap-3 items-center">
                        <Button variant="solid" onClick={() => showModal(content)}>
                            {buttonText}
                        </Button>
                    </div>
                )
            )}
            <div className="flex items-center justify-center mt-3">
                {data[data.length - 1]?.status === 'RTO_DELIVERED' && (
                    <Button className="ml-2" variant="reject" onClick={() => setRtoCancel(true)}>
                        Cancel
                    </Button>
                )}
            </div>

            {rejectModal && (
                <div className="flex justify-center items-center h-screen">
                    <RejectModal
                        desc="Are you sure you want to reject this order"
                        title="REJECT ORDER"
                        isOpen={rejectModal}
                        text="REJECT"
                        handleOk={() => {
                            setAction('PACKED')
                            setCancelCall(true)
                        }}
                        onClose={() => setRejectModal(false)}
                    />
                </div>
            )}

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

            {buttonText === 'OUT FOR DELIVERY' && mainData?.delivery_type === 'STANDARD' && (
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
            {buttonText === 'OUT FOR DELIVERY' && mainData?.delivery_type !== 'STANDARD' && (
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

            <div style={{ zIndex: 1000 }}>
                <RtoCancelModal isOpen={rtoCancel} setIsOpen={setRtoCancel} orderItems={product} invoice_id={invoice_id} />
            </div>
        </Card>
    )
}

export default Activity
