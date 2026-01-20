import React from 'react'

interface Props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number | string
}

const tabs = [
    { label: 'ALL', key: 'all' },
    { label: 'PICKUP_CREATED', key: 'pickup_created' },
    { label: 'RIDER_ASSIGNED', key: 'rider_assigned' },
    { label: 'OUT_FOR_PICKUP', key: 'out_for_pickup' },
    { label: 'REACHED_AT_LOCATION', key: 'reached_at_location' },
    { label: 'PICKED_UP', key: 'picked_up' },
    { label: 'QC_FAILED', key: 'qc_failed' },
    { label: 'RETURN_REJECTED', key: 'return_rejected' },
    { label: 'DELIVERED', key: 'delivered' },
    { label: 'COMPLETED', key: 'completed' },
    { label: 'REFUNDED', key: 'refunded' },
    { label: 'CANCELLED', key: 'cancelled' },
    { label: 'ACCEPTED', key: 'accepted' },
]

const ReturnOrderTabs = ({ tabSelect, handleSelectTab, orderCount }: Props) => {
    return (
        <div className="w-full">
            <div
                className="
                    flex overflow-x-auto scrollbar-hide 
                    gap-2 md:gap-3 lg:gap-4
                    p-2 md:p-3
                    rounded-xl bg-white
                    border border-gray-200
                    md:shadow-sm
                "
            >
                {tabs.map((tab) => {
                    const isActive = tabSelect === tab.key

                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleSelectTab(tab.key)}
                            className={`
                                whitespace-nowrap 
                                px-3 py-1.5 
                                md:px-4 md:py-2 
                                rounded-full font-medium md:font-semibold
                                transition-all duration-300 
                                text-xs sm:text-sm md:text-base
                                ${
                                    isActive
                                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }
                            `}
                        >
                            {tab.label}
                            {isActive && <span className="ml-1 text-[10px] sm:text-xs md:text-sm font-medium">({orderCount})</span>}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ReturnOrderTabs
