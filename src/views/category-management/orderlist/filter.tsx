import React from 'react'
interface props {
    tabSelect: string
    handleSelectTab: (tab: string) => void
    orderCount: number
}

const TabSelectOrder = ({ tabSelect, handleSelectTab, orderCount }: props) => {
    return (
        <div>
            <div className="flex xl:gap-10 xl:justify-start xl:flex-row flex-col w-1/2 xl:w-full ">
                <div
                    className={`flex   cursor-pointer ${tabSelect === 'all' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('all')}
                >
                    <span className="xl:text-xl text-sm font-bold">ALL {tabSelect === 'all' && <>({orderCount})</>}</span>
                </div>
                <div
                    className={`flex  cursor-pointer ${tabSelect === 'pending' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('pending')}
                >
                    <span className="xl:text-xl text-sm font-bold">PENDING {tabSelect === 'pending' && <>({orderCount})</>}</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'accepted' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('accepted')}
                >
                    <span className="xl:text-xl text-sm font-bold">ACCEPTED{tabSelect === 'accepted' && <>({orderCount})</>}</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'packed' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('packed')}
                >
                    <span className="xl:text-xl text-sm font-bold">PACKED{tabSelect === 'packed' && <>({orderCount})</>}</span>
                </div>

                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'out_for_delivery' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('out_for_delivery')}
                >
                    <span className="xl:text-xl text-sm font-bold">
                        OUT FOR DELIVERY {tabSelect === 'out_for_delivery' && <>({orderCount})</>}
                    </span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'delivered' ? ' border-b-4 border-black text-green-600' : 'text-green-500 border-b-2'}`}
                    onClick={() => handleSelectTab('delivered')}
                >
                    <span className="xl:text-xl text-sm font-bold">DELIVERED {tabSelect === 'delivered' && <>({orderCount})</>}</span>
                </div>
            </div>
        </div>
    )
}

export default TabSelectOrder
