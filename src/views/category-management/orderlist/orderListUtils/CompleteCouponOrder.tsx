/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, Input } from '@/components/ui'
import store from '@/store'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { FiCheckCircle, FiTag, FiAlertTriangle } from 'react-icons/fi'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    refetch: any
}

const CompleteCouponOrder = ({ isOpen: isReAssign, setIsOpen: setIsReAssign, refetch }: props) => {
    const [loadingAction, setLoadingAction] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const storeCodes = store.getState().storeSelect.store_ids

    const handleReassignPickerOrder = async () => {
        if (!couponCode.trim()) {
            notification.error({ message: 'Coupon code is required' })
            return
        }

        const body = { action: 'mark_orders_completed', coupon_code: couponCode, store_id: storeCodes.join(',') }

        try {
            setLoadingAction(true)
            const res = await axioisInstance.post(`/merchant/orders`, body)
            notification.success({
                message: res?.data?.message || 'Orders marked as completed successfully',
            })
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.message || 'Failed to complete orders',
                })
            }
        } finally {
            setLoadingAction(false)
            setIsReAssign(false)
        }
    }

    return (
        <Dialog isOpen={isReAssign} width={800} onClose={() => setIsReAssign(false)}>
            <div className=" max-w-full px-6 py-6 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
                        <FiCheckCircle size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Complete Orders via Coupon</h2>
                        <p className="text-sm text-gray-500">Mark all orders associated with a coupon as completed.</p>
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-xl flex gap-2 text-sm">
                    <FiAlertTriangle className="mt-1 shrink-0" />
                    <span>
                        This action will mark <b>all orders</b> linked to the entered coupon code as completed. Please verify the coupon
                        code before proceeding.
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Coupon Code</label>
                    <div className="relative">
                        <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            className="pl-10"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <Button variant="blue" size="sm" disabled={loadingAction} loading={loadingAction} onClick={handleReassignPickerOrder}>
                        Mark Orders as Completed
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CompleteCouponOrder
