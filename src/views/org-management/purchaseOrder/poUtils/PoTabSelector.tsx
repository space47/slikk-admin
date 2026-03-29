import { PoStatusArray } from './poCommon'

interface Props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number | string
}

const PoTabSelectOrder = ({ tabSelect, handleSelectTab, orderCount }: Props) => {
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
                {PoStatusArray.map((tab) => {
                    const isActive = tabSelect === tab.value

                    return (
                        <button
                            key={tab.value}
                            onClick={() => handleSelectTab(tab.value)}
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

export default PoTabSelectOrder
