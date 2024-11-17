/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Modal, notification } from 'antd'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useAppSelector } from '@/store'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { DeliveredModal, OutForDeliveryModal, OutforDeliveryModal, PickedUpModal } from './RefundModal'
import { ReturnOrderState } from '@/store/types/returnDetails.types'

const RefundActivity = () => {
    const navigate = useNavigate()
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnDetails = returnOrder?.returnOrders
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState('')
    const [valueInsideModal, setValueInsideModal] = useState({ refundAmount: '', refundId: '' })
    const [triggerAction, setTriggerAction] = useState(false)
    const [modalContent, setModalContent] = useState<string>()

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValueInsideModal((prev) => ({ ...prev, [name]: value }))
    }

    const getButtonAndModalContent = (status: string) => {
        switch (status) {
            case '':
                return { buttonText: 'CREATE REVERSE PICKUP' }
            case 'PICKUP_CREATED':
            case 'REVERSE_PICKUP_CREATED':
                return { buttonText: 'OUT FOR PICKUP' }
            case 'OUT_FOR_PICKUP':
                return { buttonText: 'PICKED UP' }
            case 'PICKED_UP':
                return { buttonText: 'IN TRANSIT' }
            case 'SHIPPED':
            case 'IN_TRANSIT':
                return { buttonText: 'OUT FOR DELIVERY' }
            case 'OUT_FOR_DELIVERY':
                return { buttonText: 'DELIVERED' }
            case 'DELIVERED':
                return { buttonText: 'COMPLETE RETURN' }
            default:
                return { buttonText: '', modalContent: '' }
        }
    }

    const { buttonText, modalContent: content } = getButtonAndModalContent(returnDetails?.log?.[returnDetails.log.length - 1]?.status || '')

    const triggerApiCall = async () => {
        try {
            const body: Record<string, any> = { action }
            if (action === 'return_completed') {
                body.reference_id = valueInsideModal.refundId
                body.return_amount = valueInsideModal.refundAmount
            }

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
        } finally {
            setTriggerAction(false)
            closeModal()
        }
    }

    useEffect(() => {
        if (triggerAction) {
            triggerApiCall()
        }
    }, [triggerAction])

    const handleAction = (actionType: string) => {
        setAction(actionType)
        setTriggerAction(true)
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

            {buttonText && (
                <Button variant="solid" onClick={() => showModal(content)}>
                    {buttonText}
                </Button>
            )}

            {returnDetails?.log.length === 0 && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={() => handleAction('create_reverse_pickup')}
                    handleClose={closeModal}
                    modalContent={modalContent}
                    status={returnDetails?.status || ''}
                />
            )}

            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'REVERSE_PICKUP_CREATED' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKUP_CREATED') && (
                <OutforDeliveryModal
                    isModalOpen={isModalOpen}
                    handleoutForDelivery={() => handleAction('out_for_pickup')}
                    handleClose={closeModal}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'OUT_FOR_PICKUP' && (
                <PickedUpModal
                    isModalOpen={isModalOpen}
                    handlePickup={() => handleAction('picked_up')}
                    handleClose={closeModal}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'IN_TRANSIT' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'SHIPPED') && (
                <OutForDeliveryModal
                    isModalOpen={isModalOpen}
                    handleOutForDelivery={() => handleAction('out_for_delivery')}
                    handleClose={closeModal}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'OUT_FOR_DELIVERY' && (
                <DeliveredModal
                    isModalOpen={isModalOpen}
                    handleDelivered={() => handleAction('delivered')}
                    handleClose={closeModal}
                    modalContent={modalContent}
                    status={returnDetails.status}
                />
            )}

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'DELIVERED' && (
                <Modal open={isModalOpen} onOk={() => handleAction('return_completed')} onCancel={closeModal}>
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
