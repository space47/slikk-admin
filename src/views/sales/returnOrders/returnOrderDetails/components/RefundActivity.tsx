/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import Button from '@/components/ui/Button'
import React, { useState, useEffect } from 'react'
import { notification } from 'antd'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import {
    CustomModal1,
    CustomModal2,
    CustomModal3,
    CustomModal4,
} from './RefundModal'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'

type LOGS = {
    data: any
}

// type Event = {
//     timestamp: string
//     status: string
// }
type RIDERACTIVITYPROPS = {
    data: LOGS[]
    status: string
    task_id: any
    latitude: any
    longitude: any
}

const RefundActivity = ({
    data = [],
    status,
    task_id,
    latitude,
    longitude,
}: RIDERACTIVITYPROPS) => {
    const returnOrder = useAppSelector<ReturnOrderState>(
        (state) => state.returnOrders,
    )
    const returnDetails = returnOrder?.returnOrders
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState('')
    const [triggerAccept, settriggerAccept] = useState<boolean>(false)
    const [triggerpickupCall, setTriggerpickupCall] = useState<boolean>(false)
    const [triggerOutDelivery, setTriggerOutDelivery] = useState<boolean>(false)

    const [triggerDelivery, setTriggerDelivery] = useState<boolean>(false)

    const [modalContent, setModalContent] = useState<string>()
    const navigate = useNavigate()

    const handleASSIGN = () => {
        setAction('accept')
        settriggerAccept(true)
    }

    useEffect(() => {
        if (triggerAccept) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(
                        `logistic/rider/task/${task_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    settriggerAccept(false)
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
                    settriggerAccept(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerAccept, navigate])

    // For Accept..........................................

    const handleACCEPT = () => {
        setAction('pickup')
        setTriggerpickupCall(true)
    }
    const handleClose = () => {
        setIsModalOpen(false)
    }

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    useEffect(() => {
        if (triggerpickupCall) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                        latitude: latitude,
                        longitude: longitude,
                    }

                    const response = await axiosInstance.patch(
                        `logistic/rider/task/${task_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerpickupCall(false)
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
                    setTriggerpickupCall(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerpickupCall, navigate])

    // PICKUP MODAL CASE -3.......................................
    const handlePICKUP = () => {
        setAction('out_for_delivery')
        setTriggerOutDelivery(true)
    }
    useEffect(() => {
        if (triggerOutDelivery) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                        latitude: latitude,
                        longitude: longitude,
                    }

                    const response = await axiosInstance.patch(
                        `logistic/rider/task/${task_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerOutDelivery(false)
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
                    setTriggerOutDelivery(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerOutDelivery, navigate])

    // OUT FOR DELIVERY.............................

    const handleOUTDELIVERY = () => {
        setAction('delivered')
        setTriggerDelivery(true)
    }

    useEffect(() => {
        if (triggerDelivery) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                        latitude: latitude,
                        longitude: longitude,
                    }

                    const response = await axiosInstance.patch(
                        `logistic/rider/task/${task_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerDelivery(false)
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
                    setTriggerDelivery(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerDelivery, navigate])

    const getButtonAndModalContent = (status: string) => {
        switch (status) {
            case 'ASSIGNED':
                return {
                    buttonText: 'ACCEPT',
                }
            case 'ACCEPTED':
                return {
                    buttonText: 'PICK UP',
                }
            case 'PICKED_UP':
                return {
                    buttonText: 'Out For Delivery',
                }
            case 'OUT_FOR_DELIVERY':
                return {
                    buttonText: 'Delivery',
                }

            case 'delivered':
                return {
                    buttonText: '',
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
        returnDetails?.status,
    )
    return (
        <Card className="mb-10 flex flex-col">
            <h5 className="mb-4">Activity</h5>
            <Timeline className="mb-5">
                {returnDetails?.log?.length === 0 ? (
                    <p>No activity data available.</p>
                ) : (
                    returnDetails?.log?.map((activity, i) => (
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
                    ))
                )}
            </Timeline>
            {/* buttons........................................................................................................ */}
            {buttonText && (
                <Button variant="solid" onClick={() => showModal(content)}>
                    {buttonText}
                </Button>
            )}
            {returnDetails?.status === 'ASSIGNED' && (
                <CustomModal1
                    isModalOpen={isModalOpen}
                    handlePack={handleASSIGN}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails?.status}
                />
            )}
            {returnDetails?.status === 'ACCEPTED' && (
                <CustomModal2
                    isModalOpen={isModalOpen}
                    handlePack={handleACCEPT}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails?.status}
                />
            )}{' '}
            {returnDetails?.status === 'PICKED_UP' && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={handlePICKUP}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails?.status}
                />
            )}
            {returnDetails?.status === 'OUT_FOR_DELIVERY' && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleOUTDELIVERY}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={returnDetails?.status}
                />
            )}
        </Card>
    )
}

export default RefundActivity
