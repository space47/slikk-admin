import Card from '@/components/ui/Card'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink, HiMail, HiCube } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { GDNDetails } from '@/store/types/gdn.types'

type CustomerInfoProps = {
    data: GDNDetails
}

const GdnInfo = ({ data }: CustomerInfoProps) => {
    return (
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="p-6">
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Item Details</h3>
                    <div className="h-1 w-16 bg-blue-500 rounded-full"></div>
                </div>
                {/* User Info Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                    <Link className="group flex items-center justify-between hover:no-underline" to="/app/crm/customer-details?id=11">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-blue-600 dark:text-blue-300 text-lg">
                                    {data?.last_updated_by?.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {data?.last_updated_by?.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Last Updated</div>
                            </div>
                        </div>
                        <HiExternalLink className="text-lg text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </Link>

                    <div className="mt-4 space-y-3">
                        <IconText
                            icon={<HiPhone className="text-lg text-gray-500" />}
                            className="hover:bg-white dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                        >
                            <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {data?.last_updated_by?.mobile || 'N/A'}
                                </span>
                            </div>
                        </IconText>

                        <IconText
                            icon={<HiMail className="text-lg text-gray-500" />}
                            className="hover:bg-white dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                        >
                            <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {data?.last_updated_by?.email || 'N/A'}
                                </span>
                            </div>
                        </IconText>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="space-y-5">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <HiCube className="text-blue-500" />
                        Quantity Overview
                    </h5>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Total SKU */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total SKU</span>
                                <HiCube className="text-gray-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data?.total_sku || 0}</div>
                        </div>

                        {/* Total Quantity */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-600 dark:text-blue-400">Total Quantity</span>
                                <HiCube className="text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{data?.total_quantity || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default GdnInfo
