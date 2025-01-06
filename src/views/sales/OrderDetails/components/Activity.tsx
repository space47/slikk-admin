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
import { CustomModal, CustomModal2, CustomModal3, CustomModal4, CustomModal5 } from './Modal'
import { LOGISTIC, LOGISTIC_PARTNER, Payment, Product } from './activityCommon'

type Event = {
    timestamp: string
    status: string
}

type ActivityProps = {
    mainData: any
    data?: Event[]
    status: string
    product?: Product[]
    payment?: Payment
    invoice_id?: string
    logistic: LOGISTIC
}

const Activity = ({ data = [], status, product = [], payment, invoice_id, logistic, mainData }: ActivityProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<{ [key: number]: number }>({})
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [action, setAction] = useState('')
    const [triggerApiCall, setTriggerApiCall] = useState(false)
    const [triggerAcceptedCall, setTriggerAcceptedCall] = useState(false)
    const [triggerpackCall, setTriggerpackCall] = useState(false)
    const [triggerShipCall, setTriggerShipCall] = useState(false)
    const [triggerDeliveryCall, setTriggerDeliveryCall] = useState(false)
    const [cancelCall, setCancelCall] = useState(false)
    const [buttonAfterClick, setButtonAfterClick] = useState(false)
    const navigate = useNavigate()
    const [partner, setPartner] = useState<{ value: string; label: string } | null>(null)

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

                    const response = await axiosInstance.patch(`merchant/order/${invoice_id}`, body)
                    console.log(response)
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

    const handleReject = () => {
        const hasFulfilledQty = Object.values(fulfilledQuantities).some((item) => item > 0)

        if (hasFulfilledQty) {
            setTimeout(() => {
                setErrorMessage('QUANTITY OF ITEMS SHOULD BE 0')
            }, 2000)
        } else {
            setAction('ACCEPTED')
            // setButtonAfterClick(true)
            setCancelCall(true)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        if (cancelCall) {
            const sendApiRequest = async () => {
                try {
                    const data = Object.entries(fulfilledQuantities).reduce((acc) => acc, {} as { [key: number]: number })

                    const body = {
                        action,
                        data,
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

    const handleApiCall = (trigger, setTrigger, isPacking) => {
        if (trigger) {
            particularApiCall(action, invoice_id, partner?.value, navigate, isPacking)
            setTrigger(false)
        }
    }

    useEffect(() => {
        handleApiCall(triggerAcceptedCall, setTriggerAcceptedCall, true)
        handleApiCall(triggerpackCall, setTriggerpackCall, true)
        handleApiCall(triggerShipCall, setTriggerShipCall, false)
        handleApiCall(triggerDeliveryCall, setTriggerDeliveryCall, false)
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

    const handlePartnerSelect = (selectedValue: any) => {
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''
        setPartner({ value: selectedValue, label: selectedLabel })
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    console.log('Data of the log', data)

    const getButtonAndModalContent = (data: Event[]) => {
        const lastLogStatus = data.length > 0 ? data[data.length - 1].status : null
        const isPacked = data.some((log) => log.status === 'PACKED')
        const isDeliveryCreated = data.some((log) => log.status === 'DELIVERY_CREATED')

        if (data.length === 0) {
            return { buttonText: 'ACCEPT/REJECT' }
        }

        if (isDeliveryCreated && !isPacked) {
            return { buttonText: 'PICK AND PACK', modalContent: 'Pick and Pack' }
        }
        if (status === 'SHIPPED' && isPacked) {
            return { buttonText: 'MARK AS DELIVERED', modalContent: 'Mark as Delivered' }
        }

        switch (lastLogStatus) {
            case 'DELIVERY_CREATED':
                return { buttonText: 'PICK AND PACK', modalContent: 'Pick and Pack' }
            case 'PACKED': {
                const buttonText = mainData?.delivery_type === 'STANDARD' ? 'MARK AS SHIPPED' : 'OUT FOR DELIVERY'
                const modalContent = mainData?.delivery_type === 'STANDARD' ? 'Mark as Shipped' : 'Out for Delivery'
                return { buttonText, modalContent }
            }
            case 'ACCEPTED':
                return { buttonText: 'CREATE DELIVERY' }
            case 'OUT_FOR_PICKUP':
            case 'OUT_FOR_DELIVERY':
            case 'SHIPPED':
                return { buttonText: 'MARK AS DELIVERED' }
            case 'CANCELLED':
                return { buttonText: '' }
            default:
                return { buttonText: '', modalContent: '' }
        }
    }

    const { buttonText, modalContent: content } = getButtonAndModalContent(data)

    const isPacked = data.some((log) => log?.status === 'PACKED')
    const isDeliveryCreated = data.some((log) => log?.status === 'DELIVERY_CREATED')
    const isOutForDelivery = data.some((log) => log?.status === 'OUT_FOR_DELIVERY')

    console.log('Status is', status)

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

            {isDeliveryCreated && !isPacked ? (
                <Button variant="solid" onClick={() => showModal('Pick and Pack')}>
                    PICK AND PACK
                </Button>
            ) : status === 'SHIPPED' ? (
                buttonText ? (
                    <Button variant="solid" onClick={() => showModal('Mark as Delivered')}>
                        MARK AS DELIVERED
                    </Button>
                ) : null
            ) : (
                buttonText && (
                    <Button variant="solid" onClick={() => showModal(content)}>
                        {buttonText}
                    </Button>
                )
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

            {/* {status === ''} */}

            {data[data.length - 1]?.status === 'ACCEPTED' && (
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
            {isDeliveryCreated && !isPacked && (
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

            {data[data.length - 1]?.status === 'PACKED' && (
                <CustomModal3
                    isModalOpen={isModalOpen}
                    handlePack={handleShip}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )}

            {status === 'OUT_FOR_DELIVERY' && isPacked && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={buttonAfterClick}
                />
            )}
            {status === 'SHIPPED' && isPacked && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={buttonAfterClick}
                />
            )}

            {isOutForDelivery && isPacked && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    isButtonClick={buttonAfterClick}
                />
            )}
            {/* {data[data.length - 1]?.status === 'OUT_FOR_DELIVERY' && isPacked && (
                <CustomModal4
                    isModalOpen={isModalOpen}
                    handlePack={handleDelivery}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )} */}
        </Card>
    )
}

export default Activity
