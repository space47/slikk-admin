/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import EasyTable from '@/common/EasyTable'
import { ReferralData } from '@/store/types/orderUserSummary.types'

interface Props {
    referralData: ReferralData
}

const CustomerReferral = ({ referralData }: Props) => {
    const columns = [
        {
            header: 'Name',
            accessorKey: 'user',
            cell: ({ row }: any) => {
                return <span>{row.original.user || '—'}</span>
            },
        },
        {
            header: 'Mobile',
            accessorKey: 'mobile',
            cell: ({ row }: any) => {
                return <span className="tracking-wide">{row.original.mobile}</span>
            },
        },
        {
            header: 'Earned',
            accessorKey: 'earned',
            cell: ({ row }: any) => {
                return <span>₹{row.original.earned}</span>
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }: any) => {
                return (
                    <span
                        className={`px-2 py-1 text-xs rounded-md font-medium ${
                            row.original.status === 'REFERRED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {row.original.status}
                    </span>
                )
            },
        },
    ]

    const Referral_Contents = [
        { label: 'Referral Code', value: referralData?.referral_code || '—', color: `text-gray-800 dark:text-white tracking-wide` },
        { label: 'Total Earned', value: `₹${referralData?.total_earned ?? 0}` || '—', color: `text-green-600 dark:text-green-400` },
        { label: 'Pending', value: `₹${referralData?.total_pending ?? 0}` || '—', color: `text-orange-600 dark:text-orange-400` },
        { label: 'Redeemed', value: `₹${referralData?.total_redeemed ?? 0}` || '—', color: `text-blue-600 dark:text-blue-400` },
    ]

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-6 mt-10 xl:mt-0">
            <div className="text-xl font-bold mb-10">Referral Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {Referral_Contents.map((item, key) => (
                    <div key={key}>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">{item?.label}</h3>
                            <p className={`text-lg font-semibold ${item?.color}`}>{item?.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            <EasyTable noPage overflow columns={columns} mainData={referralData?.referral_data || []} />
        </div>
    )
}

export default CustomerReferral
