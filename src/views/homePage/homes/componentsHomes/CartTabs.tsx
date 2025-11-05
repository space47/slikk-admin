import CartOrder from './CartOrders'
import CartReturnOrders from './CartReturnOrders'
import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import CustomerReferral from './CustomerReferral'
import CustomerEvents from './CustomerEvents'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'

interface props {
    customerData: OrderSummaryTYPE['customerData']
}

const CartTabs = ({ customerData }: props) => {
    const TabsArray = [
        { label: 'Order', value: 'orders' },
        // {label: 'Return', value: 'returns' },
        { label: 'Returns', value: 'returns' },
        { label: 'Events', value: 'events' },
        { label: 'Referrals', value: 'referrals' },
    ]

    return (
        <div className="flex flex-col gap-6">
            <Tabs>
                <TabList className="flex items-center justify-start gap-4 bg-gray-50 rounded-3xl shadow-md p-3 mb-10">
                    {TabsArray?.map((tab, index) => (
                        <TabNav
                            key={index}
                            value={tab.value}
                            className="relative px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 rounded-xl transition-all duration-300 hover:text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            {tab.label}
                        </TabNav>
                    ))}
                </TabList>

                <TabContent value="orders">
                    <CartOrder />
                </TabContent>
                <TabContent value="returns">
                    <CartReturnOrders />
                </TabContent>
                <TabContent value="events">
                    {Array.isArray(customerData?.event) && customerData.event.length > 0 ? (
                        <div>
                            <CustomerEvents customerEvents={customerData?.event || []} />
                        </div>
                    ) : (
                        <div className="text-lg sm:text-xl font-bold flex items-center justify-center mt-5">No Events Available</div>
                    )}
                </TabContent>
                <TabContent value="referrals">
                    {customerData?.referral ? (
                        <div>
                            <CustomerReferral referralData={customerData.referral} />
                        </div>
                    ) : (
                        <div className="text-lg sm:text-xl font-bold flex items-center justify-center mt-5">No Cart Available</div>
                    )}
                </TabContent>
            </Tabs>
        </div>
    )
}

export default CartTabs
