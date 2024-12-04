import { Card, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useMemo, useState } from 'react'

interface ActiveUserProps {
    from: string
    to: string
}

const ActiveUserFlow = ({ from, to }: ActiveUserProps) => {
    const [userData, setUserData] = useState<any[]>([])
    const [showSpinner, setShowSpinner] = useState(false)

    const fetchUserTable = async () => {
        try {
            setShowSpinner(true)
            const response = await axioisInstance.get(`query/execute/Daily_user_stats?end_date=${to}&start_date=${from}`)
            const data = response.data.data
            const tab = Object.keys(data).map((key) => {
                return {
                    key,
                    data: data[key],
                }
            })
            setUserData(tab[0].data?.data)
        } catch (error: any) {
            console.log(error)
        } finally {
            setShowSpinner(false)
        }
    }

    useEffect(() => {
        fetchUserTable()
        const interval = setInterval(() => {
            fetchUserTable()
        }, 60000)
        return () => clearInterval(interval)
    }, [from, to])

    const columns = useMemo(
        () => [
            { header: 'Daily Active Sessions', accessorKey: 'Daily_Active_Sessions' },
            { header: 'Total Page Views', accessorKey: 'Total_Page_Views' },
            { header: 'Daily Active Users', accessorKey: 'Daily_Active_Users' },
            { header: 'New Registrations', accessorKey: 'New_Registrations' },
            { header: 'Add To Cart', accessorKey: 'Add_To_Cart' },
            { header: 'Begin Checkout', accessorKey: 'Begin_Checkout' },
            { header: 'Total Orders', accessorKey: 'Total_Orders' },
            { header: 'Orders by New User', accessorKey: 'Orders_By_New_Users' },
        ],
        [userData],
    )

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center">
                <Spinner size={40} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="font-bold text-2xl mb-4">Active User Stats</div>
            <div className="flex flex-wrap xl:gap-4 gap-0 justify-center">
                {columns.map((col, index) => (
                    <div key={col.accessorKey} className="flex flex-col items-center py-0 xl:py-2   xl:flex-row">
                        <Card className="text-center shadow-xl  cursor-pointer xl:w-full w-[200px] ">
                            <div className="font-bold text-xl text-gray-500 mb-2">{col.header}</div>
                            <div className="text-green-500 text-xl font-semibold">{userData[0]?.[col.accessorKey] ?? ''}</div>
                        </Card>
                        {index < columns.length - 1 && (
                            <div className="text-4xl text-red-400">
                                <span className="hidden xl:inline">{'➔'}</span>
                                <span className="inline xl:hidden">{'↓'}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActiveUserFlow
