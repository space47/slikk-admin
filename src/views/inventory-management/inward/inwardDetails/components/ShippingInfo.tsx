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
                {/* Section Header */}
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <h4 className="text-xs tracking-widest font-bold text-gray-700 px-4 py-1.5 rounded-full bg-gray-100 shadow-sm">
                        DISPATCHED BY
                    </h4>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-5">
                    {/* Name */}
                    <div
                        className="group relative p-5 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm
                        hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="p-3 rounded-xl bg-orange-100 text-orange-600
                                group-hover:bg-orange-200 transition-colors"
                            >
                                <MdPerson className="h-5 w-5" />
                            </div>

                            <div className="flex-1">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Sender Name</p>
                                <p className="text-lg font-semibold text-gray-900">{senderInfo.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div
                        className="group relative p-5 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm
                        hover:border-green-300 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="p-3 rounded-xl bg-green-100 text-green-600
                                group-hover:bg-green-200 transition-colors"
                            >
                                <MdPhone className="h-5 w-5" />
                            </div>

                            <div className="flex-1">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Contact Number</p>
                                <p className="text-lg font-semibold text-gray-900">{senderInfo.mobile}</p>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div
                        className="group relative p-5 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm
                        hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="p-3 rounded-xl bg-blue-100 text-blue-600
                                group-hover:bg-blue-200 transition-colors"
                            >
                                <MdEmail className="h-5 w-5" />
                            </div>

                            <div className="flex-1">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Email Address</p>
                                <p className="text-lg font-semibold text-gray-900 break-all">{senderInfo.email}</p>
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
