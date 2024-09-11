import React, { useCallback, useState } from 'react'
import { Modal, Select, notification } from 'antd'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Button } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { IoIosWarning } from 'react-icons/io'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const { Option } = Select

type Props5 = {
    isModalOpen: boolean
    handleClose: () => void
    invoice_id: any
    setIsModalOpen: (open: boolean) => void
}

const CancelReasons = [
    {
        label: 'Found a Better Price: I found the same item at a lower price elsewhere.',
        value: 'better_price',
    },
    {
        label: 'Ordered by Mistake: I accidentally ordered the wrong item or quantity.',
        value: 'ordered_by_mistake',
    },
    {
        label: 'Shipping Delay: The estimated delivery date is too late.',
        value: 'shipping_delay',
    },
    {
        label: 'Payment Issues: There was a problem with my payment method.',
        value: 'payment_issues',
    },
    {
        label: 'No Longer Needed: I no longer need the item.',
        value: 'no_longer_needed',
    },
    {
        label: 'Changed Mind: I changed my mind about the purchase.',
        value: 'changed_mind',
    },
    {
        label: 'Other: I have another reason for canceling my order.',
        value: 'other',
    },
]

const CancelModal: React.FC<Props5> = ({
    isModalOpen,
    handleClose,
    invoice_id,
    setIsModalOpen,
}) => {
    const [cancelReason, setCancelReason] = useState<string | undefined>(
        undefined,
    )

    const handleSelect = useCallback((value: string) => {
        setCancelReason(value)
    }, [])

    const handlePack = async () => {
        if (!cancelReason) {
            notification.error({
                message: 'Selection Required',
                description: 'Please select a cancel reason before proceeding.',
            })
            return
        }

        const body = {
            return_reason: cancelReason,
        }

        try {
            const response = await axioisInstance.post(
                `merchant/cancelorder/${invoice_id}`,
                body,
            )

            notification.success({
                message: 'SUCCESS',
                description:
                    response.data.message || 'Order successfully Cancelled',
            })
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error:', error)
            notification.error({
                message: 'Failure',
                description: 'Order failed to cancel',
            })
        }
    }

    return (
        <Dialog
            width="100%"
            className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto p-4 sm:p-6 md:p-8  "
            isOpen={isModalOpen}
            onClose={handleClose}
        >
            <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg overflow-y-scroll h-[600px] xl:h-[500px] overflow-scroll scrollbar-hide">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-1">
                    Cancel Order{' '}
                    <IoIosWarning className="text-yellow-600 text-2xl sm:text-3xl" />{' '}
                </h2>
                <div className="w-full sm:w-1/3 flex flex-col justify-center items-start">
                    <div className="text-base font-medium mb-1 text-red-500">
                        Reason For Cancelling
                    </div>
                    <Dropdown
                        className="bg-gray-300 w-full sm:w-auto"
                        title={
                            cancelReason
                                ? CancelReasons.find(
                                      (reason) => reason.value === cancelReason,
                                  )?.label || 'SELECT RETURN REASON'
                                : 'SELECT RETURN REASON'
                        }
                        onSelect={handleSelect}
                    >
                        {CancelReasons.map((reason) => (
                            <DropdownItem
                                key={reason.value}
                                eventKey={reason.value}
                            >
                                <span>{reason.label}</span>
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div className="flex justify-end mt-6 gap-3">
                    <button
                        onClick={handleClose}
                        className="bg-green-600 text-white hover:bg-green-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                    >
                        Changed your mind
                    </button>
                    <button
                        onClick={handlePack}
                        className="bg-red-600 text-white hover:bg-red-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                    >
                        Cancel Order
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default CancelModal
