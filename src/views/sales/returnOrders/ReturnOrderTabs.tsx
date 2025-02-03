import React from 'react'

interface props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number
}

const ReturnOrderTabs = ({ tabSelect, handleSelectTab, orderCount }: props) => {
    return (
        <div className=" p-4 rounded-lg xl:shadow-md">
            <div className="xl:flex xl:gap-6 gap-2 xl:justify-start justify-around xl:flex-row flex-col w-full hidden">
                {[
                    { label: 'ALL', key: 'all' },
                    { label: 'PICKUP_CREATED', key: 'pickup_created' },
                    { label: 'PENDING', key: 'pending' },
                    { label: 'ACCEPTED', key: 'accepted' },
                    { label: 'APPROVED', key: 'approved' },
                    { label: 'OUT FOR DELIVERY', key: 'out_for_delivery' },
                    { label: 'REFUNDED', key: 'refunded' },
                    { label: 'COMPLETED', key: 'completed' },
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

export default ReturnOrderTabs
