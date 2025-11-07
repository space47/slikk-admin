import React from 'react'

interface Props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number | string
}

const tabs = [
    { label: 'ALL', key: 'all' },
    { label: 'PICKUP_CREATED', key: 'pickup_created' },
    { label: 'PICKUP_RESCHEDULED', key: 'pickup_rescheduled' },
    { label: 'RIDER_ASSIGNED', key: 'rider_assigned' },
    { label: 'OUT_FOR_PICKUP', key: 'out_for_pickup' },
    { label: 'PICKED_UP', key: 'picked_up' },
    { label: 'DELIVERED', key: 'delivered' },
    { label: 'COMPLETED', key: 'completed' },
    { label: 'REFUNDED', key: 'refunded' },
    { label: 'CANCELLED', key: 'cancelled' },
    { label: 'ACCEPTED', key: 'accepted' },
]

const ReturnOrderTabs = ({ tabSelect, handleSelectTab, orderCount }: Props) => {
    return (
        <div className="p-4 rounded-lg xl:shadow-md overflow-x-auto scrollbar-hide">
            <div
                className={`
                    flex flex-wrap xl:flex-nowrap
                    gap-2 xl:gap-4
                    justify-around xl:justify-start
                    w-full
                `}
            >
                {tabs.map((tab) => {
                    const isActive = tabSelect === tab.key
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleSelectTab(tab.key)}
                            className={`
                                flex items-center justify-center
                                px-4 py-2 rounded-lg font-semibold
                                text-sm xl:text-base whitespace-nowrap
                                transition-all duration-300
                                ${
                                    isActive
                                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }
                            `}
                        >
                            {tab.label}
                            {isActive && <span className="ml-1 text-xs xl:text-sm font-medium">({orderCount})</span>}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ReturnOrderTabs
