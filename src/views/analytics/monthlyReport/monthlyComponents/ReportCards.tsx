// components/ReportSections.tsx
import React from 'react'
import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import { FaDownload } from 'react-icons/fa'

interface CARDPROPS {
    handleUserDOWNLOAD: any
}

const ReportCards = ({ handleUserDOWNLOAD }: CARDPROPS) => {
    const { monthlyReport } = useAppSelector((state: { monthlyReport: MONTHLYREPORTTYPES }) => state.monthlyReport)

    const DATADETAILS = [
        { name: 'TOTAL TRANSACTIONS', value: monthlyReport?.total_transactions },
        { name: 'COMPLETED TRANSACTIONS', value: monthlyReport?.total_completed_transactions },
        { name: 'UNIQUE USERS', value: monthlyReport?.unique_users },
        { name: 'AOV', value: monthlyReport?.AOV },
        { name: 'ABS', value: monthlyReport?.ABS },
        { name: 'RETURN COUNT', value: monthlyReport?.return_count },
    ]

    const USERDATAARRAYS = [
        { name: 'REPEAT USERS', value: monthlyReport?.repeat_users },
        { name: 'USER WITH 2 ORDERS', value: monthlyReport?.user_with_2_orders },
        { name: 'USER WITH 2 to 4 ORDERS', value: monthlyReport?.user_with_2to4_orders },
        { name: 'USER WITH 5 ORDERS', value: monthlyReport?.user_with_5_orders },
        { name: 'User From Last Month', value: monthlyReport?.user_repeat_from_last_month },
    ]

    const DELIVERYTYPE = [
        { name: 'EXPRESS', value: monthlyReport?.delivery_type.EXPRESS },
        { name: 'STANDARD', value: monthlyReport?.delivery_type.STANDARD },
        { name: 'TRY AND BUY', value: monthlyReport?.delivery_type.TRY_AND_BUY },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
            <Card className="shadow-lg rounded-lg p-6 bg-white border hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Details</h2>
                {DATADETAILS.map((item, key) => (
                    <div key={key} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center xl:text-[16px] font-semibold">
                            <span className="text-gray-600 font-medium">{item.name}:</span>
                            <span className="text-gray-900">{item.value}</span>
                        </div>
                    </div>
                ))}
            </Card>

            <Card className="shadow-lg rounded-lg p-6 bg-white border hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">User Data</h2>
                {USERDATAARRAYS.map((item, key) => (
                    <div key={key} className="flex flex-col bg-white rounded-lg ">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium xl:text-[16px]">{item.name}:</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-900 font-semibold">{item?.value?.count ?? item?.value?.total}</span>
                                <button className="flex items-center justify-center " onClick={() => handleUserDOWNLOAD(item.value?.users)}>
                                    <FaDownload className="text-gray-800 text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Card>

            <Card className="shadow-lg rounded-lg p-6 bg-white border hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Type</h2>
                {DELIVERYTYPE.map((item, key) => (
                    <div key={key} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center xl:text-[16px] font-semibold">
                            <span className="text-gray-600 font-medium">{item.name}:</span>
                            <span className="text-gray-900">{item.value}</span>
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    )
}

export default ReportCards
