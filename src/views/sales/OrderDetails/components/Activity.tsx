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
import { CustomModal, CustomModal2, CustomModal3, CustomModal4 } from './Modal'

type Event = {
    timestamp: string
    status: string
}

type Payment = {
    amount: number
    mode: string
    transaction_time: string
}

export type Product = {
    image: string
    quantity: string
    fulfilled_quantity: string
    final_price: number
    sku: string
    name: string
    id: number
}

type ActivityProps = {
    data?: Event[]
    status: string
    product?: Product[]
    payment?: Payment
    invoice_id?: string
}

const Activity = ({
    data = [],
    status,
    product = [],
    payment,
    invoice_id,
}: ActivityProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<{
        [key: number]: number
    }>({})
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [action, setAction] = useState('')
    const [triggerApiCall, setTriggerApiCall] = useState<boolean>(false)
    const [triggerpackCall, setTriggerpackCall] = useState<boolean>(false)
    const [triggerShipCall, setTriggerShipCall] = useState<boolean>(false)
    const [triggerDeliveryCall, setTriggerDeliveryCall] =
        useState<boolean>(false)
    const [cancelCall, setCancelCall] = useState<boolean>(false)
    const navigate = useNavigate()

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
        setAction('ACCEPTED')
        setTriggerApiCall(true)
    }

    useEffect(() => {
        if (triggerApiCall) {
            const sendApiRequest = async () => {
                try {
                    const data = Object.entries(fulfilledQuantities).reduce(
                        (acc, [id, quantity]) => {
                            if (quantity > 0) {
                                acc[id] = quantity
                            }
                            return acc
                        },
                        {} as { [key: number]: number },
                    )

                    const body = {
                        action,
                        data,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/order/${invoice_id}`,
                        body,
                    )

                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerApiCall(false)
                    navigate(0)
                } catch (error) {
                    console.error(error)
                    setTriggerApiCall(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerApiCall, navigate])

    // CANCEL.........................................................................................................

    const handleCancel = () => {
        const hasFullfilledQty = Object.values(fulfilledQuantities).some(
            (item) => item > 0,
        )

        if (hasFullfilledQty) {
            setErrorMessage('QUANTITY OF ITEMS SHOULD BE 0')
        } else {
            setAction('ACCEPTED')
            setCancelCall(true)
        }
    }

    useEffect(() => {
        if (cancelCall) {
            const sendApiRequest = async () => {
                try {
                    const data = Object.entries(fulfilledQuantities).reduce(
                        (acc) => acc,
                        {} as { [key: number]: number },
                    )

                    const body = {
                        action,
                        data,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/order/${invoice_id}`,
                        body,
                    )

                    console.log(response.data)
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

    // PACKED..............................................................................................................

    const handlePack = () => {
        setAction('PACKED')
        setTriggerpackCall(true)
    }

    useEffect(() => {
        if (triggerpackCall) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/order/${invoice_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerpackCall(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Order status updated successfully.',
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
                    setTriggerpackCall(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerpackCall, navigate])

    // SHIPPED...........................................................................................................

    const handleShip = () => {
        setAction('SHIPPED')
        setTriggerShipCall(true)
    }

    useEffect(() => {
        if (triggerShipCall) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/order/${invoice_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerShipCall(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Order status updated successfully.',
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
                    setTriggerShipCall(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerShipCall, navigate])

    //............................................................................................................................

    // DELIVERY.............................................................................................................

    const handleDelivery = () => {
        setAction('DELIVERED')
        setTriggerDeliveryCall(true)
    }

    useEffect(() => {
        if (triggerDeliveryCall) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/order/${invoice_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerDeliveryCall(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Order status updated successfully.',
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
                    setTriggerDeliveryCall(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerDeliveryCall, navigate])

    // CLOSE...........................................................................

    const handleClose = () => {
        setIsModalOpen(false)
    }

    const getButtonAndModalContent = (status: string) => {
        switch (status) {
            case 'PENDING':
                return {
                    buttonText: 'ACCEPT/REJECT',
                }
            case 'ACCEPTED':
                return {
                    buttonText: 'PICK AND PACK',
                }
            case 'PACKED':
                return {
                    buttonText: 'MARK AS SHIPPED',
                }
            case 'OUT FOR DELIVERY':
                return {
                    buttonText: 'MARK AS DELIVERED',
                }
            case 'SHIPPED':
                return {
                    buttonText: 'MARK AS DELIVERED',
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

    const { buttonText, modalContent: content } =
        getButtonAndModalContent(status)

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
                                    <Badge
                                        innerClass={classNames(
                                            activity.timestamp
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
                                {moment(activity.timestamp).format(
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

            {status === 'PENDING' && (
                <CustomModal
                    isModalOpen={isModalOpen}
                    handleOk={handleOk}
                    handleCancel={handleCancel}
                    modalContent={modalContent}
                    status={status}
                    invoice_id={invoice_id}
                    payment={payment}
                    product={product}
                    fulfilledQuantities={fulfilledQuantities}
                    handleSelectChange={handleSelectChange}
                    errorMessage={errorMessage || undefined}
                />
            )}
            {status === 'ACCEPTED' && (
                <CustomModal2
                    isModalOpen={isModalOpen}
                    handlePack={handlePack}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )}
            {status === 'PACKED' && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={handleShip}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )}
            {status === 'OUT FOR DELIVERY' && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )}
            {status === 'SHIPPED' && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )}
        </Card>
    )
}

export default Activity
