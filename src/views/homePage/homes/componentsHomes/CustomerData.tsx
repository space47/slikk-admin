/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Card } from '@/components/ui'
import moment from 'moment'
import React from 'react'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
            <p className="text-gray-800 dark:text-gray-200 font-semibold break-words">{value}</p>
        </div>
    )
}

interface CustomerProps {
    data: any
}

const CustomerData = ({ data }: CustomerProps) => {
    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-8">
                    {/* Profile Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
                        <Avatar size={90} shape="circle" src={data?.profile?.image} />
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {data?.profile?.first_name} {data?.profile?.last_name}
                        </h4>
                    </div>

                    {/* Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
                        <div className="flex flex-col gap-4">
                            <CustomerInfoField title="Email" value={data?.profile?.email} />
                            <CustomerInfoField title="Phone" value={data?.profile?.mobile} />
                            <CustomerInfoField
                                title="Date of Birth"
                                value={data?.profile?.dob ? moment(data?.profile?.dob).format('YYYY-MM-DD') : 'N/A'}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <CustomerInfoField
                                title="Registered On"
                                value={moment(data?.profile?.date_joined).format('YYYY-MM-DD HH:mm:ss a')}
                            />
                            <CustomerInfoField
                                title="Last Login"
                                value={moment(data?.profile?.last_otp_tried_time).format('YYYY-MM-DD HH:mm:ss a')}
                            />
                            <CustomerInfoField title="Gender" value={data?.profile?.gender || 'N/A'} />
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className=" flex flex-col bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4  items-center justify-between shadow-sm hover:shadow-md transition">
                            <span className="text-xl font-semibold text-gray-800 dark:text-white">{data?.orders?.count}</span>
                            <span className="text-sm font-medium px-3 py-1 bg-red-600 text-white rounded-full flex justify-center items-center">
                                Order Count
                            </span>
                        </div>
                        <div className="flex-col bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition">
                            <span className="text-xl font-semibold text-gray-800 dark:text-white">
                                ₹{data?.orders?.total_amount.toFixed(2)}
                            </span>
                            <span className="text-sm font-medium px-3 py-1 bg-green-500 text-white rounded-full">Total Amount</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CustomerData
