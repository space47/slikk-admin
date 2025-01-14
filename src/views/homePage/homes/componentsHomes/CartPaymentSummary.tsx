import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { PaymentInfo, PaymentType } from '@/views/sales/OrderDetails/components/PaymentSummary'
import moment from 'moment'
import React from 'react'

const CartPaymentSummary = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)
    const cartItems = customerData?.cart

    return (
        <div>
            {cartItems ? (
                <Card className="mb-4">
                    <div className="flex justify-between items-center xl:items-baseline">
                        <h5 className="mb-4">Payment Summary</h5>
                    </div>
                    <ul className="mt-5">
                        <div className="flex justify-between mb-2">
                            Delivery Charge <span className="font-semibold ">Rs.{cartItems?.delivery}</span>
                        </div>
                        {cartItems?.coupon_discount !== 0 && (
                            <div className="flex justify-between mb-2">
                                Coupon Discount <span className="font-semibold">Rs.{cartItems?.coupon_discount}</span>
                            </div>
                        )}
                        {cartItems?.loyalty_tier_discount !== 0 && (
                            <div className="flex justify-between mb-2">
                                Loyalty Discount <span className="font-semibold">Rs.{cartItems?.loyalty_tier_discount}</span>
                            </div>
                        )}
                        {cartItems?.points_discount !== '0.00' && (
                            <div className="flex justify-between mb-2">
                                Points Discount <span className="font-semibold">Rs.{cartItems?.points_discount}</span>
                            </div>
                        )}
                        <PaymentType label="Time" value={moment(cartItems?.create_date).format('MM/DD/YYYY hh:mm:ss a')} />
                        <PaymentInfo label="Tax" value={cartItems?.tax} />
                        <hr className="mb-3" />
                        <PaymentInfo isLast label="Total" value={cartItems?.amount} />
                    </ul>
                </Card>
            ) : (
                <div className="flex justify-center">
                    <h3></h3>
                </div>
            )}
        </div>
    )
}

export default CartPaymentSummary
