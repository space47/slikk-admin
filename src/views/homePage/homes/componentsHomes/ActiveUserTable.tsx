/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import { FaSync } from 'react-icons/fa'

interface ActiveUserProps {
    from: string
    to: string
}

const ActiveUserFlow = ({ from, to }: ActiveUserProps) => {
    const [userData, setUserData] = useState<any[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const [isPageActive, setIsPageActive] = useState(true)
    const [dynamicKeys, setDynamicKeys] = useState<string[]>([])
    const [refreshToggle, setRefreshToggle] = useState(false)

    const fetchUserTable = React.useCallback(async () => {
        try {
            setShowSpinner(true)
            const response = await axioisInstance.get(
                `query/execute/Daily_user_stats?query_name=Overall_stats&end_date=${to}&start_date=${from}`,
            )
            const data = response.data.data

            const tab = Object.keys(data).map((key) => ({
                key,
                data: data[key],
            }))

            const fetchedData = tab[0].data?.data || []
            setUserData(fetchedData)

            if (fetchedData.length > 0) {
                setDynamicKeys(Object.keys(fetchedData[0]))
            }
        } catch (error: any) {
            console.error('Error fetching data:', error)
        } finally {
            setShowSpinner(false)
            setRefreshToggle(false)
        }
    }, [from, to])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsPageActive(false)
                console.log('Page is inactive')
            } else {
                setIsPageActive(true)
                console.log('Page is active')
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    useEffect(() => {
        fetchUserTable()
    }, [isPageActive, from, to, refreshToggle])

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-gray-100 dark:bg-gray-600 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
                <div className="font-bold text-2xl text-blue-900 dark:text-blue-300 mb-6">Active User Stats</div>
                <div>
                    <Button
                        className="flex flex-row gap-2 items-center"
                        size="sm"
                        variant="pending"
                        onClick={() => setRefreshToggle((prev) => !prev)}
                    >
                        <FaSync /> Refresh
                    </Button>
                </div>
            </div>
            <div className="">
                <div className="flex flex-wrap xl:gap-4 gap-0 justify-center">
                    {dynamicKeys.map((key, index) => (
                        <div key={key} className="flex flex-col items-center py-0 xl:py-2 xl:flex-row">
                            <Card className="text-center shadow-xl cursor-pointer xl:w-full w-[200px] bg-white hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                                <div className="font-bold text-xl text-blue-900 dark:text-blue-300 mb-2">{key.replace(/_/g, ' ')}</div>
                                <div className="text-green-600 text-2xl font-semibold">{userData[0]?.[key] ?? ''}</div>
                            </Card>

                            {index < dynamicKeys.length - 1 && (
                                <div className="text-4xl text-red-400">
                                    <span className="hidden xl:inline">{'➔'}</span>
                                    <span className="inline xl:hidden">{'↓'}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ActiveUserFlow
