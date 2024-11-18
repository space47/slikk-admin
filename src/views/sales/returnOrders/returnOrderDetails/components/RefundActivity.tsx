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
import { DeliveredModal, OutForDeliveryModal, OutforDeliveryModal, PickedUpModal } from './RefundModal'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { getButtonAndModalContent } from './returnOrderCommon'
import ReturnActionActivity from './ReturnActionActivity'

const RefundActivity = () => {
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnDetails = returnOrder?.returnOrders
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState('')
    const [triggerPickedUpGenerate, setTriggerPickedUpGenerate] = useState<boolean>(false)
    const [valueInsideModal, setValueInsideModal] = useState({
        refundAmount: '',
        refundId: '',
    })
    const [triggerAction, setTriggerAction] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const navigate = useNavigate()
    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }
    const { buttonText, modalContent: content } = getButtonAndModalContent(returnDetails?.log?.[returnDetails.log.length - 1]?.status || '')
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValueInsideModal((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handlePICKUPGenerate = () => {
        setAction('create_reverse_pickup')
        setTriggerPickedUpGenerate(true)
    }
    useEffect(() => {
        if (triggerPickedUpGenerate) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                        re_create: 'no',
                    }

                    const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

                    if (response.status === 400) {
                        body.re_create = 'yes'
                        await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
                    }
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
    const handleAction = (value: string) => {
        setAction(value)
        setTriggerAction(true)
    }
    const triggerApiCall = async () => {
        try {
            const body =
                action === 'return_completed'
                    ? {
                          action,
                          reference_id: valueInsideModal.refundId,
                          return_amount: valueInsideModal.refundAmount,
                      }
                    : { action }

            const response = await axiosInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Rider status updated successfully.',
            })
            navigate(0)
        } catch (error: any) {
            console.error(error)
            const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'
            notification.error({ message: 'Error', description: errorMessage })
            navigate(0)
        }
    }

    useEffect(() => {
        if (triggerAction) {
            triggerApiCall()
        }
    }, [triggerAction])

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
                    handleClose={() => setIsModalOpen(false)}
                    modalContent={modalContent}
                    status={returnDetails?.status || ''}
                />
            )}

            <ReturnActionActivity
                returnDetails={returnDetails}
                isModalOpen={isModalOpen}
                handleAction={handleAction}
                setIsModalOpen={setIsModalOpen}
                modalContent={modalContent}
            />

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'DELIVERED' && (
                <Modal open={isModalOpen} onOk={() => handleAction('return_completed')} onCancel={() => setIsModalOpen(false)}>
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
