import Card from '@/components/ui/Card'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'

const ReturnSummary = () => {
    const returnOrder = useAppSelector<ReturnOrderState>(
        (state) => state.returnOrders
    )
    const returnDetails = returnOrder.returnOrders
    return (
        <Card className="mb-4">
            <h5 className="mb-4">Payment Summary</h5>
            <ul>
                <div className="flex justify-between mb-1">
                    Amount{' '}
                    <span className="font-semibold">
                        Rs.{returnDetails?.amount}
                    </span>
                </div>
                <div className="flex justify-between mb-1">
                    Delivery{' '}
                    <span className="font-semibold">
                        Rs.{returnDetails?.delivery}
                    </span>
                </div>
            </ul>
        </Card>
    )
}

export default ReturnSummary
