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
import { ActivityProps, LOGISTIC_PARTNER } from './activityCommon'
import { getButtonAndModalContent, particularApiCall } from './activityFunctions'
import { AxiosError } from 'axios'

const Activity = ({ data = [], status, product = [], payment, invoice_id, mainData, delivery_type }: ActivityProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<{ [key: number]: number }>({})
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
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
    const [bagsCount, setBagsCount] = useState('')
    const [binNumber, setBinNumber] = useState('')

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

    console.log('Action is', status)

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
                    const data = Object.entries(fulfilledQuantities).reduce(
                        (acc, [id, quantity]: any) => {
                            if (quantity > 0) {
                                acc[id] = quantity
                            }
                            return acc
                        },
                        {} as { [key: number]: number },
                    )
                    if (Object.keys(data).length === 0) {
                        setButtonAfterClick(false)
                        notification.warning({
                            message: 'No Quantities Selected',
                            description: 'Please select at least one item with a valid quantity to proceed.',
                        })
                        setTriggerApiCall(false)
                        return
                    }
                    const hasZeroQuantity = Object.values(fulfilledQuantities).some((q) => q === 0)
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

                    const hasLessQuantity =
                        product.reduce((sum, item) => sum + Number(item?.quantity || 0), 0) >
                        Object.values(fulfilledQuantities).reduce((sum, q) => sum + (q || 0), 0)
                    if (hasLessQuantity && !hasZeroQuantity) {
                        setButtonAfterClick(false)
                        Modal.confirm({
                            title: 'Confirm Quantity for Packing',
                            content: 'The number of fulfilled quantity is less then actual quantity !',
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
                    await makeApiCall(data)
                } catch (error) {
                    console.error(error)
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
                setErrorMessage('QUANTITY OF ITEMS SHOULD BE 0')
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

    const handleCancelOnRTO = async () => {
        const body = {
            return_reason: 'RTO Cancel',
        }
        try {
            const response = await axiosInstance.post(`merchant/cancelorder/${invoice_id}`, body)

            notification.success({
                message: 'SUCCESS',
                description: response.data.message || 'Order successfully Cancelled',
            })
            navigate(0)
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error:', error)
            notification.error({
                message: 'Failure',
                description: 'Order failed to cancel',
            })
        }
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
                        <div>
                            {data[data.length - 1]?.status === 'RTO_DELIVERED' && (
                                <Button onClick={() => setRtoCancel(true)} className="ml-2" variant="reject">
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                )
            )}

            {rejectModal && (
                <div className="flex justify-center items-center h-screen">
                    <Modal
                        title=""
                        open={rejectModal}
                        okText="REJECT"
                        cancelText="CANCEL"
                        okButtonProps={{
                            style: {
                                backgroundColor: '#D32F2F',
                                color: '#FFFFFF',
                                borderRadius: '8px',
                            },
                        }}
                        onOk={() => {
                            setAction('PACKED')
                            setCancelCall(true)
                        }}
                        onCancel={() => setRejectModal(false)}
                    >
                        <h1 className="text-center text-lg font-bold text-red-600">REJECT ORDER</h1>
                        <p className="text-center text-xl font-semibold mb-10">Are you sure you want to reject this order</p>
                    </Modal>
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
                    errorMessage={errorMessage || undefined}
                    isButtonClick={buttonAfterClick}
                    bagsCount={bagsCount}
                    setBagsCount={setBagsCount}
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

            {rtoCancel && (
                <Modal
                    title=""
                    open={rtoCancel}
                    okText="CANCEL"
                    cancelText="CANCEL"
                    okButtonProps={{
                        style: {
                            backgroundColor: '#D32F2F',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                        },
                    }}
                    onOk={handleCancelOnRTO}
                    onCancel={() => setRtoCancel(false)}
                >
                    <h1 className="text-center text-lg font-bold text-red-600">CANCEL ORDER</h1>
                    <p className="text-center text-xl font-semibold mb-10">Are you sure you want to Cancel this order</p>
                </Modal>
            )}
        </Card>
    )
}

export default Activity
