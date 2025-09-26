import { Button, Dialog } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'

interface Props {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    couponCode: string
    mobileNumber?: string
}

const CouponReleaseModal = ({ couponCode, isOpen, setIsOpen, mobileNumber }: Props) => {
    const [mobile, setMobile] = useState('')

    useEffect(() => {
        if (mobileNumber) setMobile(mobileNumber)
    }, [mobileNumber])

    const handleConfirm = async () => {
        try {
            const res = await axioisInstance.post('/user/coupon/release', {
                mobile: mobile,
                codes: couponCode,
            })
            notification.success({ message: res?.data?.message || 'Coupon released successfully' })
        } catch (error) {
            console.error('Error releasing coupon:', error)
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Failed to release coupon' })
            }
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl  w-[400px]">
                <h2 className="text-lg font-semibold text-gray-800">🎟️ Coupon Release</h2>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                    <input
                        type="text"
                        value={mobile}
                        placeholder="Enter mobile number"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        onChange={(e) => setMobile(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-500">
                    <span>
                        Coupon Code: <span className="font-medium text-indigo-600">{couponCode}</span>
                    </span>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="reject" onClick={() => setIsOpen(false)} className="rounded-lg">
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleConfirm} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                        Confirm
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CouponReleaseModal
