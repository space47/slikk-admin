import Card from '@/components/ui/Card'
import { MdPerson, MdPhone, MdEmail, MdBusiness } from 'react-icons/md'
import { FaWarehouse } from 'react-icons/fa'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

type ShippingInfoProps = {
    origin_address: string
    company: number
}

const ShippingInfo = ({ origin_address, company }: ShippingInfoProps) => {
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    // Mock data - replace with actual data from props when available
    const senderInfo = {
        name: '#Name',
        mobile: '#mobile',
        email: '#email',
    }

    return (
        <Card className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl bg-gradient-to-br from-white to-gray-50">
            {/* Header with gradient */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sender Details</h3>
                <div className="h-1 w-16 bg-blue-500 rounded-full"></div>
            </div>

            {/* Origin Address Card */}
            <div className="mb-8 p-2 overflow-x-auto scrollbar-hide w-auto  rounded-xl border ">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm flex-shrink-0">
                        <FaWarehouse className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">Origin Address</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed pl-1">{origin_address}</p>
                    </div>
                </div>
            </div>

            {/* Sender Information Grid */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                    <h4 className="text-sm font-semibold text-gray-700 px-3 bg-gray-100 rounded-full py-1">DISPATCHED BY</h4>
                    <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Name Card */}
                    <div className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                <MdPerson className="h-5 w-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">Sender Name</p>
                                <p className="font-semibold text-gray-900 text-lg">{senderInfo.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card */}
                    <div className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                <MdPhone className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">Contact Number</p>
                                <p className="font-semibold text-gray-900 text-lg">{senderInfo.mobile}</p>
                            </div>
                        </div>
                    </div>

                    {/* Email Card - Full Width */}
                    <div className="lg:col-span-2 group p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <MdEmail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                <p className="font-semibold text-gray-900 text-lg break-all">{senderInfo.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brand Footer */}
            <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-sm">
                            <MdBusiness className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{companyList?.find((item) => item?.id === company)?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Official Partner • Verified Shipper</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ShippingInfo
