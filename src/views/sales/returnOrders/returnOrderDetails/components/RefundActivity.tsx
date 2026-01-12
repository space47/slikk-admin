/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import Button from '@/components/ui/Button'
import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PickedUpModal } from './RefundModal'
import { getButtonAndModalContent } from './returnOrderCommon'
import ReturnActionActivity from './ReturnActionActivity'
import CompleteReturnModal from './CompleteReturnModal'
import { useReturnOrderFunctions } from '../../returnOrderUtils/useReturnOrderFunctions'
import DialogConfirm from '@/common/DialogConfirm'
import { ReturnOrder } from '@/store/types/returnOrderData.types'

interface Props {
    returnOrderItems: ReturnOrder['return_order_items']
    returnDetails: ReturnOrder
}

const RefundActivity = ({ returnDetails, returnOrderItems }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCompleting, setIsCompleting] = useState(false)
    const [action, setAction] = useState('')
    const [triggerPickedUpGenerate, setTriggerPickedUpGenerate] = useState<boolean>(false)
    const [valueInsideModal, setValueInsideModal] = useState({ refundAmount: '', refundId: '' })
    const [triggerAction, setTriggerAction] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const navigate = useNavigate()
    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }
    const { buttonText, modalContent: content } = getButtonAndModalContent(
        returnDetails?.log?.[returnDetails.log.length - 1]?.status || '',
        returnDetails?.return_order_delivery?.find((item) => item?.state !== 'CANCELLED')?.partner as string,
        returnDetails?.log as any[],
    )
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValueInsideModal((prev) => ({ ...prev, [name]: value }))
    }

    const locationWiseArray = useMemo(() => {
        return returnOrderItems?.map((item) => ({ order_id: item.order_item, quantity: item.quantity }))
    }, [returnOrderItems])

    const [currentButton, setCurrentButton] = useState(false)
    const [forceCOD, setForceCOD] = useState(false)

    const handlePICKUPGenerate = () => {
        setAction('create_reverse_pickup')
        setTriggerPickedUpGenerate(true)
    }

    const { sendApiRequest, triggerApiCall, handleForceCod, handleCompleteReturn, handleReturnReject } = useReturnOrderFunctions({
        action,
        returnDetails,
        setForceCOD,
        setIsModalOpen,
        valueInsideModal,
        setTriggerPickedUpGenerate,
        locationWiseArray,
        setIsCompleting,
    })

    useEffect(() => {
        if (triggerPickedUpGenerate) {
            sendApiRequest()
        }
    }, [triggerPickedUpGenerate, navigate])

    const handleAction = (value: string) => {
        setAction(value)
        setTriggerAction(true)
        setCurrentButton(true)
    }

    useEffect(() => {
        if (triggerAction) {
            triggerApiCall()
        }
    }, [triggerAction])

    return (
        <Card className="mb-10 flex flex-col">
            <h5 className="mb-4">Activity</h5>
            {returnDetails?.status === 'ACCEPTED' && (
                <div>
                    The Status is <span className="text-red-500 font-bold">{returnDetails?.status}</span> and cannot be processed further
                </div>
            )}
            <Timeline className="mb-5">
                {returnDetails?.log?.[returnDetails.log.length - 1]?.status === '' &&
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PARTIALLY_ACCEPTED' ? (
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
            {buttonText && returnDetails?.status && returnDetails.status !== 'CANCELLED' && returnDetails.status !== 'ACCEPTED' && (
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
                    currentButton={currentButton}
                />
            )}

            <ReturnActionActivity
                returnDetails={returnDetails}
                isModalOpen={isModalOpen}
                handleAction={handleAction}
                setIsModalOpen={setIsModalOpen}
                modalContent={modalContent}
                currentButton={currentButton}
                buttonText={buttonText}
            />

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'DELIVERED' &&
                !returnDetails?.log?.some((item) => item?.status === 'REFUNDED') && (
                    <CompleteReturnModal
                        isCompleting={isCompleting}
                        handleAction={handleCompleteReturn}
                        returnOrderItems={returnOrderItems as any}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        valueInsideModal={valueInsideModal}
                        handleInputChange={handleInputChange}
                    />
                )}
            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'REFUNDED' ||
                returnDetails?.log?.some((item) => item?.status?.includes('REFUNDED'))) &&
                !returnDetails?.log?.some((item) => item?.status?.includes('COMPLETED')) && (
                    <CompleteReturnModal
                        isCompleting={isCompleting}
                        handleAction={handleCompleteReturn}
                        returnOrderItems={returnOrderItems as any}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        valueInsideModal={valueInsideModal}
                        handleInputChange={handleInputChange}
                    />
                )}

            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'QC_FAILED' ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKUP_ATTEMPT_FAILED') && (
                <DialogConfirm
                    isProceed
                    IsOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    headingName="Return Reject"
                    label="Are you sure you want to reject this return order"
                    closeDialog={() => setIsModalOpen(false)}
                    onDialogOk={handleReturnReject}
                />
            )}

            {forceCOD && (
                <Modal open={forceCOD} okText={'Proceed'} onOk={handleForceCod} onCancel={() => setForceCOD(false)}>
                    <p className="text-xl">Do You Want To Proceed With Manual Refund</p>
                </Modal>
            )}
        </Card>
    )
}

export default RefundActivity
