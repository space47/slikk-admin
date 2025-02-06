import Card from '@/components/ui/Card'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'

const ReturnSummary = () => {
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnDetails = returnOrder.returnOrders

    const bankData = [
        { label: 'Acc. Number', value: returnDetails?.user_account_details?.account_details?.account_number || 'N/A' },
        { label: 'Beneficiary', value: returnDetails?.user_account_details?.account_details?.beneficiary_name || 'N/A' },
        { label: 'IFSC Code', value: returnDetails?.user_account_details?.account_details?.ifsc_code || 'N/A' },
        { label: 'UPI', value: returnDetails?.user_account_details?.upi || 'N/A' },
    ]

    return (
        <Card className="mb-6 p-5 rounded-2xl shadow-lg bg-white">
            <h5 className="text-lg font-bold flex items-center gap-2 mb-4"> Payment Summary</h5>
            <ul className="space-y-2">
                <div className="flex justify-between text-gray-700">
                    Amount <span className="font-semibold text-black">Rs.{returnDetails?.amount}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                    Delivery <span className="font-semibold text-black">Rs.{returnDetails?.delivery}</span>
                </div>
            </ul>

            <div className="mt-5">
                <hr className="border-gray-300" />
                <h5 className="text-lg font-bold flex items-center gap-2 mt-3 mb-4">Bank Details</h5>

                <div className="space-y-2">
                    {bankData?.map((item, key) => (
                        <div key={key} className="flex justify-between text-gray-700">
                            <span className="text-sm">{item.label}</span>
                            <span className="font-semibold text-black">{item?.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default ReturnSummary
