import { useState } from 'react'
import Card from '@/components/ui/Card'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { FaEdit } from 'react-icons/fa'
import { Button } from '@/components/ui'

const ReturnSummary = () => {
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnDetails = returnOrder.returnOrders

    const initialBankDetails = {
        account_number: returnDetails?.user_account_details?.account_details?.account_number || '',
        beneficiary_name: returnDetails?.user_account_details?.account_details?.beneficiary_name || '',
        ifsc_code: returnDetails?.user_account_details?.account_details?.ifsc_code || '',
        upi: returnDetails?.user_account_details?.upi || '',
    }

    const [bankDetails, setBankDetails] = useState(initialBankDetails)
    const [isEditing, setIsEditing] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBankDetails((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveBankDetails = async () => {}

    return (
        <Card className="mb-6 p-5 rounded-2xl shadow-lg bg-white">
            <h5 className="text-lg font-bold flex items-center gap-2 mb-4">Payment Summary</h5>
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
                <div className="flex justify-between items-center mt-3 mb-4">
                    <h5 className="text-lg font-bold flex items-center gap-2">Bank Details</h5>
                    <FaEdit className="cursor-pointer text-gray-600 hover:text-black" onClick={() => setIsEditing((prev) => !prev)} />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-gray-700 gap-2">
                        <span className="text-sm">Acc. Number</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="account_number"
                                value={bankDetails.account_number}
                                className="border p-1 rounded text-sm"
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="font-semibold text-black">{initialBankDetails.account_number || 'N/A'}</span>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-gray-700 gap-2">
                        <span className="text-sm">Beneficiary</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="beneficiary_name"
                                value={bankDetails.beneficiary_name}
                                className="border p-1 rounded text-sm"
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="font-semibold text-black">{initialBankDetails.beneficiary_name || 'N/A'}</span>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-gray-700 gap-2">
                        <span className="text-sm">IFSC Code</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="ifsc_code"
                                value={bankDetails.ifsc_code}
                                className="border p-1 rounded text-sm"
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="font-semibold text-black">{initialBankDetails.ifsc_code || 'N/A'}</span>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-gray-700 gap-2">
                        <span className="text-sm">UPI</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="upi"
                                value={bankDetails.upi}
                                className="border p-1 rounded text-sm"
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="font-semibold text-black">{initialBankDetails.upi || 'N/A'}</span>
                        )}
                    </div>
                    {isEditing && (
                        <div className="flex justify-end">
                            <Button variant="accept" size="sm" onClick={handleSaveBankDetails}>
                                Save
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default ReturnSummary
