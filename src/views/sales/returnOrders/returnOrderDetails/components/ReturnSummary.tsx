import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import { FaEdit } from 'react-icons/fa'
import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { ReturnOrder } from '@/store/types/returnOrderData.types'

interface BankDetails {
    account_number: string
    beneficiary_name: string
    ifsc_code: string
    upi: string
}

interface Props {
    returnOrder: ReturnOrder
}

const ReturnSummary = ({ returnOrder }: Props) => {
    const navigate = useNavigate()

    const [bankDetails, setBankDetails] = useState<BankDetails>({
        account_number: '',
        beneficiary_name: '',
        ifsc_code: '',
        upi: '',
    })

    const initialBankDetails = {
        account_number: returnOrder?.user_account_details?.account_details?.account_number || '',
        beneficiary_name: returnOrder?.user_account_details?.account_details?.beneficiary_name || '',
        ifsc_code: returnOrder?.user_account_details?.account_details?.ifsc_code || '',
        upi: returnOrder?.user_account_details?.upi || '',
    }

    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        setBankDetails(initialBankDetails)
    }, [returnOrder])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBankDetails((prev) => ({ ...prev, [name]: value }))
    }
    const handleSaveBankDetails = async () => {
        const filteredDetails = Object.entries({
            beneficiary_name: bankDetails?.beneficiary_name,
            account_number: bankDetails?.account_number,
            ifsc_code: bankDetails?.ifsc_code,
        }).filter(([, value]) => value !== '')
        const body = {
            first_name: returnOrder?.user?.first_name || '',
            last_name: returnOrder?.user?.last_name || '',
            email: returnOrder?.user?.email || '',
            bank_details: {
                upi: bankDetails?.upi,
                account_details: Object.fromEntries(filteredDetails),
            },
        }

        try {
            const response = await axioisInstance.patch(`/dashboard/user/profile/${returnOrder?.user?.mobile}`, body)
            notification.success({ message: response?.data?.message || 'Successfully Updated' })
            navigate(0)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message || 'Something went wrong' })
            }
            console.error(error)
        } finally {
            setIsEditing(false)
        }
    }

    return (
        <Card className="mb-6 p-5 rounded-2xl shadow-lg bg-white">
            <h5 className="text-lg font-bold flex items-center gap-2 mb-4">Payment Summary</h5>
            <ul className="space-y-2">
                <div className="flex justify-between text-gray-700">
                    Amount <span className="font-semibold text-black">Rs.{returnOrder?.amount}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                    Delivery <span className="font-semibold text-black">Rs.{returnOrder?.delivery}</span>
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
