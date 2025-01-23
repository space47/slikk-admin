import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import UserMapValue from './UserMapValue'

interface props {
    from: string
    to: string
}

const UserMap = ({ from, to }: props) => {
    const [userExecuteData, setUserExecuteData] = useState<any[]>([])

    const fetchUserDatas = async () => {
        try {
            const response = await axioisInstance.get(`/query/execute/User_location?start_date=${from}&end_date=${to}`)
            const data = response?.data?.data
            const tab = Object.keys(data).map((key) => ({
                key,
                data: data[key],
            }))

            const fetchedData = tab[0].data?.data || []

            setUserExecuteData(fetchedData)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUserDatas()
    }, [from, to])

    return (
        <div>
            <UserMapValue
                latitudes={userExecuteData
                    ?.map((item) => item.latitude)
                    .join(',')
                    .split(',')
                    .map(Number)}
                longitudes={userExecuteData
                    ?.map((item) => item.longitude)
                    .join(',')
                    .split(',')
                    .map(Number)}
            />
        </div>
    )
}

export default UserMap
