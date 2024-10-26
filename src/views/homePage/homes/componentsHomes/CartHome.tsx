import React from 'react'
import CartItems from './CartItems'
import CartPaymentSummary from './CartPaymentSummary'
import CartShipping from './CartShipping'
import CartTabs from './CartTabs'

const CartHome = () => {
    return (
        <div className="p-4 md:p-8 lg:p-12">
            <CartItems />
            <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mt-8">
                <div className="w-full lg:w-1/2">
                    <CartPaymentSummary />
                </div>
                <div className="w-full lg:w-1/2">
                    <CartShipping />
                </div>
            </div>
            <div className="mt-10">
                <div className="flex flex-col gap-4">
                    <h2 className="font-bold text-2xl">Transaction History</h2>
                    <CartTabs />
                </div>
            </div>
        </div>
    )
}

export default CartHome
