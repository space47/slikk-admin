import React, { useEffect } from 'react'
import CartItems from './CartItems'
import CartPaymentSummary from './CartPaymentSummary'
import CartShipping from './CartShipping'
import CartOrder from './CartOrders'
import CartTabs from './CartTabs'

const CartHome = () => {
    return (
        <div>
            <CartItems />
            <div className="flex gap-2 xl:justify-around xl:flex-row flex-col ">
                <div className="w-[500px]">
                    {' '}
                    <CartPaymentSummary />
                </div>
                <div className="w-[500px]">
                    <CartShipping />
                </div>
            </div>
            <br />
            <div>
                <div className="flex flex-col gap-7">
                    <div className="font-bold text-xl">Transaction History</div>
                    <CartTabs />
                </div>
            </div>
        </div>
    )
}

export default CartHome
