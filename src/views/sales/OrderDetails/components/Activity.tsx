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
        setAction('PICK_AND_PACK')
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

                    const response = await axiosInstance.patch(`merchant/order/${invoice_id}`, body)
                    console.log(response)
                    setIsModalOpen(false)
                    setTriggerApiCall(false)
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
    }

    const handleAccept = () => {
        setAction('ACCEPTED')
        setTriggerAcceptedCall(true)
    }

    const handleShip = () => {
        setAction('SHIPPED')
        setTriggerShipCall(true)
    }

    const handleDelivery = () => {
        setAction('DELIVERED')
        setTriggerDeliveryCall(true)
    }

    const handlePartnerSelect = (selectedValue: any) => {
        const selectedLabel = LOGISTIC_PARTNER.find((item) => item.value === selectedValue)?.label || ''
        setPartner({ value: selectedValue, label: selectedLabel })
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    const getButtonAndModalContent = (status: string) => {
        switch (status) {
            case 'PENDING':
                return { buttonText: 'ACCEPT/REJECT' }
            case 'ACCEPTED':
                return { buttonText: 'CREATE DELIVERY' }
            case 'DELIVERY_CREATED':
                return { buttonText: 'PICK AND PACK' }
            case 'PACKED':
                return { buttonText: 'MARK AS SHIPPED' }
            case 'OUT_FOR_DELIVERY':
            case 'SHIPPED':
                return { buttonText: 'MARK AS DELIVERED' }
            case 'CANCELLED':
                return { buttonText: '' }
            default:
                return { buttonText: '', modalContent: '' }
        }
    }

    const { buttonText, modalContent: content } = getButtonAndModalContent(status)

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

            {buttonText && (
                <Button variant="solid" onClick={() => showModal(content)}>
                    {buttonText}
                </Button>
            )}

            {status === 'PENDING' && (
                <CustomModal5
                    isModalOpen={isModalOpen}
                    handlePack={handleAccept}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                />
            )}

            {/* {status === ''} */}

            {status === 'ACCEPTED' && (
                <CustomModal2
                    isModalOpen={isModalOpen}
                    handlePack={handlePack}
                    handleClose={handleClose}
                    modalContent={modalContent}
                    status={status}
                    logistic={logistic}
                    handlePartnerSelect={handlePartnerSelect}
                    partner={partner?.label}
                />
            )}
            {status === 'DELIVERY_CREATED' && (
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

            {status === 'OUT_FOR_DELIVERY' && (
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
