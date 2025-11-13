/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, Input } from '@/components/ui'
import { rtvService } from '@/store/services/rtvService'
import { Rtv_Products } from '@/store/types/rtv.types'
import { notification } from 'antd'
import React, { useEffect, useState } from 'react'

interface Props {
    rtvData: Rtv_Products
    isOPen: boolean
    setIsOpen: (x: boolean) => void
    refetch: any
}

const RtvEditModal = ({ isOPen, rtvData, setIsOpen, refetch }: Props) => {
    const [quantityAccepted, setQuantityAccepted] = useState<number | ''>('')
    const [updateRtv, updateResponse] = rtvService.useUpdateRtvProductsMutation()

    useEffect(() => {
        if (updateResponse?.isSuccess) {
            notification.success({ message: 'successfully Updated' })
            refetch()
        }
        if (updateResponse?.isError) {
            notification.error({ message: 'Failed to update' })
        }
    }, [updateResponse?.isError, updateResponse?.isSuccess])

    const handleConfirm = () => {
        updateRtv({ action: 'replace', sku: rtvData?.sku, quantityAccepted, rtv_number: rtvData?.rtv?.rtv_number })
    }

    return (
        <Dialog isOpen={isOPen} onClose={() => setIsOpen(false)} width={700}>
            <div className="p-6 space-y-6">
                <div className="border-b pb-3">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Edit Product Details</h2>
                    <p className="text-sm text-gray-500">Update accepted quantity and review product details.</p>
                </div>
                <div className="grid grid-cols-2 gap-5 text-sm">
                    <div>
                        <p className="text-gray-500 font-medium">SKU</p>
                        <p className="text-gray-800 dark:text-gray-100 font-semibold">{rtvData.sku}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Barcode</p>
                        <p className="text-gray-800 dark:text-gray-100 font-semibold">{rtvData.rtv?.rtv_number}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Box Number</p>
                        <p className="text-gray-800 dark:text-gray-100 font-semibold">{rtvData.box_number || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Location</p>
                        <p className="text-gray-800 dark:text-gray-100 font-semibold">{rtvData.inventory_locations || 'N/A'}</p>
                    </div>
                </div>
                <div>
                    <p className="text-gray-500 font-medium mb-2">Quantity Accepted</p>
                    <Input
                        type="number"
                        min={0}
                        value={quantityAccepted}
                        onChange={(e) => setQuantityAccepted(Number(e.target.value))}
                        placeholder="Enter accepted quantity"
                        className="w-1/2 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Required Quantity: {rtvData.quantity_required}</p>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="default"
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="accept"
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default RtvEditModal
