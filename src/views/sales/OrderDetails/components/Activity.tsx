/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import Button from '@/components/ui/Button'
import React, { useState, useEffect, useMemo } from 'react'
import { Modal, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CustomModal, CustomModal2, CustomModal3, CustomModal4, CustomModal5, ExchangeModal, RejectModal } from './Modal'
import { ActivityProps, LOGISTIC_PARTNER } from './activityCommon'
import { getButtonAndModalContent } from './activityFunctions'
import RtoCancelModal from '../orderDetailsUtils/RtoCancelModal'
import OrderCameraModal from './OrderCameraModal'
import { newOrderService } from '@/store/services/newOrderaService'

const Activity = ({ data = [], status, invoice_id, mainData, delivery_type, refetch }: ActivityProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<{ [key: number]: number }>({})
    const [errorText, setErrorText] = useState<string | null>(null)
    const [action, setAction] = useState('')
    const [triggerApiCall, setTriggerApiCall] = useState(false)
    const [triggerPackCall, setTriggerPackCall] = useState(false)
    const [cancelCall, setCancelCall] = useState(false)
    const navigate = useNavigate()
    const [partner, setPartner] = useState<{ value: string; label: string } | null>(null)
    const fulfilledIDs = Object.keys(fulfilledQuantities)
    const [rejectModal, setRejectModal] = useState(false)
    const hasStatus = (status: string) => data.some((log) => log.status === status)
    const isExchangeComplete = hasStatus('EXCHANGE_DELIVERED')
    const [rtoCancel, setRtoCancel] = useState(false)
    const [bagsCount, setBagsCount] = useState('1')
    const [binNumber, setBinNumber] = useState('1')
    const [selectedLocations, setSelectedLocations] = useState<{ [productId: number]: { [location: string]: number } }>({})
    const [isPhotoCamera, setIsPhotoCamera] = useState(false)
    const [currentId, setCurrentId] = useState<number | null>(null)
    const [storePhoto, setStorePhoto] = useState<{ [key: number]: string[] }>({})
    const [updateOrder, updateResponse] = newOrderService.useUpdateOrderMutation()
    const [packOrder, packResponse] = newOrderService.useUpdateOrderMutation()
    const rejectData = mainData.order_items?.filter((item) => !fulfilledIDs.includes(item.id.toString()))?.map((item) => item.id)

    const isPacked = useMemo(() => {
        return data.some((log) => log?.status === 'PACKED')
    }, [data])

    const isDeliveryCreated = useMemo(() => {
        return data.some((log) => log?.status === 'DELIVERY_CREATED')
    }, [data])
    const isOrderDone = useMemo(() => {
        return data.some((log) => log.status === 'DELIVERED' || log.status === 'COMPLETED')
    }, [data])

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    useEffect(() => {
        if (updateResponse.isSuccess) {
            notification.success({ message: 'Successfully Updated' })
            setTriggerApiCall(false)
            setIsModalOpen(false)
            refetch()
        }
        if (updateResponse.isError) {
            notification.error({ message: (updateResponse.error as any).data.message })
            setTriggerApiCall(false)
        }
    }, [updateResponse.isSuccess, updateResponse.isError])

    useEffect(() => {
        if (packResponse.isSuccess) {
            notification.success({ message: 'Successfully Packed the order' })
            setTriggerPackCall(false)
            setIsModalOpen(false)
            refetch()
        }
        if (packResponse.isError) {
            notification.error({ message: (packResponse.error as any).data.message })
            setTriggerApiCall(false)
        }
    }, [packResponse.isSuccess, packResponse.isError])

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
                return { ...prev, [productId]: { ...productLocations, [location]: currentCount + 1 } }
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

    const handleSetPhoto = async (id: number, images: string[]) => {
        const bodyData = {
            action: 'ADD_ITEM_PACKING_IMAGES',
            dashboard: false,
            data: { item_id: id, packing_image: images?.join(',') },
        }
        try {
            const res = await updateOrder({ id: invoice_id as string, data: bodyData }).unwrap()
            notification.success({ message: res?.message || 'photo has been set' })
            setStorePhoto([])
        } catch (error) {
            notification.error({ message: 'Failed to set the photo' })
        }
    }

    const handleSelectChange = (id: number, value: string) => {
        setFulfilledQuantities((prevQuantities) => ({ ...prevQuantities, [id]: parseInt(value, 10) }))
    }

    useEffect(() => {
        if (triggerPackCall) {
            const sendApiRequest = async () => {
                try {
                    if (status === 'ACCEPTED' && !bagsCount) {
                        notification.error({ message: 'Number of bags Required' })
                        setInterval(() => {
                            navigate(0)
                        }, 3000)
                        return
                    }
                    const itemsWithLocationDetails = mainData?.order_items?.filter(
                        (item) =>
                            item.location_details &&
                            Object.values(item.location_details).reduce((sum, qty) => sum + qty, 0) >= parseInt(item.quantity),
                    )
                    const itemsWithoutLocationDetails = mainData?.order_items?.filter(
                        (item) =>
                            !item.location_details ||
                            Object.values(item.location_details).reduce((sum, qty) => sum + qty, 0) < parseInt(item.quantity),
                    )
                    const data: Record<number, any> = {}
                    if (itemsWithLocationDetails?.length) {
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
                    if (itemsWithoutLocationDetails?.length) {
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
                        notification.warning({ message: 'Please select at least one item with a valid quantity to proceed.' })
                        setTriggerPackCall(false)
                        return
                    }
                    const hasZeroQuantity =
                        Object.values(selectedLocations).some((locations) => Object.values(locations).some((count) => count === 0)) ||
                        Object.values(fulfilledQuantities).some((quantity) => quantity === 0)

                    if (hasZeroQuantity) {
                        Modal.confirm({
                            title: 'Confirm Zero Quantity',
                            content: 'One or more items have a quantity of 0. Do you still want to proceed?',
                            okText: 'Yes',
                            cancelText: 'No',
                            onOk: async () => {
                                await makeApiCall(data)
                            },
                            onCancel: () => {
                                setTriggerPackCall(false)
                            },
                        })
                        return
                    }
                    const totalRequiredQuantity = mainData?.order_items?.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
                    const totalFulfilledQuantity =
                        Object.values(selectedLocations)
                            .flatMap((locs) => Object.values(locs))
                            .reduce((sum, curr) => sum + curr, 0) + Object.values(fulfilledQuantities).reduce((sum, q) => sum + (q || 0), 0)

                    const hasLessQuantity = totalRequiredQuantity && totalRequiredQuantity > totalFulfilledQuantity
                    if (hasLessQuantity && !hasZeroQuantity) {
                        Modal.confirm({
                            title: 'Confirm Quantity for Packing',
                            content: 'The number of fulfilled quantity is less than actual quantity!',
                            okText: 'Yes',
                            cancelText: 'No',
                            onOk: async () => {
                                await makeApiCall(data)
                            },
                            onCancel: () => {
                                setTriggerPackCall(false)
                            },
                        })
                        return
                    }
                    await makeApiCall(data)
                } catch (error) {
                    setTriggerPackCall(false)
                }
            }
            const makeApiCall = async (data: { [key: number]: number }) => {
                const body = {
                    action,
                    data,
                    ...(bagsCount ? { packets_count: Number(bagsCount) } : {}),
                    ...(binNumber ? { bin_id: binNumber } : {}),
                }
                packOrder({ id: invoice_id as string, data: body })
            }
            sendApiRequest()
        }
    }, [triggerPackCall])

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
                    const body = { action, data: cancelData }
                    await updateOrder({ id: invoice_id as string, data: body }).unwrap()
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

    const handlePartnerSelect = (selectedValue: any) => {
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''
        setPartner({ value: selectedValue, label: selectedLabel })
    }

    const { buttonText, modalContent: content } = getButtonAndModalContent(data, mainData, delivery_type)

    const handleAction = (value: string) => {
        setAction(value)
        setTriggerApiCall(true)
    }

    useEffect(() => {
        if (triggerApiCall && action !== 'PACKED') {
            let body: any = { action }
            if (action === 'CREATE_DELIVERY') {
                body = { action, delivery_partner: partner?.value, bin_number: binNumber }
                if (!partner?.value) {
                    notification.error({
                        message: 'Select Partner to continue',
                    })
                    return
                }
            }

            updateOrder({ id: invoice_id as string, data: body })
        }
    }, [triggerApiCall, action, partner?.value, binNumber])

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
                            <div>{moment(activity.timestamp).format('DD-MM-YYYY hh:mm a')}</div>
                            <div className="font-semibold text-md">{activity.event_note && activity.event_note}</div>
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
                    handlePack={() => handleAction('ACCEPTED')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    invoice={invoice_id}
                    isButtonClick={updateResponse.isLoading}
                />
            )}

            {data[data.length - 1]?.status === 'PACKED' && (
                <CustomModal2
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction('CREATE_DELIVERY')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    handlePartnerSelect={handlePartnerSelect}
                    partner={partner?.label}
                    isButtonClick={updateResponse.isLoading}
                    binNumber={binNumber}
                    setBinNumber={setBinNumber}
                />
            )}
            {(data[data.length - 1]?.status === 'ACCEPTED' || data[data.length - 1]?.status === 'PICKING') && (
                <CustomModal
                    isModalOpen={isModalOpen}
                    handleOk={() => {
                        setAction('PACKED')
                        setTriggerPackCall(true)
                    }}
                    handleCancel={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    handleReject={handleReject}
                    status={status}
                    invoice_id={invoice_id}
                    payment={mainData.payment}
                    product={mainData.order_items}
                    fulfilledQuantities={fulfilledQuantities}
                    handleSelectChange={handleSelectChange}
                    errorMessage={errorText || undefined}
                    isButtonClick={packResponse.isLoading}
                    bagsCount={bagsCount}
                    setBagsCount={setBagsCount}
                    handleLocationClick={handleLocationClick}
                    handleRemoveLocation={handleRemoveLocation}
                    selectedLocations={selectedLocations}
                    setCurrentId={setCurrentId}
                    setIsPhotoCamera={setIsPhotoCamera}
                    storePhoto={storePhoto}
                    setStorePhoto={setStorePhoto}
                    handleSetPhoto={handleSetPhoto}
                />
            )}

            {buttonText === 'OUT FOR DELIVERY' && mainData?.delivery_type === 'STANDARD' && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction('SHIPPED')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                />
            )}
            {buttonText === 'OUT FOR DELIVERY' && mainData?.delivery_type !== 'STANDARD' && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction('SHIPPED')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                />
            )}

            {buttonText === 'MARK AS DELIVERED' && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction('DELIVERED')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={updateResponse.isLoading}
                />
            )}

            {buttonText === 'EXCHANGE DELIVERED' && !isExchangeComplete && (
                <ExchangeModal
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction('EXCHANGE_DELIVERED')}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    invoice={invoice_id}
                    isButtonClick={updateResponse.isLoading}
                />
            )}

            <div style={{ zIndex: 1000 }}>
                <RtoCancelModal isOpen={rtoCancel} setIsOpen={setRtoCancel} orderItems={mainData.order_items} invoice_id={invoice_id} />
            </div>
            {
                <OrderCameraModal
                    isOpen={isPhotoCamera}
                    currentId={currentId as number}
                    setIsOpen={setIsPhotoCamera}
                    setStorePhoto={setStorePhoto}
                />
            }
        </Card>
    )
}

export default React.memo(Activity)
