/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import Button from '@/components/ui/Button'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CustomModal2, CustomModal3, CustomModal4, CustomModal5, ExchangeModal, RejectModal } from './Modal'
import { ActivityProps, LOGISTIC_PARTNER } from './activityCommon'
import { buildPackOrderPayload, getButtonAndModalContent, usePackOrder } from './activityFunctions'
import RtoCancelModal from '../orderDetailsUtils/RtoCancelModal'
import OrderCameraModal from './OrderCameraModal'
import { newOrderService } from '@/store/services/newOrderaService'
import { EOrderButton, EOrderStatus } from '../orderList.common'
import PackModal from './PackModal'

const Activity = ({ data = [], status, invoice_id, mainData, delivery_type, refetch }: ActivityProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<{ [key: number]: number }>({})
    const [action, setAction] = useState('')
    const [triggerApiCall, setTriggerApiCall] = useState(false)
    const [triggerPackCall, setTriggerPackCall] = useState(false)
    const [cancelCall, setCancelCall] = useState(false)
    const navigate = useNavigate()
    const [partner, setPartner] = useState<{ value: string; label: string } | null>(null)
    const fulfilledIDs = Object.keys(fulfilledQuantities)
    const [rejectModal, setRejectModal] = useState(false)
    const [rtoCancel, setRtoCancel] = useState(false)
    const [bagsCount, setBagsCount] = useState('1')
    const [binNumber, setBinNumber] = useState('1')
    const [selectedLocations, setSelectedLocations] = useState<{ [productId: number]: { [location: string]: number } }>({})
    const [selectedReasons, setSelectedReasons] = useState<Record<number, string>>({})
    const [isPhotoCamera, setIsPhotoCamera] = useState(false)
    const [currentId, setCurrentId] = useState<number | null>(null)
    const [storePhoto, setStorePhoto] = useState<{ [key: number]: string[] }>({})
    const [updateOrder, updateResponse] = newOrderService.useUpdateOrderMutation()
    const [packOrder, packResponse] = newOrderService.useUpdateOrderMutation()
    const rejectData = mainData.order_items?.filter((item) => !fulfilledIDs.includes(item.id.toString()))?.map((item) => item.id)

    const hasStatus = useCallback((status: string) => data.some((log) => log.status === status), [data])
    const isExchangeComplete = hasStatus(EOrderStatus.exchange_delivered)
    const isPacked = hasStatus(EOrderStatus.packed)
    const isDeliveryCreated = hasStatus(EOrderStatus.delivery_created)
    const isOrderDone = hasStatus(EOrderStatus.delivered) || hasStatus(EOrderStatus.completed)

    const lastLogStatus = useMemo(() => {
        return data[data.length - 1]?.status
    }, [data])

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    useEffect(() => {
        if (updateResponse.isSuccess) {
            if (updateResponse.originalArgs?.data.action === EOrderStatus.add_item_packing) {
                notification.success({ message: updateResponse.data.message || 'photo has been set' })
                setStorePhoto([])
            } else {
                notification.success({ message: 'Successfully Updated' })
                setTriggerApiCall(false)
                setIsModalOpen(false)
            }
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
            setTriggerPackCall(false)
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
            action: EOrderStatus.add_item_packing,
            dashboard: false,
            data: { item_id: id, packing_image: images?.join(',') },
        }
        updateOrder({ id: invoice_id as string, data: bodyData }).unwrap()
    }

    const handleSelectChange = (id: number, value: string) => {
        setFulfilledQuantities((prevQuantities) => ({ ...prevQuantities, [id]: parseInt(value, 10) }))
    }

    const { handlePack } = usePackOrder({
        mainData,
        selectedLocations,
        fulfilledQuantities,
        status,
        bagsCount,
        setTriggerPackCall,
        selectedReasons,
    })

    useEffect(() => {
        if (!triggerPackCall) return
        const result = handlePack()
        if (!result) return
        const { zeroQty, required, fulfilled, data, selectedReasons } = result
        const executeApi = async () => {
            const body = buildPackOrderPayload({
                action,
                data,
                bagsCount,
                binNumber,
                selectedReasons,
            })
            packOrder({ id: invoice_id as string, data: body })
        }
        if (zeroQty) {
            Modal.confirm({
                title: 'Confirm Zero Quantity',
                content: 'One or more items have a quantity of 0. Do you still want to proceed?',
                onOk: executeApi,
                onCancel: () => setTriggerPackCall(false),
            })
            return
        }
        if (required > fulfilled) {
            Modal.confirm({
                title: 'Confirm Quantity for Packing',
                content: 'The number of fulfilled quantity is less than actual quantity!',
                onOk: executeApi,
                onCancel: () => setTriggerPackCall(false),
            })
            return
        }
        executeApi()
    }, [triggerPackCall])

    useEffect(() => {
        if (!cancelCall) return
        ;(async () => {
            try {
                const cancelData = rejectData?.reduce((acc: any, id: any) => {
                    acc[id] = 0
                    return acc
                }, {})

                const body = { action, data: cancelData }
                await updateOrder({ id: invoice_id as string, data: body }).unwrap()
                setIsModalOpen(false)
                setCancelCall(false)
                refetch()
            } catch (error) {
                setCancelCall(false)
            }
        })()
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
        if (triggerApiCall && action !== EOrderStatus.packed) {
            let body: any = { action }
            if (action === EOrderStatus.created_delivery) {
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
                {data[data.length - 1]?.status === EOrderStatus.rto_delivered && (
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
                            setAction(EOrderStatus.packed)
                            setCancelCall(true)
                        }}
                        onClose={() => setRejectModal(false)}
                    />
                </div>
            )}

            {data.length === 0 && (
                <CustomModal5
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction(EOrderStatus.accepted)}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    invoice={invoice_id}
                    isButtonClick={updateResponse.isLoading}
                />
            )}

            {lastLogStatus === EOrderStatus.packed && (
                <CustomModal2
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction(EOrderStatus.created_delivery)}
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
            {(lastLogStatus === EOrderStatus.accepted || lastLogStatus === EOrderStatus.picking) && (
                <PackModal
                    isModalOpen={isModalOpen}
                    handleOk={() => {
                        setAction(EOrderStatus.packed)
                        setTriggerPackCall(true)
                    }}
                    handleCancel={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    invoice_id={invoice_id}
                    payment={mainData.payment}
                    product={mainData.order_items}
                    fulfilledQuantities={fulfilledQuantities}
                    handleSelectChange={handleSelectChange}
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
                    setSelectedReason={setSelectedReasons}
                    selectedReason={selectedReasons}
                />
            )}

            {buttonText === EOrderButton.out_for_delivery && mainData?.delivery_type === EOrderButton.standard && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction(EOrderStatus.shipped)}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={updateResponse.isLoading}
                />
            )}
            {buttonText === EOrderButton.out_for_delivery && mainData?.delivery_type !== EOrderButton.standard && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction(EOrderStatus.shipped)}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={updateResponse.isLoading}
                />
            )}

            {buttonText === EOrderButton.mark_as_delivered && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction(EOrderStatus.delivered)}
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={updateResponse.isLoading}
                />
            )}

            {buttonText === EOrderButton.exchange_delivered && !isExchangeComplete && (
                <ExchangeModal
                    isModalOpen={isModalOpen}
                    handlePack={() => handleAction(EOrderStatus.exchange_delivered)}
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
            <OrderCameraModal
                isOpen={isPhotoCamera}
                currentId={currentId as number}
                setIsOpen={setIsPhotoCamera}
                setStorePhoto={setStorePhoto}
            />
        </Card>
    )
}

export default React.memo(Activity)
