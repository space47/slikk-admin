import { IconText } from '@/components/shared'
import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import React from 'react'
import { HiExternalLink, HiPhone } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const CartShipping = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)
    const cartItems = customerData?.cart

    return (
        <Card>
            <h5 className="mb-4">Address</h5>
            {/* <Link
        className="group flex items-center justify-between"
        to={`/app/customerAnalytics/${user.mobile}`}
    >
        <div className="flex items-center">
            <div className="ltr:ml-2 rtl:mr-2">
                <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                    {data?.name}
                </div>
                <span className="text-xl font-bold">{user.name}</span>
            </div>
        </div>
        <HiExternalLink className="text-xl hidden group-hover:block" />
    </Link> */}

            {/* <IconText icon={<HiPhone className="text-xl opacity-70" />}>
        <span className="font-semibold">{user.mobile}</span>
    </IconText> */}
            <hr className="my-5" />
            <h6 className="mb-4">Shipping Address</h6>
            <address className="not-italic">
                <div className="flex gap-2">
                    <span className="font-bold">Address:</span>
                    {cartItems?.address_name}
                </div>
                <div className="flex gap-2">
                    <span className="font-bold">Directions:</span>
                    {cartItems?.directions}
                </div>
                <div className="flex gap-2">
                    <span className="font-bold">Area:</span>
                    {cartItems?.area}
                </div>
            </address>
            <hr className="my-5" />
            <address className="not-italic">
                <div className="mb-1 flex gap-2">
                    <span className="font-bold">Billing Address:</span>
                    {cartItems?.billing_address}
                </div>
            </address>
        </Card>
    )
}

export default CartShipping
