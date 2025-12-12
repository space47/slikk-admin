import Card from '@/components/ui/Card'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink, HiMail, HiCube, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { inwardDetailsResponse } from '../inwardCommon'
import { useMemo } from 'react'
import { FaSync } from 'react-icons/fa'

type CustomerInfoProps = {
    data: inwardDetailsResponse
}

const CustomerInfo = ({ data }: CustomerInfoProps) => {
    const unsyncedCalculation = useMemo(() => {
        const synced = typeof data?.synced_quantity === 'number' ? data?.synced_quantity : parseInt(data?.synced_quantity || '') || 0
        const qcPassed =
            typeof data?.qc_passed_quantity === 'number' ? data?.qc_passed_quantity : parseInt(data?.qc_passed_quantity || '') || 0

        return qcPassed - synced
    }, [data])

    const getSyncStatusColor = (unsynced: number) => {
        if (unsynced === 0) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
        if (unsynced < 0) return 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100'
        return 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100'
    }

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

                        {/* Synced Quantity */}
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-emerald-600 dark:text-emerald-400">Synced</span>
                                <FaSync className="text-emerald-400" />
                            </div>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{data?.synced_quantity || 0}</div>
                        </div>

                        {/* QC Passed */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-green-600 dark:text-green-400">QC Passed</span>
                                <HiCheckCircle className="text-green-400" />
                            </div>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{data?.qc_passed_quantity || 0}</div>
                        </div>
                    </div>

                    {/* Unsynced Quantity - Highlighted */}
                    <div className={`p-4 rounded-xl ${getSyncStatusColor(unsyncedCalculation)}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${
                                        unsyncedCalculation === 0
                                            ? 'bg-emerald-100 dark:bg-emerald-500/30'
                                            : unsyncedCalculation < 0
                                              ? 'bg-amber-100 dark:bg-amber-500/30'
                                              : 'bg-blue-100 dark:bg-blue-500/30'
                                    }`}
                                >
                                    {unsyncedCalculation === 0 ? (
                                        <HiCheckCircle className="text-lg" />
                                    ) : (
                                        <HiExclamationCircle className="text-lg" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold">Unsynced Quantity</div>
                                    <div className="text-sm opacity-80">
                                        {unsyncedCalculation === 0
                                            ? 'All quantities are synced'
                                            : unsyncedCalculation < 0
                                              ? 'Sync exceeds QC passed'
                                              : 'Pending sync'}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`text-2xl font-bold ${
                                    unsyncedCalculation === 0
                                        ? 'text-emerald-800 dark:text-emerald-300'
                                        : unsyncedCalculation < 0
                                          ? 'text-amber-800 dark:text-amber-300'
                                          : 'text-blue-800 dark:text-blue-300'
                                }`}
                            >
                                {unsyncedCalculation}
                            </div>
                        </div>
                    </div>

                    {/* Sync Status Badge */}
                    {unsyncedCalculation !== 0 && (
                        <div className="flex justify-center">
                            <div
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    unsyncedCalculation < 0
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
                                }`}
                            >
                                {unsyncedCalculation < 0 ? '⚠️ Sync discrepancy detected' : '🔄 Sync required'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default CustomerInfo
