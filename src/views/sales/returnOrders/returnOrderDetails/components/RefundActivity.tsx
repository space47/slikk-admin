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
import { DeliveredModal, InTransitModal, OutForDeliveryModal, OutforDeliveryModal, PickedUpModal } from './RefundModal'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'

// type LOGS = {
//     data: any
// }

// type Event = {
//     timestamp: string
//     status: string
// }

const RefundActivity = () => {
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnDetails = returnOrder?.returnOrders
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState('')

    // State for the status

    const [triggerPickUpCreated, setTriggerPickupCreated] = useState<boolean>(false)
    const [triggerOutForPickup, setTriggerOutForPickup] = useState<boolean>(false)
    const [triggerPickedUp, setTriggerPickedUp] = useState<boolean>(false)
    const [triggerIntransit, setTriggerIntransit] = useState<boolean>(false)
    const [triggerOutForDelivery, setTriggerOutForDelivery] = useState<boolean>(false)
    const [triggerDelivered, setTriggerDelivered] = useState<boolean>(false)
    const [triggerCancelled, setTriggerCancelled] = useState<boolean>(false)
    const [triggerPickedUpGenerate, setTriggerPickedUpGenerate] = useState<boolean>(false)
    const [triggerComplete, setTriggerComplete] = useState<boolean>(false)
    const [valueInsideModal, setValueInsideModal] = useState({
        refundAmount: '',
        refundId: '',
    })

    const [modalContent, setModalContent] = useState<string>()
    const navigate = useNavigate()

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    const getButtonAndModalContent = (status: string) => {
        switch (status) {
            // case 'CANCELLED':
            // case 'APPROVED':
            case '':
                return {
                    buttonText: 'CREATE REVERSE PICKUP',
                }
            case 'PICKUP_CREATED':
            case 'REVERSE_PICKUP_CREATED':
                return {
                    buttonText: 'OUT FOR PICKUP',
                }
            case 'OUT_FOR_PICKUP':
                return {
                    buttonText: 'PICKED UP',
                }
            case 'PICKED_UP':
                return {
                    buttonText: 'IN TRANSIT',
                }
            case 'SHIPPED':
            case 'IN_TRANSIT':
                return {
                    buttonText: 'OUT_FOR_DELIVERY',
                }

            case 'OUT_FOR_DELIVERY':
                return {
                    buttonText: 'DELIVERED',
                }
            case 'DELIVERED':
                return {
                    buttonText: 'COMPLETE RETURN', // isme ek naya modal banaunga with the inputs and and send it to the body
                }

            default:
                return {
                    buttonText: '',
                    modalContent: '',
                }
        }
    }

    const { buttonText, modalContent: content } = getButtonAndModalContent(returnDetails?.log?.[returnDetails.log.length - 1]?.status || '')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValueInsideModal((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // PICKED UP STATUS.............................

    const handleEmptyLog = () => {
        setIsModalOpen(true)
        // action ko PICKUP_CREATED kr dunga
    }
    const handlePICKUPGenerate = () => {
        console.log('OK')
        setAction('create_reverse_pickup')
        setTriggerPickedUpGenerate(true)
    }

    useEffect(() => {
        if (triggerPickedUpGenerate) {
            const sendApiRequest = async () => {
                try {
                    let body = {
                        action,
                        re_create: 'no',
                    }

                    const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

                    if (response.status === 400) {
                        body.re_create = 'yes'
                        await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
                    }

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerPickedUpGenerate(false)

                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'

                    if (error.response?.status === 400) {
                        try {
                            const bodyWithReCreate = {
                                action,
                                re_create: 'yes',
                            }
                            const retryResponse = await axiosInstance.patch(
                                `merchant/return_order/${returnDetails?.return_order_id}`,
                                bodyWithReCreate,
                            )

                            console.log(retryResponse.data)
                            notification.success({
                                message: 'Success',
                                description: retryResponse?.data?.message || 'Rider status updated successfully.',
                            })
                            navigate(0)
                        } catch (retryError: any) {
                            console.error(retryError)
                            notification.error({
                                message: 'Error',
                                description: retryError.response?.data?.message || 'Failed to update rider status with re_create.',
                            })
                        }
                    } else {
                        notification.error({
                            message: 'Error',
                            description: errorMessage,
                        })
                    }
                } finally {
                    setTriggerPickedUpGenerate(false)
                }
            }

            sendApiRequest()
        }
    }, [triggerPickedUpGenerate, navigate])

    // FOR OUT FOR DELIVERY..................................................

    const handleOutForPickup = () => {
        setAction('out_for_pickup')
        setTriggerOutForPickup(true)
    }

    useEffect(() => {
        if (triggerOutForPickup) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action: action,
                    }

                    const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerOutForPickup(false)
                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'

                    notification.error({
                        message: 'Error',
                        description: errorMessage,
                    })
                } finally {
                    setTriggerOutForPickup(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerOutForPickup, navigate])
    //.................................................................

    const handlePickedUp = () => {
        setAction('picked_up')
        setTriggerPickedUp(true)
    }

    //    function handleInTrasit() {
    //     setAction('in_transit')
    //     setTriggerIntransit(true)
    // }

    useEffect(() => {
        if (triggerPickedUp) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerPickedUp(false)
                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'

                    notification.error({
                        message: 'Error',
                        description: errorMessage,
                    })
                } finally {
                    setTriggerPickedUp(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerPickedUp, navigate])

    // In transit.............................................................
    function handleInTrasit() {
        setAction('in_transit')
        setTriggerIntransit(true)
    }

    useEffect(() => {
        if (triggerIntransit) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerIntransit(false)
                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'

                    notification.error({
                        message: 'Error',
                        description: errorMessage,
                    })
                } finally {
                    setTriggerIntransit(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerIntransit, navigate])

    // OUT FOr Delivery........................................................

    const hanldeOutForDelivery = () => {
        setAction('out_for_delivery')
        setTriggerOutForDelivery(true)
    }

    useEffect(() => {
        if (triggerOutForDelivery) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerOutForDelivery(false)
                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'

                    notification.error({
                        message: 'Error',
                        description: errorMessage,
                    })
                } finally {
                    setTriggerOutForDelivery(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerOutForDelivery, navigate])

    // Delivered............................................................

    const handleDelivered = () => {
        setAction('delivered')
        setTriggerDelivered(true)
    }

    useEffect(() => {
        if (triggerDelivered) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerDelivered(false)
                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'

                    notification.error({
                        message: 'Error',
                        description: errorMessage,
                    })
                } finally {
                    setTriggerDelivered(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerDelivered, navigate])

    // .......................................................................

    const hanldeComplete = () => {
        setAction('return_completed')
        setTriggerComplete(true)
    }

    useEffect(() => {
        if (triggerComplete) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                        reference_id: valueInsideModal.refundId,
                        return_amount: valueInsideModal.refundAmount,
                    }

                    const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerComplete(false)
                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'

                    notification.error({
                        message: 'Error',
                        description: errorMessage,
                    })
                } finally {
                    setTriggerComplete(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerComplete, navigate])

    // ........................................................................
    const handleClose = () => {
        setIsModalOpen(false)
        console.log('okkk')
    }

    return (
        <Card className="mb-10 flex flex-col">
            <h5 className="mb-4">Activity</h5>
            <Timeline className="mb-5">
                {returnDetails?.log?.[returnDetails.log.length - 1]?.status === '' ? (
                    ''
                ) : returnDetails?.log.length === 0 && returnDetails?.status === 'CANCELLED' ? (
                    <div>Order cancelled</div>
                ) : (
                    returnDetails?.log.map((activity, i) => (
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
            {/* buttons........................................................................................................ */}
            {buttonText && (
                <Button variant="solid" onClick={() => showModal(content)}>
                    {buttonText}
                </Button>
            )}

            {returnDetails?.log.length === 0 && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={handlePICKUPGenerate}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails?.status || ''}
                />
            )}

            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'REVERSE_PICKUP_CREATED' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKUP_CREATED') && (
                <OutforDeliveryModal
                    isModalOpen={isModalOpen}
                    handleoutForDelivery={handleOutForPickup}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'OUT_FOR_PICKUP' && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={handlePickedUp}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKED_UP' && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={handleInTrasit}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'IN_TRANSIT' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'SHIPPED') && (
                <OutForDeliveryModal
                    isModalOpen={isModalOpen}
                    handleOutForDelivery={hanldeOutForDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}
            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'OUT_FOR_DELIVERY' && (
                <DeliveredModal
                    isModalOpen={isModalOpen}
                    handleDelivered={handleDelivered}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'DELIVERED' && (
                <Modal open={isModalOpen} onOk={hanldeComplete} onCancel={handleClose}>
                    <div className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">INPUTS</div>
                    <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                        <input
                            type="text"
                            name="refundAmount"
                            value={valueInsideModal.refundAmount}
                            placeholder="Enter Refund Amount"
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="refundId"
                            value={valueInsideModal.refundId}
                            placeholder="Enter Refund Id"
                            onChange={handleInputChange}
                        />
                    </div>
                </Modal>
            )}
        </Card>
    )
}

export default RefundActivity
