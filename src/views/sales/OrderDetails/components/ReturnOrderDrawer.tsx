import { useState, useCallback } from 'react'
import { Dropdown, Button } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import Drawer from '@/components/ui/Drawer'
import { Select, notification } from 'antd'
import type { MouseEvent } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

export type Product = {
    image: string
    quantity: string
    fulfilled_quantity: string
    final_price: number
    sku: string
    name: string
    id: number
    returnable_quantity: number
}

type ReturnOrderProps = {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    product: Product[]
    invoice_id: any
}

const returnReasons = [
    {
        label: "Size and Fit Issues: The clothing doesn't fit as expected.",
        value: 'size_fit_issues',
    },
    {
        label: 'Colour and Appearance: The actual color or appearance of the clothing item differs from how it appeared online.',
        value: 'colour_appearance',
    },
    {
        label: "Quality and Fabric: The quality or feel of the fabric doesn't meet the expectation.",
        value: 'quality_fabric',
    },
    {
        label: 'Change of mind: I no longer want the item.',
        value: 'change_of_mind',
    },
    {
        label: 'Defects and Damage: The clothing arrived damaged or with manufacturing defects, such as holes, loose threads, or stains.',
        value: 'defects_damage',
    },
]

const ReturnOrderDrawer = ({
    isOpen,
    setIsOpen,
    product,
    invoice_id,
}: ReturnOrderProps) => {
    const [returnQuantities, setReturnQuantities] = useState<{
        [key: string]: number
    }>({})
    const [currentSelectedPage, setCurrentSelectedPage] = useState<
        Record<string, { value: string; label: string }>
    >({})
    const navigate = useNavigate()

    const onDrawerClose = useCallback(() => {
        setIsOpen(false)
        navigate(0)
    }, [setIsOpen])

    const handleSelectChange = useCallback((id: number, value: number) => {
        setReturnQuantities((prev) => ({
            ...prev,
            [id]: value,
        }))
    }, [])

    const handleSelect = useCallback(
        (productId: number, reasonValue: string) => {
            setCurrentSelectedPage((prev) => ({
                ...prev,
                [productId]: {
                    value: reasonValue,
                    label:
                        returnReasons.find((p) => p.value === reasonValue)
                            ?.label || '',
                },
            }))
        },
        [],
    )

    const handleReturnClick = async () => {
        const returnReasonMap = Object.fromEntries(
            Object.entries(currentSelectedPage).map(([id, { value }]) => [
                id,
                value,
            ]),
        )
        const returnQtyMap = Object.fromEntries(
            Object.entries(returnQuantities).map(([id, quantity]) => [
                id,
                quantity,
            ]),
        )

        const body = {
            return_reason: returnReasonMap,
            items: returnQtyMap,
        }

        try {
            const response = await axioisInstance.post(
                `merchant/returnorder/create/${invoice_id}`,
                body,
            )

            notification.success({
                message: 'SUCCESS',
                description:
                    response.data.message || 'Order successfully Returned',
            })
            navigate(0)
        } catch (error) {
            console.error('Error:', error)
            notification.error({
                message: 'FAILURE',
                description: 'Failed to return order',
            })
        }
    }

    return (
        <Drawer
            title="Return Order"
            isOpen={isOpen}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
            width={1200}
        >
            <div>
                {product && product.length > 0 && (
                    <div>
                        {product.map((pdts) => (
                            <div key={pdts.id} className="mb-8">
                                <table className="w-full text-left border-t mb-4">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 font-semibold">
                                                SKU
                                            </th>
                                            <th className="px-4 py-2 font-semibold">
                                                PRODUCT IMAGE
                                            </th>
                                            <th className="px-4 py-2 font-semibold">
                                                PRODUCT NAME
                                            </th>
                                            <th className="px-4 py-2 font-semibold">
                                                ORDERED QTY
                                            </th>
                                            <th className="px-4 py-2 font-semibold">
                                                FULFILLED QTY
                                            </th>
                                            <th className="px-4 py-2 font-semibold">
                                                RETURN QTY
                                            </th>
                                            <th className="px-4 py-2 font-semibold">
                                                RETURN REASON
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                {pdts.sku}
                                            </td>
                                            <td className="px-4 py-2">
                                                <img
                                                    src={
                                                        pdts.image.split(',')[0]
                                                    }
                                                    alt={pdts.name}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                {pdts.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {pdts.quantity}
                                            </td>
                                            <td className="px-4 py-2">
                                                {pdts.fulfilled_quantity}
                                            </td>
                                            <td className="px-4 py-2">
                                                <Select
                                                    value={
                                                        returnQuantities[
                                                            pdts.id
                                                        ] || 0
                                                    }
                                                    className="w-full"
                                                    onChange={(value) =>
                                                        handleSelectChange(
                                                            pdts.id,
                                                            value,
                                                        )
                                                    }
                                                >
                                                    {Array.from(
                                                        {
                                                            length:
                                                                parseInt(
                                                                    pdts.quantity.toString(),
                                                                    10,
                                                                ) + 1,
                                                        },
                                                        (_, i) => (
                                                            <Option
                                                                key={i}
                                                                value={i}
                                                            >
                                                                {i}
                                                            </Option>
                                                        ),
                                                    )}
                                                </Select>
                                            </td>

                                            <td className="px-4 py-2">
                                                <Dropdown
                                                    className="text-black w-full"
                                                    title={
                                                        currentSelectedPage[
                                                            pdts.id
                                                        ]?.value ||
                                                        'RETURN REASONS'
                                                    }
                                                    onSelect={(value) =>
                                                        handleSelect(
                                                            pdts.id,
                                                            value,
                                                        )
                                                    }
                                                >
                                                    {returnReasons?.map(
                                                        (item, key) => (
                                                            <DropdownItem
                                                                key={key}
                                                                eventKey={
                                                                    item.value
                                                                }
                                                            >
                                                                <span>
                                                                    {item.value}
                                                                </span>
                                                            </DropdownItem>
                                                        ),
                                                    )}
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {currentSelectedPage[pdts.id]?.label && (
                                    <div className="mb-10">
                                        <p className="text-lg font-medium text-gray-800  mt-4  pl-6 ">
                                            <span className="font-semibold">
                                                Return Reason:
                                            </span>{' '}
                                            {currentSelectedPage[pdts.id].label}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 px-4 py-2 text-white rounded-lg"
                        onClick={handleReturnClick}
                    >
                        Return
                    </button>
                </div>
            </div>
        </Drawer>
    )
}

export default ReturnOrderDrawer
