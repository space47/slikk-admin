import React, { useState } from 'react'
import { FaHamburger } from 'react-icons/fa'
interface props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number
}

const TabSelectOrder = ({ tabSelect, handleSelectTab, orderCount }: props) => {
    const [showMobileViewDetails, setShowMobileViewDetails] = useState(false)

    const handleHamburger = () => {
        setShowMobileViewDetails(!showMobileViewDetails)
    }

    return (
        <div className=" p-4 rounded-lg xl:shadow-md">
            <div className="xl:flex xl:gap-6 gap-2 xl:justify-start justify-around xl:flex-row flex-col w-full hidden">
                {[
                    { label: 'ALL', key: 'all' },
                    { label: 'PENDING', key: 'pending' },
                    { label: 'ACCEPTED', key: 'accepted' },
                    { label: 'PACKED', key: 'packed' },
                    { label: 'DELIVERY CREATED', key: 'delivery_created' },
                    { label: 'DELIVERY_CANCELLED', key: 'delivery_cancelled' },
                    { label: 'OUT FOR DELIVERY', key: 'out_for_delivery' },
                    { label: 'DELIVERED', key: 'delivered' },
                    { label: 'EXCHANGE', key: 'exchange' },
                    { label: 'CANCELLED', key: 'cancelled' },
                ].map((tab) => (
                    <div
                        key={tab.key}
                        className={`flex items-center justify-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                            tabSelect === tab.key
                                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => handleSelectTab(tab.key)}
                    >
                        <span className="xl:text-lg text-sm font-semibold">
                            {tab.label} {tabSelect === tab.key && <>({orderCount})</>}
                        </span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2 xl:hidden ">
                {[
                    { label: 'ALL', key: 'all' },
                    { label: 'PENDING', key: 'pending' },
                    { label: 'ACCEPTED', key: 'accepted' },
                    { label: 'PACKED', key: 'packed' },
                    { label: 'DELIVERY CTD', key: 'delivery_created' },
                    { label: 'DEL. CANCELLED', key: 'delivery_cancelled' },
                    { label: 'OUT DELIVERY', key: 'out_for_delivery' },
                    { label: 'DELIVERED', key: 'delivered' },
                    { label: 'EXCHANGE', key: 'exchange' },
                    { label: 'CANCELLED', key: 'cancelled' },
                ].map((tab) => (
                    <div
                        key={tab.key}
                        className={`flex items-center justify-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                            tabSelect === tab.key
                                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => handleSelectTab(tab.key)}
                    >
                        <span className="xl:text-lg text-sm font-semibold">
                            {tab.label} {tabSelect === tab.key && <>({orderCount})</>}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TabSelectOrder
