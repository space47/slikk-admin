import React, { useState } from 'react'
import CartOrder from './CartOrders'
import CartReturnOrders from './CartReturnOrders'

const CartTabs = () => {
    const [tabSelect, setTabSelect] = useState('order')

    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-10 justify-start">
                <div
                    className={`flex  cursor-pointer ${tabSelect === 'order' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => handleSelectTab('order')}
                >
                    <span className="text-xl font-bold">Order</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'return' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => handleSelectTab('return')}
                >
                    <span className="text-xl font-bold">Return Order</span>
                </div>
            </div>
            <div>
                {tabSelect === 'order' && <CartOrder />}
                {tabSelect === 'return' && <CartReturnOrders />}
            </div>
        </div>
    )
}

export default CartTabs
