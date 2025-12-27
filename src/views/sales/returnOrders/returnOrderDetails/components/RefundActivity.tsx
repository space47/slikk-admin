/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import Button from '@/components/ui/Button'
import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PickedUpModal } from './RefundModal'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { getButtonAndModalContent } from './returnOrderCommon'
import ReturnActionActivity from './ReturnActionActivity'
import CompleteReturnModal from './CompleteReturnModal'
import { useReturnOrderFunctions } from '../../returnOrderUtils/useReturnOrderFunctions'
import DialogConfirm from '@/common/DialogConfirm'

const RefundActivity = () => {
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnDetails = returnOrder?.returnOrders
    const returnOrderItems = returnOrder?.returnOrders?.return_order_items || []
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
        returnDetails?.return_order_delivery.find((item) => item?.state !== 'CANCELLED')?.partner,
        returnDetails?.log as any[],
    )
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValueInsideModal((prev) => ({ ...prev, [name]: value }))
    }

    const locationWiseArray = returnOrderItems.map((item) => ({
        order_id: item.order_item,
        quantity: item.quantity,
    }))

    const [currentButton, setCurrentButton] = useState(false)
    const [forceCOD, setForceCOD] = useState(false)
    // const [packetsValue, setPacketsValue] = useState('')
    // const [packetsContainer, setPacketsContainer] = useState<string[]>([])
    // const packetIdArray = returnOrder?.returnOrders?.packet_ids || ['r1456', 'r1234', 'r4444']
    // const packetIdArray = ['1', '2', '3', '4', '5']

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

    // const handlePacketsCount = (e: any) => {
    //     if (e.key === 'Enter') {
    //         if (packetsContainer.includes(e.target.value)) {
    //             notification.warning({ message: 'Packet Already scanned' })
    //         } else if (packetIdArray.includes(e.target.value)) {
    //             setPacketsContainer((prev) => [...prev, e.target.value])
    //             setPacketsValue('')
    //         } else {
    //             notification.error({ message: 'No packet Id' })
    //         }
    //     }
    // }

    // const isPickedUp = returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKED_UP'
    // const equalNumber = packetsContainer?.length === packetIdArray.length

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
            {/* buttons........................................................................................................ */}

            {/* <div className="mt-5 mb-5">
                {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'PICKED_UP' && (
                    <>
                        <div className="grid grid-cols-3 mb-3 gap-3">
                            {
                                <div>
                                    Packed: ({packetsContainer?.length} / {packetIdArray?.length})
                                </div>
                            }
                        </div>
                        <div>
                            <Input
                                placeholder="Scan Packet Ids"
                                value={packetsValue}
                                onChange={(e) => setPacketsValue(e.target.value)}
                                onKeyDown={handlePacketsCount}
                            />
                        </div>
                    </>
                )}
            </div> */}

            {buttonText && returnDetails?.status && returnDetails.status !== 'CANCELLED' && returnDetails.status !== 'ACCEPTED' && (
                <Button
                    variant="solid"
                    onClick={() => showModal(content)}
                    //  disabled={isPickedUp && !equalNumber}
                >
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

            {/* {returnDetails?.log?.[returnDetails.log.length - 1]?.status === 'DELIVERED' &&
                !returnDetails?.log?.some((item) => item?.status?.includes('COMPLETED')) &&
                !returnDetails?.log?.some((item) => item?.status?.includes('REFUNDED')) && (
                    <Modal
                        open={isModalOpen}
                        okText={currentButton ? 'Returning' : 'Return Orders'}
                        onOk={() => handleAction('return_completed')}
                        onCancel={() => setIsModalOpen(false)}
                    >
                        <p className="text-xl">Complete Return Order</p>
                    </Modal>
                )} */}
            {forceCOD && (
                <Modal open={forceCOD} okText={'Proceed'} onOk={handleForceCod} onCancel={() => setForceCOD(false)}>
                    <p className="text-xl">Do You Want To Proceed With Manual Refund</p>
                </Modal>
            )}
        </Card>
    )
}

export default RefundActivity
