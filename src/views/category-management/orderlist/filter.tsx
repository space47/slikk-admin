import React from 'react'
interface props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number
}

const TabSelectOrder = ({ tabSelect, handleSelectTab, orderCount }: props) => {
    return (
        <div>
            <div className="flex gap-10 justify-start">
                <div
                    className={`flex  cursor-pointer ${tabSelect === 'all' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('all')}
                >
                    <span className="text-xl font-bold">ALL</span>
                </div>
                <div
                    className={`flex  cursor-pointer ${tabSelect === 'pending' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('pending')}
                >
                    <span className="text-xl font-bold">PENDING</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'packed' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('packed')}
                >
                    <span className="text-xl font-bold">PACKED</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'out_for_delivery' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('out_for_delivery')}
                >
                    <span className="text-xl font-bold">OUT FOR DELIVERY</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'delivered' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('delivered')}
                >
                    <span className="text-xl font-bold">DELIVERED</span>
                </div>
            </div>
        </div>
    )
}

export default TabSelectOrder
