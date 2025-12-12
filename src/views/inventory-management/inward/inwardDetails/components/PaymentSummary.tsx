import { Avatar } from '@/components/ui'
import Card from '@/components/ui/Card'
import { MdLocationOn, MdPerson, MdPhone, MdEmail } from 'react-icons/md'

type PaymentSummaryProps = {
    received_address: string
    received_by: {
        email: string
        mobile: string
        name: string
    }
}

const PaymentSummary = ({ received_address, received_by }: PaymentSummaryProps) => {
    return (
        <Card className="p-6 border border-gray-200 rounded-lg">
            {/* Header */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recipient Details</h3>
                <div className="h-1 w-16 bg-blue-500 rounded-full"></div>
            </div>

            {/* Address */}
            <div className="mb-8">
                <div className="flex items-start gap-3 mb-3">
                    <MdLocationOn className="h-5 w-5 text-blue-500 mt-0.5" />
                    <h4 className="font-medium text-gray-900">Delivery Address</h4>
                </div>
                <p className="text-gray-700 pl-8">{received_address}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-6"></div>

            {/* Contact Details */}
            <h4 className="font-medium text-gray-900 mb-4">Contact Person</h4>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MdPerson className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Name</span>
                    </div>
                    <span className="font-medium">{received_by?.name}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MdPhone className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Mobile</span>
                    </div>
                    <span className="font-medium">{received_by?.mobile}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MdEmail className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Email</span>
                    </div>
                    <span className="font-medium text-blue-600">{received_by?.email}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Avatar shape="circle" src="/img/logo/logo-light-streamline.png" />
                    <span className="text-sm font-bold">Sliksync Technologies Pvt. Ltd.</span>
                </div>
            </div>
        </Card>
    )
}

export default PaymentSummary
