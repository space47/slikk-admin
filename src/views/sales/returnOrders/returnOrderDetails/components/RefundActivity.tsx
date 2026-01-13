/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import Button from '@/components/ui/Button'
import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from 'antd'
import { PickedUpModal } from './RefundModal'
import { getButtonAndModalContent } from './returnOrderCommon'
import ReturnActionActivity from './ReturnActionActivity'
import CompleteReturnModal from './CompleteReturnModal'
import { useReturnOrderFunctions } from '../../returnOrderUtils/useReturnOrderFunctions'
import DialogConfirm from '@/common/DialogConfirm'
import { ReturnOrder } from '@/store/types/returnOrderData.types'
import { EReturnOrderStatus } from '../../returnOrderUtils/ReturnOrderUtils'

interface Props {
    returnOrderItems: ReturnOrder['return_order_items']
    returnDetails: ReturnOrder
    refetch: any
}

const RefundActivity: React.FC<Props> = ({ returnDetails, returnOrderItems, refetch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCompleting, setIsCompleting] = useState(false)
    const [action, setAction] = useState('')
    const [triggerPickedUpGenerate, setTriggerPickedUpGenerate] = useState<boolean>(false)
    const [valueInsideModal, setValueInsideModal] = useState({ refundAmount: '', refundId: '' })
    const [triggerAction, setTriggerAction] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)
    const [forceCOD, setForceCOD] = useState(false)
    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }
    const { buttonText, modalContent: content } = getButtonAndModalContent(
        returnDetails?.log?.[returnDetails.log.length - 1]?.status || '',
        returnDetails?.return_order_delivery?.find((item) => item?.state !== EReturnOrderStatus.cancelled)?.partner as string,
        returnDetails?.log as any[],
    )
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValueInsideModal((prev) => ({ ...prev, [name]: value }))
    }

    const locationWiseArray = useMemo(() => {
        return returnOrderItems?.map((item) => ({ order_id: item.order_item, quantity: item.quantity }))
    }, [returnOrderItems])

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
        refetch,
        setIsLoading,
        setTriggerAction,
    })

    useEffect(() => {
        if (triggerPickedUpGenerate) {
            sendApiRequest()
        }
    }, [triggerPickedUpGenerate])

    const handleAction = (value: string) => {
        setAction(value)
        setTriggerAction(true)
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
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.partially_accepted ? (
                    ''
                ) : returnDetails?.log.length === 0 && returnDetails?.status === EReturnOrderStatus.cancelled ? (
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
            {buttonText &&
                returnDetails?.status &&
                returnDetails.status !== EReturnOrderStatus.cancelled &&
                returnDetails.status !== EReturnOrderStatus.accepted && (
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
                    currentButton={isLoading}
                />
            )}

            <ReturnActionActivity
                returnDetails={returnDetails}
                isModalOpen={isModalOpen}
                handleAction={handleAction}
                setIsModalOpen={setIsModalOpen}
                modalContent={modalContent}
                currentButton={isLoading}
                buttonText={buttonText}
            />

            {returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.delivered &&
                !returnDetails?.log?.some((item) => item?.status === EReturnOrderStatus.delivered) && (
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
            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.delivered ||
                returnDetails?.log?.some((item) => item?.status?.includes(EReturnOrderStatus.delivered))) &&
                !returnDetails?.log?.some((item) => item?.status?.includes(EReturnOrderStatus.completed)) && (
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

            {(returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.qc_failed ||
                returnDetails?.log?.[returnDetails.log.length - 1]?.status === EReturnOrderStatus.pickup_attempt_failed) && (
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
