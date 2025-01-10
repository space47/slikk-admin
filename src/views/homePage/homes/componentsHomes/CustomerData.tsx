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
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">{value}</p>
        </div>
    )
}

interface CustomerProps {
    data: any
}

const CustomerData = ({ data }: CustomerProps) => {
    return (
        <div>
            <Card>
                <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                    <div className="flex xl:flex-col items-center gap-4">
                        <Avatar size={90} shape="circle" src={data?.profile?.image} />
                        <h4 className="font-bold">
                            {data?.profile?.first_name} {data?.profile?.last_name}
                        </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8">
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <CustomerInfoField title="Email" value={data?.profile?.email} />
                                <CustomerInfoField title="Phone" value={data?.profile?.mobile} />

                                <CustomerInfoField
                                    title="Date of birth"
                                    value={data?.profile?.dob ? moment(data?.profile?.dob).format('YYYY-MM-DD') : 'N/A'}
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <CustomerInfoField
                                    title="Registered on"
                                    value={moment(data?.profile?.date_joined).format('YYYY-MM-DD HH:mm:ss a')}
                                />
                                <CustomerInfoField
                                    title="Last Login"
                                    value={moment(data?.profile?.last_otp_tried_time).format('YYYY-MM-DD HH:mm:ss a')}
                                />
                            </div>
                        </div>
                        <CustomerInfoField title="Gender" value={data?.profile?.gender ? data?.profile?.gender : 'N/A'} />
                        <div className="mb-7">
                            <div className="flex mt-4 gap-8">
                                <Card className="flex justify-between items-center  shadow-lg border border-gray-200 rounded-xl hover:shadow-2xl transition-all duration-200 w-full sm:w-auto">
                                    <div className="text-gray-700 text-lg font-medium flex items-center justify-center">
                                        {data?.orders?.count}
                                    </div>
                                    <div className={`px-4 py-2 text-white rounded-full text-sm bg-red-600 `}>Order Count</div>
                                </Card>

                                <Card className="flex justify-between items-center  shadow-lg border border-gray-200 rounded-xl hover:shadow-2xl transition-all duration-200 w-full sm:w-auto">
                                    <div className="text-gray-700 text-lg font-medium flex items-center justify-center">
                                        {data?.orders?.total_amount.toFixed(2)}
                                    </div>
                                    <div className={`px-4 py-2 text-white rounded-full text-sm bg-green-500`}>Total Amount</div>
                                </Card>
                            </div>
                        </div>
                    </div>
                    {/* <div className="mt-4 flex flex-col xl:flex-row gap-2">
                    <CustomerProfileAction id={data.id} />
                </div> */}
                </div>
            </Card>
        </div>
    )
}

export default CustomerData
