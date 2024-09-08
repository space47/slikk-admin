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
import {
    CustomModal1,
    CustomModal2,
    CustomModal3,
    CustomModal4,
    DeliveredModal,
    InTransitModal,
    OutForDeliveryModal,
    OutforDeliveryModal,
    PickedUpModal,
} from './RefundModal'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'

type LOGS = {
    data: any
}

type Event = {
    timestamp: string
    status: string
}

const RefundActivity = () => {
    const returnOrder = useAppSelector<ReturnOrderState>(
        (state) => state.returnOrders,
    )
    const returnDetails = returnOrder?.returnOrders
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState('')

    // State for the status

    const [triggerPickUpCreated, setTriggerPickupCreated] =
        useState<boolean>(false)
    const [triggerOutForPickup, setTriggerOutForPickup] =
        useState<boolean>(false)
    const [triggerPickedUp, setTriggerPickedUp] = useState<boolean>(false)
    const [triggerIntransit, setTriggerIntransit] = useState<boolean>(false)
    const [triggerOutForDelivery, setTriggerOutForDelivery] =
        useState<boolean>(false)
    const [triggerDelivered, setTriggerDelivered] = useState<boolean>(false)
    const [triggerCancelled, setTriggerCancelled] = useState<boolean>(false)

    const [modalContent, setModalContent] = useState<string>()
    const navigate = useNavigate()

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    const getButtonAndModalContent = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return {
                    buttonText: 'CREATE RETURN PICKUP',
                }
            case 'PICKED_UP':
                return {
                    buttonText: 'OUT FOR PICKUP',
                }
            case 'OUT_FOR_PICKUP':
                return {
                    buttonText: 'IN TRANSIT',
                }
            case 'IN_TRANSIT':
                return {
                    buttonText: 'OUT_FOR_DELIVERY',
                }

            case 'OUT_OF_DELIVERY':
                return {
                    buttonText: 'DELIVERED',
                }
            case 'DELIVERED':
                return {
                    buttonText: '', // isme ek naya modal banaunga with the inputs and and send it to the body
                }
            case 'CANCELLED':
                return {
                    buttonText: '',
                }
            default:
                return {
                    buttonText: '',
                    modalContent: '',
                }
        }
    }

    const { buttonText, modalContent: content } = getButtonAndModalContent(
        returnDetails?.status || '',
    )

    // PICKED UP STATUS.............................

    const handleEmptyLog = () => {
        setIsModalOpen(true)
        // action ko PICKUP_CREATED kr dunga
    }
    const handlePICKUP = () => {
        console.log('OK')
        setAction('picked_up')
        setTriggerPickedUp(true)
    }

    useEffect(() => {
        if (triggerPickedUp) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/return_order/${returnDetails?.return_order_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerPickedUp(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Rider status updated successfully.',
                    })
                } catch (error: any) {
                    console.error(error)
                    const errorMessage =
                        error.response?.data?.message ||
                        'There was an error updating the order status. Please try again.'

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

    // FOR OUT FOR DELIVERY..................................................

    const handleDelivery = () => {
        setAction('out_for_pickup')
        setTriggerOutForPickup(true)
    }

    useEffect(() => {
        if (triggerOutForPickup) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/return_order/${returnDetails?.return_order_id}`,
                        body,
                    )

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerOutForPickup(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage =
                        error.response?.data?.message ||
                        'There was an error updating the order status. Please try again.'

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

    // In transit.............................................................
    const handleInTrasit = () => {
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

                    const response = await axiosInstance.patch(
                        `merchant/return_order/${returnDetails?.return_order_id}`,
                        body,
                    )

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerIntransit(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage =
                        error.response?.data?.message ||
                        'There was an error updating the order status. Please try again.'

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
        setAction('out_of_delivery')
        setTriggerOutForDelivery(true)
    }

    useEffect(() => {
        if (triggerOutForDelivery) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/return_order/${returnDetails?.return_order_id}`,
                        body,
                    )

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerOutForDelivery(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage =
                        error.response?.data?.message ||
                        'There was an error updating the order status. Please try again.'

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

                    const response = await axiosInstance.patch(
                        `merchant/return_order/${returnDetails?.return_order_id}`,
                        body,
                    )

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerDelivered(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (error: any) {
                    console.error(error)
                    const errorMessage =
                        error.response?.data?.message ||
                        'There was an error updating the order status. Please try again.'

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
    const handleClose = () => {
        setIsModalOpen(false)
    }

    //
    return (
        <Card className="mb-10 flex flex-col">
            <h5 className="mb-4">Activity</h5>
            <Timeline className="mb-5">
                {returnDetails?.status === ''
                    ? ''
                    : returnDetails?.log?.map((activity, i) => (
                          <Timeline.Item
                              key={activity.status + i}
                              media={
                                  <div className="flex mt-1.5">
                                      <Badge
                                          innerClass={classNames(
                                              activity.update_date
                                                  ? 'bg-emerald-500'
                                                  : 'bg-blue-500',
                                          )}
                                      />
                                  </div>
                              }
                          >
                              <div className="font-bold text-md">
                                  {activity.status}
                              </div>
                              <div>
                                  {moment(activity.update_date).format(
                                      'DD:MM:YYYY hh:mm',
                                  )}
                              </div>
                          </Timeline.Item>
                      ))}
            </Timeline>
            {/* buttons........................................................................................................ */}
            {buttonText && (
                <Button variant="solid" onClick={() => showModal(content)}>
                    {buttonText}
                </Button>
            )}

            {returnDetails?.status === 'APPROVED' && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={handlePICKUP}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails?.status || ''}
                />
            )}

            {returnDetails?.status === 'PICKED_UP' && (
                <OutforDeliveryModal
                    isModalOpen={isModalOpen}
                    handleoutForDelivery={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.status === 'OUT_FOR_PICKUP' && (
                <InTransitModal
                    isModalOpen={isModalOpen}
                    handleInTransit={handleInTrasit}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.status === 'IN_TRANSIT' && (
                <OutForDeliveryModal
                    isModalOpen={isModalOpen}
                    handleOutForDelivery={hanldeOutForDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}
            {returnDetails?.status === 'OUT_OF_DELIVERY' && (
                <DeliveredModal
                    isModalOpen={isModalOpen}
                    handleDelivered={handleDelivered}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}
        </Card>
    )
}

export default RefundActivity
