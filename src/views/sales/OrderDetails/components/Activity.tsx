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
import { CustomModal, CustomModal2, CustomModal3, CustomModal4, CustomModal5, ExchangeModal } from './Modal'
import { LOGISTIC, LOGISTIC_PARTNER, Payment, Product } from './activityCommon'
import { SalesOrderDetailsResponse } from '../orderList.common'
import DialogConfirm from '@/common/DialogConfirm'

type Event = {
    timestamp: string
    status: string
}

type ActivityProps = {
    mainData: SalesOrderDetailsResponse
    data?: Event[]
    status: string
    product?: Product[]
    payment?: Payment
    invoice_id?: string
    logistic: LOGISTIC
    delivery_type: string
}

const Activity = ({ data = [], status, product = [], payment, invoice_id, logistic, mainData, delivery_type }: ActivityProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<{ [key: number]: number }>({})
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [action, setAction] = useState('')
    const [triggerApiCall, setTriggerApiCall] = useState(false)
    const [triggerAcceptedCall, setTriggerAcceptedCall] = useState(false)
    const [triggerpackCall, setTriggerpackCall] = useState(false)
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

    const rejectData = mainData.order_items?.filter((item) => !fulfilledIDs.includes(item.id.toString()))?.map((item) => item.id)

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    const handleSelectChange = (id: number, value: string) => {
        setFulfilledQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: parseInt(value, 10),
        }))
    }

    const handleOk = () => {
        setAction('PACKED')
        setTriggerApiCall(true)
        setButtonAfterClick(true)
    }

    useEffect(() => {
        if (triggerApiCall) {
            const sendApiRequest = async () => {
                try {
                    // Process fulfilledQuantities to filter out 0 or negative values
                    const data = Object.entries(fulfilledQuantities).reduce(
                        (acc, [id, quantity]: any) => {
                            if (quantity > 0) {
                                acc[id] = quantity
                            }
                            return acc
                        },
                        {} as { [key: number]: number },
                    )

                    // If data is empty, show notification and prevent the API call

                    if (Object.keys(data).length === 0) {
                        notification.warning({
                            message: 'No Quantities Selected',
                            description: 'Please select at least one item with a valid quantity to proceed.',
                        })
                        setTriggerApiCall(false) // Reset triggerApiCall
                        return
                    }

                    // If any quantity is 0, show a confirmation modal
                    const hasZeroQuantity = Object.values(fulfilledQuantities).some((q) => q === 0)
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
                                setTriggerApiCall(false)
                            },
                        })
                        return
                    }

                    const hasLessQuantity =
                        product.reduce((sum, item) => sum + Number(item?.quantity || 0), 0) >
                        Object.values(fulfilledQuantities).reduce((sum, q) => sum + (q || 0), 0)
                    if (hasLessQuantity && !hasZeroQuantity) {
                        Modal.confirm({
                            title: 'Confirm Quantity for Packing',
                            content: 'The number of fullfilled quantity is less then actual quantity !',
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

                    // If all checks pass, call the API
                    await makeApiCall(data)
                } catch (error) {
                    console.error(error)
                    setTriggerApiCall(false) // Reset triggerApiCall on error
                }
            }

            // Helper function to make the API call
            const makeApiCall = async (data: { [key: number]: number }) => {
                const body = {
                    action,
                    data,
                }
                console.log('Accepted Data', data)

                const response = await axiosInstance.patch(`merchant/order/${invoice_id}`, body)
                console.log(response)
                setIsModalOpen(false)
                setTriggerApiCall(false)
                navigate(0)
            }
            sendApiRequest()
        }
    }, [triggerApiCall, navigate])

    const handleReject = () => {
        const hasFulfilledQty = Object.values(fulfilledQuantities).some((item) => item > 0)

        if (hasFulfilledQty) {
            setTimeout(() => {
                setErrorMessage('QUANTITY OF ITEMS SHOULD BE 0')
            }, 2000)
        } else {
            setRejectModal(true)
            setIsModalOpen(false)
        }
    }

    const handleRejectModalConfirm = () => {
        setAction('PACKED')

        setCancelCall(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        if (cancelCall) {
            const sendApiRequest = async () => {
                try {
                    const data = Object.entries(fulfilledQuantities)?.reduce((acc) => acc, {} as { [key: number]: number })
                    console.log(data)
                    const cancelData = rejectData?.reduce((acc: any, id: any) => {
                        acc[id] = 0
                        return acc
                    }, {})

                    console.log('after reject', cancelData)

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

    const particularApiCall = async (
        action: string,
        invoice_id: string | undefined,
        partnerValue: string | undefined,
        navigate: any,
        isDelivery: boolean = true,
    ) => {
        try {
            const body = isDelivery ? { action, delivery_partner: partnerValue } : { action }
            if (isDelivery && !partnerValue) {
                notification.error({
                    message: 'Select Partner to continue',
                })
                return
            }
            const response = await axiosInstance.patch(`merchant/order/${invoice_id}`, body)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Order status updated successfully.',
            })
            navigate(0)
        } catch (error: any) {
            console.error(error)
            const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'
            notification.error({
                message: 'Error',
                description: errorMessage,
            })
        }
    }

    const handleApiCall = (trigger: boolean, setTrigger: React.Dispatch<React.SetStateAction<boolean>>, isPacking: boolean) => {
        console.log('sett')
        if (trigger) {
            particularApiCall(action, invoice_id, partner?.value, navigate, isPacking)
            setTrigger(false)
        }
    }

    useEffect(() => {
        handleApiCall(triggerAcceptedCall, setTriggerAcceptedCall, false)
        handleApiCall(triggerOutDeliveryCall, setTriggerOutDeliveryCall, false)
        handleApiCall(triggerpackCall, setTriggerpackCall, true)
        handleApiCall(triggerShipCall, setTriggerShipCall, false)
        handleApiCall(triggerDeliveryCall, setTriggerDeliveryCall, false)
        handleApiCall(triggerExchangeCall, setTriggerExchangeCall, false)
    }, [triggerpackCall, triggerShipCall, triggerDeliveryCall, action, invoice_id, partner, navigate])

    const handlePack = () => {
        setAction('CREATE_DELIVERY')
        setTriggerpackCall(true)
        setButtonAfterClick(true)
    }

    const handleAccept = () => {
        setAction('ACCEPTED')
        setTriggerAcceptedCall(true)
        setButtonAfterClick(true)
    }

    const handleShip = () => {
        setAction('SHIPPED')
        setTriggerShipCall(true)
        setButtonAfterClick(true)
    }

    const handleDelivery = () => {
        setAction('DELIVERED')
        setTriggerDeliveryCall(true)
        setButtonAfterClick(true)
    }

    const handleExchange = () => {
        setAction('EXCHANGE_DELIVERED')
        setTriggerExchangeCall(true)
        setButtonAfterClick(true)
    }

    const handlePartnerSelect = (selectedValue: any) => {
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''
        setPartner({ value: selectedValue, label: selectedLabel })
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    const getButtonAndModalContent = (data: Event[], mainData?: { delivery_type?: string }) => {
        if (data.length === 0) {
            return { buttonText: 'ACCEPT' }
        }

        const lastLogStatus = data[data.length - 1]?.status || null
        const hasStatus = (status: string) => data.some((log) => log.status === status)
        const isPacked = hasStatus('PACKED')
        const isDeliveryCreated = hasStatus('DELIVERY_CREATED')
        const isOutForDelivery = hasStatus('OUT_FOR_DELIVERY') || hasStatus('SHIPPED')
        const isDriverAssigned = lastLogStatus === 'DRIVER_ASSIGNED'
        const isOrderDone = hasStatus('DELIVERED') || hasStatus('COMPLETED')
        const isOrderCancelled = hasStatus('DECLINED') || hasStatus('CANCELLED')
        const isShipped = hasStatus('SHIPPED') || hasStatus('OUT_FOR_DELIVERY')
        const isExchangeComplete = hasStatus('EXCHANGE_DELIVERED')

        console.log('mainData?.delivery_type', delivery_type)

        if (isDriverAssigned && isPacked && mainData?.delivery_type === 'STANDARD' && !isOrderDone && !isOrderCancelled) {
            return { buttonText: 'MARK AS SHIPPED', modalContent: 'Mark as Shipped' }
        }
        if (isDriverAssigned && isPacked && mainData?.delivery_type !== 'STANDARD' && !isOrderDone && !isOrderCancelled) {
            return { buttonText: 'OUT FOR DELIVERY', modalContent: 'Out for Delivery' }
        }
        if (isDeliveryCreated && !isPacked && !isOrderDone && !isOrderCancelled) {
            return { buttonText: 'PACK/REJECT', modalContent: 'Pick and Pack' }
        }
        if (isDeliveryCreated && isPacked && !isOutForDelivery && !isOrderDone && !isOrderCancelled) {
            const buttonText = mainData?.delivery_type === 'STANDARD' ? 'MARK AS SHIPPED' : 'OUT FOR DELIVERY'
            return { buttonText, modalContent: buttonText.replace('MARK AS ', '') }
        }
        if (lastLogStatus === 'DELIVERY_CREATED' || lastLogStatus === 'OUT_FOR_PICKUP') {
            const buttonText = mainData?.delivery_type === 'STANDARD' ? 'MARK AS SHIPPED' : 'OUT FOR DELIVERY'
            return { buttonText, modalContent: buttonText.replace('MARK AS ', '') }
        }
        if (isOrderDone && delivery_type === 'EXCHANGE' && !isExchangeComplete) {
            console.log('yhis statw')
            return { buttonText: 'EXCHANGE DELIVERED', modalContent: 'Exchange Delivered' }
        }
        if (lastLogStatus === 'PACKED') {
            return { buttonText: 'CREATE DELIVERY' }
        }
        if (lastLogStatus === 'ACCEPTED') {
            return { buttonText: 'PACK/REJECT', modalContent: 'Pick and Pack' }
        }
        if (isShipped && !isOrderDone && !isOrderCancelled) {
            return { buttonText: 'MARK AS DELIVERED' }
        }
        if (lastLogStatus === 'CANCELLED') {
            return { buttonText: '' }
        }

        return { buttonText: '', modalContent: '' }
    }
    const { buttonText, modalContent: content } = getButtonAndModalContent(data)
    const isPacked = data.some((log) => log?.status === 'PACKED')
    const isDeliveryCreated = data.some((log) => log?.status === 'DELIVERY_CREATED')
    const isOrderDone = data.some((log) => log.status === 'DELIVERED' || log.status === 'COMPLETED')
    const isExchangeComplete = hasStatus('EXCHANGE_DELIVERED')

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
                            <div>{moment(activity.timestamp).format('DD:MM:YYYY hh:mm')}</div>
                        </Timeline.Item>
                    ))
                )}
            </Timeline>

            {/* buttons........................................................................................................ */}

            {isDeliveryCreated && !isPacked && !isOrderDone ? (
                <Button variant="solid" onClick={() => showModal('Pick and Pack')}>
                    PACK/REJECT
                </Button>
            ) : (
                buttonText && (
                    <Button variant="solid" onClick={() => showModal(content)}>
                        {buttonText}
                    </Button>
                )
            )}

            {rejectModal && (
                <div className="z-1000">
                    <DialogConfirm
                        IsConfirm
                        IsOpen={rejectModal}
                        headingName="Reject Orders"
                        setIsOpen={setRejectModal}
                        onDialogOk={handleRejectModalConfirm}
                    />
                </div>
            )}

            {data.length === 0 && (
                <CustomModal5
                    isModalOpen={isModalOpen}
                    handlePack={handleAccept}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    invoice={invoice_id}
                    isButtonClick={buttonAfterClick}
                />
            )}

            {data[data.length - 1]?.status === 'PACKED' && (
                <CustomModal2
                    isModalOpen={isModalOpen}
                    handlePack={handlePack}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    logistic={logistic}
                    handlePartnerSelect={handlePartnerSelect}
                    partner={partner?.label}
                    isButtonClick={buttonAfterClick}
                />
            )}
            {data[data.length - 1]?.status === 'ACCEPTED' && (
                <CustomModal
                    isModalOpen={isModalOpen}
                    handleOk={handleOk}
                    handleCancel={handleCancel}
                    modalContent={modalContent}
                    handleReject={handleReject}
                    status={status}
                    invoice_id={invoice_id}
                    payment={payment}
                    product={product}
                    fulfilledQuantities={fulfilledQuantities}
                    handleSelectChange={handleSelectChange}
                    errorMessage={errorMessage || undefined}
                    isButtonClick={buttonAfterClick}
                />
            )}

            {buttonText === 'OUT FOR DELIVERY' && mainData?.delivery_type === 'STANDARD' && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={handleShip}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )}
            {buttonText === 'OUT FOR DELIVERY' && mainData?.delivery_type !== 'STANDARD' && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={handleShip}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )}

            {buttonText === 'MARK AS DELIVERED' && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={buttonAfterClick}
                />
            )}
            {buttonText === 'MARK AS DELIVERED' && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={buttonAfterClick}
                />
            )}

            {buttonText === 'EXCHANGE DELIVERED' && !isExchangeComplete && (
                <ExchangeModal
                    isModalOpen={isModalOpen}
                    handlePack={handleExchange}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    invoice={invoice_id}
                    isButtonClick={buttonAfterClick}
                />
            )}
        </Card>
    )
}

export default Activity
