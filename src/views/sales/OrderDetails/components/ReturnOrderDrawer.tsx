/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import Drawer from '@/components/ui/Drawer'
import { Select, notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import { OrderReturnReasons } from '@/constants/commonArray.constant'

const { Option } = Select

export type Product = {
    image?: string
    quantity?: string
    fulfilled_quantity?: string
    final_price?: number
    sku?: string
    name?: string
    id?: number
    returnable_quantity?: number
    delivery_Type?: string
}

type ReturnOrderProps = {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    product: Product[]
    invoice_id: string | undefined
    delivery_type: string
}

const ReturnOrderDrawer = ({ isOpen, setIsOpen, product, invoice_id, delivery_type }: ReturnOrderProps) => {
    const [returnQuantities, setReturnQuantities] = useState<{
        [key: string]: number
    }>({})
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, { value: string; label: string }>>({})
    const [loaderSpin, setLoaderSpin] = useState(false)
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

    const handleSelect = useCallback((productId: number, reasonValue: string) => {
        setCurrentSelectedPage((prev) => ({
            ...prev,
            [productId]: {
                value: reasonValue,
                label: OrderReturnReasons.find((p) => p.value === reasonValue)?.label || '',
            },
        }))
    }, [])

    // const handleReturnType = (selectedValue: string) => {
    //     setCurrentReturnType(selectedValue)
    // }

    console.log('RETURNTYPE', delivery_type)

    const handleReturnClick = async () => {
        const returnReasonMap = Object.fromEntries(Object.entries(currentSelectedPage).map(([id, { value }]) => [id, value]))
        const returnQtyMap = Object.fromEntries(Object.entries(returnQuantities).map(([id, quantity]) => [id, quantity]))
        setLoaderSpin(true)

        const body = {
            return_reason: returnReasonMap,
            items: returnQtyMap,
            return_type: delivery_type === 'TRY_AND_BUY' ? 'TRY_AND_BUY' : 'DASHBOARD_INITIATIVE',
        }

        try {
            const response = await axioisInstance.post(`merchant/returnorder/create/${invoice_id}`, body)

            notification.success({
                message: 'SUCCESS',
                description: response.data.message || 'Order successfully Returned',
            })
            setLoaderSpin(false)
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
            width="100%"
            className=" sm:w-3/4 md:w-2/3  xl:w-full mx-auto p-4 sm:p-6 md:p-8"
        >
            {loaderSpin ? (
                <>
                    <div className="flex items-center justify-center h-screen">
                        <Spinner className="mr-4" size={50} />
                    </div>
                </>
            ) : (
                <div className="p-4 bg-gray-50 min-h-screen">
                    <div className="mb-10">
                        <div className="font-semibold text-gray-600 text-center sm:text-left sm:col-span-1 items-center flex gap-2">
                            <span className="fonnt-bold text-xl">
                                RETURN TYPE:{' '}
                                <span className="text-red-600">
                                    {delivery_type === 'TRY_AND_BUY' ? 'TRY_AND_BUY' : 'DASHBOARD_INITIATIVE'}
                                </span>
                            </span>
                        </div>
                    </div>
                    {product && product.length > 0 && (
                        <div>
                            {product.map((pdts: any) => (
                                <div key={pdts.id} className="mb-8">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        {/* Grid layout for product details */}
                                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 items-center">
                                            <div className="flex justify-center sm:justify-start sm:col-span-1">
                                                <img
                                                    src={pdts.image.split(',')[0]}
                                                    alt={pdts.name}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                                                />
                                            </div>
                                            {/* SKU */}
                                            <div className="font-semibold text-gray-600 sm:col-span-1 text-center sm:text-left">
                                                SKU:
                                                <div className="sm:col-span-1 text-center sm:text-left font-normal">{pdts.sku}</div>
                                            </div>
                                            <div className="font-semibold text-gray-600 sm:col-span-1 text-center sm:text-left">
                                                PRODUCT NAME
                                                <div className="sm:col-span-2 text-center sm:text-left font-normal">{pdts.name}</div>
                                            </div>
                                            <div className="font-semibold text-gray-600 text-center sm:text-left sm:col-span-1">
                                                ORDERED QTY
                                                <div className="text-center sm:text-left sm:col-span-1  font-normal">{pdts.quantity}</div>
                                            </div>
                                            <div className="font-semibold text-gray-600 text-center sm:text-left sm:col-span-1">
                                                FULFILLED QTY
                                                <div className="text-center sm:text-left sm:col-span-1  font-normal">
                                                    {pdts.fulfilled_quantity}
                                                </div>
                                            </div>
                                            <div className="font-semibold text-gray-600 text-center sm:text-left sm:col-span-1">
                                                RETURN QTY
                                                <div className="sm:col-span-1 text-center sm:text-left">
                                                    {pdts?.returnable_quantity > 0 ? (
                                                        <Select
                                                            value={returnQuantities[pdts?.id] || 0}
                                                            className="w-1/4 border border-gray-300 rounded-lg"
                                                            onChange={(value) => handleSelectChange(pdts?.id, value)}
                                                        >
                                                            {Array.from(
                                                                { length: parseInt(pdts?.returnable_quantity.toString(), 10) + 1 },
                                                                (_, i) => (
                                                                    <Option key={i} value={i}>
                                                                        {i}
                                                                    </Option>
                                                                ),
                                                            )}
                                                        </Select>
                                                    ) : (
                                                        <span className="text-sm text-red-500">NOT RETURNABLE</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spacer */}
                                        <hr className="my-4 border-gray-300" />

                                        {/* Grid layout for order, fulfilled, return, and reason */}
                                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 items-center">
                                            <div className="font-semibold text-gray-600 text-center sm:text-left sm:col-span-1">
                                                RETURN REASON
                                                <div className="sm:col-span-1">
                                                    <Dropdown
                                                        className="text-black xl:w-full w-1/2 border border-gray-300 rounded-lg"
                                                        title={currentSelectedPage[pdts.id]?.value || 'RETURN REASONS'}
                                                        onSelect={(value) => handleSelect(pdts.id, value)}
                                                    >
                                                        {OrderReturnReasons?.map((item, key) => (
                                                            <DropdownItem key={key} eventKey={item.value}>
                                                                <span>{item.name}</span>
                                                            </DropdownItem>
                                                        ))}
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Return Reason Display */}
                                        {currentSelectedPage[pdts?.id]?.label && (
                                            <div className="mt-4">
                                                <p className="text-gray-800 text-lg">
                                                    <span className="font-semibold">Return Reason:</span>{' '}
                                                    {currentSelectedPage[pdts.id].label}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Return Button */}
                    <div className="flex justify-end mt-6 gap-10">
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                            onClick={handleReturnClick}
                        >
                            Return
                        </button>
                    </div>
                </div>
            )}
        </Drawer>
    )
}

export default ReturnOrderDrawer
