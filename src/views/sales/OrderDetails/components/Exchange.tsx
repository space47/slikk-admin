/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button, Dropdown, FormItem, Spinner } from '@/components/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { productService } from '@/store/services/productService'
import { ProductTypes } from '@/store/types/products.types'
import { Form, Formik } from 'formik'
import EasyTable from '@/common/EasyTable'
import FormButton from '@/components/ui/Button/FormButton'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { CommonOrderProduct } from '../orderList.common'
import { notification } from 'antd'
import { OrderReturnReasons } from '@/constants/commonArray.constant'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Order } from '@/store/types/newOrderTypes'

interface ExchangeItem {
    order_item_id: string | number
    quantity: number
    replacement_barcode: string
    product_name?: string
}

interface props {
    row: Order['order_items']
    invoice_id: string | undefined
    setIsOpen: (x: boolean) => void
}

const Exchange = ({ row, invoice_id, setIsOpen }: props) => {
    const [productDetails, setProductDetails] = useState<ProductTypes[]>([])
    const [exchangeItems, setExchangeItems] = useState<ExchangeItem[]>([])
    const [currentBarcode, setCurrentBarcode] = useState('')
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0)
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
    const [returnReason, setReturnReason] = useState<Record<string, { value: string; label: string }>>({})
    const currentRow = row?.[selectedRowIndex]
    const number = parseInt(currentRow?.quantity as string) || 0
    const numberArray = Array.from({ length: number + 1 }, (_, i) => i)
    const SelectQuantity = numberArray?.map((item) => ({ label: item, value: item }))

    const { data: productData, isLoading } = productService.useProductDataQuery(
        {
            page: 1,
            pageSize: 100,
            globalFilter: currentRow?.name,
            currentSelectedPage: { label: 'Name', value: 'name' },
        },
        { refetchOnMountOrArgChange: true, skip: !currentRow?.name },
    )

    useEffect(() => {
        setProductDetails(productData?.data?.results || [])
    }, [productData])

    useEffect(() => {
        setCurrentBarcode('')
    }, [selectedRowIndex])

    useEffect(() => {
        const initialQuantities: { [key: string]: number } = {}
        row.forEach((item, index) => {
            if (item.id) {
                initialQuantities[item.id] = 1
            }
        })
        setQuantities(initialQuantities)
    }, [row])

    const handleAddToExchange = () => {
        if (!currentRow || !currentBarcode) {
            notification.error({ message: 'Please select a product and replacement barcode' })
            return
        }

        const existingItemIndex = exchangeItems.findIndex((item) => item.order_item_id === currentRow.id)

        const newExchangeItem: ExchangeItem = {
            order_item_id: currentRow.id as number,
            quantity: quantities[currentRow.id as number] || 1,
            replacement_barcode: currentBarcode,
            product_name: currentRow.name,
        }

        if (existingItemIndex >= 0) {
            const updatedItems = [...exchangeItems]
            updatedItems[existingItemIndex] = newExchangeItem
            setExchangeItems(updatedItems)
            notification.success({ message: 'Exchange item updated' })
        } else {
            setExchangeItems((prev) => [...prev, newExchangeItem])
            notification.success({ message: 'Product added to exchange list' })
        }
        if (selectedRowIndex < row.length - 1) {
            setSelectedRowIndex(selectedRowIndex + 1)
        }
    }

    const handleRemoveFromExchange = (orderItemId: string | number) => {
        setExchangeItems((prev) => prev.filter((item) => item.order_item_id !== orderItemId))
    }

    const handleQuantityChange = (orderItemId: string | number, quantity: number) => {
        setQuantities((prev) => ({
            ...prev,
            [orderItemId]: quantity,
        }))
        setExchangeItems((prev) => prev.map((item) => (item.order_item_id === orderItemId ? { ...item, quantity } : item)))
    }

    const columns = useMemo(
        () => [
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ row }: any) => {
                    const imageUrl = row?.original?.image?.split(',')[0]
                    return (
                        <>
                            <img src={imageUrl} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                        </>
                    )
                },
            },
            { header: 'Name', accessorKey: 'name' },
            { header: 'Sku', accessorKey: 'sku' },
            { header: 'Size', accessorKey: 'size' },
            { header: 'Barcode', accessorKey: 'barcode' },
            {
                header: 'Select',
                accessorKey: 'barcode',
                cell: ({ row }: any) => {
                    const isSelected = currentBarcode === row?.original?.barcode
                    return (
                        <Button
                            type="button"
                            variant={isSelected ? 'solid' : 'blue'}
                            onClick={() => setCurrentBarcode(row?.original?.barcode)}
                        >
                            {isSelected ? 'Selected' : 'Add'}
                        </Button>
                    )
                },
            },
        ],
        [currentBarcode],
    )

    const handleSubmit = async () => {
        if (exchangeItems.length === 0) {
            notification.error({ message: 'Please add at least one product to exchange' })
            return
        }
        const returnData = Object.fromEntries(Object.entries(returnReason)?.map(([key, obj]) => [key, obj.value]))
        const body = {
            return_type: 'EXCHANGE',
            return_reason: returnData,
            items: exchangeItems.map(({ product_name, ...item }) => item),
        }
        try {
            const res = await axioisInstance.post(`/merchant/returnorder/create/${invoice_id}`, body)
            successMessage(res)
            setExchangeItems([])
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    const handleSelect = useCallback((productId: number, reasonValue: string) => {
        setReturnReason((prev) => ({
            ...prev,
            [productId]: {
                value: reasonValue,
                label: OrderReturnReasons.find((p) => p.value === reasonValue)?.label || '',
            },
        }))
    }, [])

    const RowSelector = () => {
        return (
            <FormItem label="Select Product to Exchange">
                <div className="flex flex-wrap gap-5">
                    {row?.map((item, index) => {
                        const isInExchange = exchangeItems.some((exchangeItem) => exchangeItem.order_item_id === item.id)
                        const isSelected = selectedRowIndex === index

                        return (
                            <div
                                key={index}
                                onClick={() => setSelectedRowIndex(index)}
                                className={`
                                relative w-full sm:w-[220px] flex flex-col items-center text-center p-4
                                rounded-2xl border transition-all duration-300 cursor-pointer group
                                ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                                        : isInExchange
                                          ? 'border-green-500 bg-green-50'
                                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                                }
                            `}
                            >
                                {/* Image */}
                                <div className="relative w-20 h-20 mb-3">
                                    <img
                                        src={item?.image?.split(',')[0]}
                                        alt={item?.name}
                                        className="w-full h-full object-cover rounded-lg shadow-sm"
                                    />
                                    {isInExchange && (
                                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                                            ✓
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">{item?.name}</span>
                                <span className="text-xs text-gray-500 mt-1">(Qty: {item?.quantity})</span>
                                {isInExchange && <span className="text-xs text-green-600 font-medium mt-2">In Exchange</span>}
                                <div className="w-full mt-4 bg-red-600 text-white rounded-2xl flex items-center flex-col justify-center">
                                    <label className="block text-xs font-semibold  mb-1 mt-2">Exchange Reason</label>
                                    <Dropdown
                                        className="text-gray-800 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                                        title={returnReason[item.id as number]?.value || 'Select a Reason'}
                                        onSelect={(value) => handleSelect(item.id as number, value)}
                                    >
                                        {OrderReturnReasons?.map((reason, key) => (
                                            <DropdownItem key={key} eventKey={reason.value}>
                                                <span>{reason.name}</span>
                                            </DropdownItem>
                                        ))}
                                    </Dropdown>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </FormItem>
        )
    }

    const ExchangeItemsList = () => {
        if (exchangeItems.length === 0) return null

        return (
            <FormItem label="Products to Exchange">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="space-y-3">
                        {exchangeItems.map((item, index) => {
                            const product = row?.find((p) => p.id === item.order_item_id)
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={product?.image?.split(',')[0]}
                                            alt={product?.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <div>
                                            <div className="font-medium text-sm">{product?.name}</div>
                                            <div className="text-xs text-gray-500">
                                                Quantity: {item.quantity} | Replacement: {item.replacement_barcode}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="reject"
                                        color="red"
                                        size="xs"
                                        onClick={() => handleRemoveFromExchange(item.order_item_id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </FormItem>
        )
    }

    return (
        <div className="flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Product Exchange</h2>
                {exchangeItems.length > 0 && (
                    <div className="text-sm font-medium text-blue-600">{exchangeItems.length} product(s) added for exchange</div>
                )}
            </div>

            <Formik
                initialValues={{
                    return_reason: '',
                }}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="flex flex-col gap-5 overflow-y-auto px-2 pr-3 custom-scrollbar">
                        <RowSelector />

                        <FormItem label={`Select Quantity for ${currentRow?.name}`}>
                            <select
                                value={quantities[currentRow?.id as number] || 1}
                                onChange={(e) => handleQuantityChange(currentRow?.id as number, parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                {SelectQuantity.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </FormItem>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner size={35} />
                            </div>
                        ) : (
                            <>
                                <FormItem label="Select Replacement Product">
                                    <div className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium text-gray-800">Current Product:</span> {currentRow?.name}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium text-gray-800">Replacement Selected:</span> {currentBarcode || '—'}
                                    </div>

                                    <div className="flex justify-end mt-2 mb-6">
                                        <Button
                                            type="button"
                                            variant="solid"
                                            color="blue"
                                            onClick={handleAddToExchange}
                                            disabled={!currentBarcode}
                                        >
                                            {exchangeItems.some((item) => item.order_item_id === currentRow?.id)
                                                ? 'Update Exchange Item'
                                                : 'Add to Exchange List'}
                                        </Button>
                                    </div>

                                    <div className="overflow-y-auto max-h-[500px] rounded-md border border-gray-200 shadow-sm custom-scrollbar">
                                        <EasyTable overflow noPage columns={columns} mainData={productDetails} />
                                    </div>
                                </FormItem>
                            </>
                        )}

                        <ExchangeItemsList />

                        <div className="flex justify-end pt-4 border-t border-gray-200 gap-3">
                            <FormButton value={`Exchange ${exchangeItems.length} Product(s)`} />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Exchange
