interface Props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number
}

const tabs = [
    { label: 'ALL', key: 'all' },
    { label: 'PENDING', key: 'pending' },
    { label: 'ACCEPTED', key: 'accepted' },
    { label: 'PACKED', key: 'packed' },
    { label: 'DEL. CREATED', key: 'delivery_created' },
    { label: 'OUT FOR DELIVERY', key: 'out_for_delivery' },
    { label: 'DELIVERED', key: 'delivered' },
    { label: 'EXCHANGE', key: 'exchange' },
    { label: 'CANCELLED', key: 'cancelled' },
]

const TabSelectOrder = ({ tabSelect, handleSelectTab, orderCount }: Props) => {
    const renderTabs = (isMobile: boolean) => (
        <div
            className={
                isMobile
                    ? 'grid grid-cols-2 gap-2 xl:hidden'
                    : 'xl:flex xl:gap-6 gap-2 xl:justify-start justify-around xl:flex-row flex-col w-full hidden'
            }
        >
            {tabs.map((tab) => (
                <div
                    key={tab.key}
                    className={`flex items-center justify-center cursor-pointer px-2 rounded-lg transition-all duration-300 ${
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
    )

    return (
        <div className="p-4 rounded-lg xl:shadow-md overflow-x-scroll scrollbar-hide">
            {renderTabs(false)}
            {renderTabs(true)}
        </div>
    )
}

export default TabSelectOrder
