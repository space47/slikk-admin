interface Props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number | string
}

const tabs = [
    { label: 'ALL', key: 'all' },
    { label: 'PENDING', key: 'pending' },
    { label: 'ACCEPTED', key: 'accepted' },
    { label: 'PICKING', key: 'picking' },
    { label: 'PACKED', key: 'packed' },
    { label: 'DEL. CREATED', key: 'delivery_created' },
    { label: 'OUT FOR DELIVERY', key: 'out_for_delivery' },
    { label: 'REACHED_AT_LOCATION', key: 'reached_at_location' },
    { label: 'DELIVERED', key: 'delivered' },
    { label: 'RTO_DELIVERED', key: 'rto_delivered' },
    { label: 'EXCHANGE', key: 'exchange' },
    { label: 'CANCELLED', key: 'cancelled' },
]

const TabSelectOrder = ({ tabSelect, handleSelectTab, orderCount }: Props) => {
    return (
        <div className="w-full">
            <div
                className="
                flex gap-2 md:gap-3 lg:gap-4
                overflow-x-auto scrollbar-hide
                p-2 md:p-3
                rounded-xl 
                bg-white 
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
                            ${isActive ? 'bg-green-600 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                        `}
                        >
                            {tab.label}
                            {isActive && ` (${orderCount})`}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default TabSelectOrder
