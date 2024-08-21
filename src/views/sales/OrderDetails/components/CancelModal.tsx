import React, { useCallback, useState } from 'react'
import { Modal, Select, notification } from 'antd'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Button } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { IoIosWarning } from 'react-icons/io'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const { Option } = Select

type Product = {
    image: string
    quantity: string
    fulfilled_quantity: string
    final_price: number
    sku: string
    name: string
    id: number
    returnable_quantity: number
}

type Props5 = {
    isModalOpen: boolean
    handlePack: () => void
    handleClose: () => void
    modalContent?: string
    status: string
    product: Product[]
    invoice_id: any
}

const CancelReasons = [
    {
        label: 'Found a Better Price: I found the same item at a lower price elsewhere.',
        value: 'better_price'
    },
    {
        label: 'Ordered by Mistake: I accidentally ordered the wrong item or quantity.',
        value: 'ordered_by_mistake'
    },
    {
        label: 'Shipping Delay: The estimated delivery date is too late.',
        value: 'shipping_delay'
    },
    {
        label: 'Payment Issues: There was a problem with my payment method.',
        value: 'payment_issues'
    },
    {
        label: 'No Longer Needed: I no longer need the item.',
        value: 'no_longer_needed'
    },
    {
        label: 'Changed Mind: I changed my mind about the purchase.',
        value: 'changed_mind'
    },
    {
        label: 'Other: I have another reason for canceling my order.',
        value: 'other'
    }
]

const CancelModal: React.FC<Props5> = ({
    isModalOpen,
    handleClose,
    product,
    invoice_id
}) => {
    const [returnQuantities, setReturnQuantities] = useState<{
        [key: string]: number
    }>({})
    const [currentSelectedPage, setCurrentSelectedPage] = useState<
        Record<string, { value: string; label: string }>
    >({})

    const handleSelectChange = useCallback((id: number, value: number) => {
        setReturnQuantities((prev) => ({
            ...prev,
            [id]: value
        }))
    }, [])

    const handleSelect = useCallback(
        (productId: number, reasonValue: string) => {
            setCurrentSelectedPage((prev) => ({
                ...prev,
                [productId]: {
                    value: reasonValue,
                    label:
                        CancelReasons.find((p) => p.value === reasonValue)
                            ?.label || ''
                }
            }))
        },
        []
    )

    const handlePack = async () => {
        const returnReasonMap = Object.fromEntries(
            Object.entries(currentSelectedPage).map(([id, { value }]) => [
                id,
                value
            ])
        )
        const returnQtyMap = Object.fromEntries(
            Object.entries(returnQuantities).map(([id, quantity]) => [
                id,
                quantity
            ])
        )

        const body = {
            return_reason: returnReasonMap,
            items: returnQtyMap
        }

        try {
            const response = await axioisInstance.post(
                `merchant/returnorder/create/${invoice_id}`,
                body
            )

            notification.success({
                message: 'SUCCESS',
                description:
                    response.data.message || 'Order successfully Cancelled'
            })
        } catch (error) {
            console.error('Error:', error)
            notification.error({
                message: 'Failure',
                description: 'Order failed to cancel'
            })
        }
    }

    return (
        <Dialog
            width={1200}
            // height={350}
            className="custom-modal"
            isOpen={isModalOpen}
            onClose={handleClose}
        >
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-1">
                    Cancel Order{' '}
                    <IoIosWarning className="text-yellow-600 text-3xl" />{' '}
                </h2>
                {product.map((item) => (
                    <div
                        key={item.id}
                        className="border-b border-gray-200 py-4 flex items-center justify-around bg-gray-50 rounded-lg p-4"
                    >
                        <div className="w-1/3">
                            <p className="font-medium text-lg ">{item.name}</p>
                            <p className=" mt-1">
                                ARE YOU SURE YOU WANT TO CANCEL THIS ORDER?
                            </p>
                        </div>
                        <div className="flex flex-col mr-4 w-1/4">
                            <div className="text-base font-medium  mb-1">
                                Quantity to Cancel
                            </div>
                            <Select
                                value={returnQuantities[item.id] || 0}
                                className="w-1/2"
                                onChange={(value) =>
                                    handleSelectChange(item.id, value)
                                }
                            >
                                {Array.from(
                                    {
                                        length:
                                            parseInt(
                                                item.quantity.toString(),
                                                10
                                            ) + 1
                                    },
                                    (_, i) => (
                                        <Option key={i} value={i}>
                                            {i}
                                        </Option>
                                    )
                                )}
                            </Select>
                        </div>
                        <div className="ml-4 w-1/3 flex flex-col justify-center">
                            <div className="text-base font-medium  mb-1">
                                Reason For Cancelling
                            </div>
                            <Dropdown
                                className="bg-gray-300"
                                title={
                                    currentSelectedPage[item.id]?.label ||
                                    'SELECT RETURN REASON'
                                }
                                onSelect={(value) =>
                                    handleSelect(item.id, value)
                                }
                            >
                                {CancelReasons.map((reason) => (
                                    <DropdownItem
                                        key={reason.value}
                                        eventKey={reason.value}
                                    >
                                        <span>{reason.value}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>
                ))}

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
