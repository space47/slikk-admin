// hooks/useFetchConfigurations.ts
import { useState, useEffect, useCallback } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'

interface Api_Hooks_props<T> {
    url: string
    initialData?: T[]
    typeOfData?: 'Array' | 'Object'
    pollingInterval?: number
}

interface ApiResponse<T> {
    data: {
        count: number
        results: T[]
    } | null
}

export const useFetchApi = <T,>({ url, initialData = [], typeOfData, pollingInterval }: Api_Hooks_props<T>) => {
    const [data, setData] = useState<T[]>(initialData)
    const [totalData, setTotalData] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [responseStatus, setResponseStatus] = useState<string | number>()
    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axioisInstance.get<ApiResponse<T>>(url)
            if (typeOfData === 'Object') {
                const data = response.data
                const dataArray = Object.values(data) as T[]
                setData(dataArray)
            } else {
                setData(response.data?.data?.results ?? [])
                setTotalData(response.data?.data?.count ?? 0)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setResponseStatus(error.response?.status)
            }
        } finally {
            setLoading(false)
        }
    }, [url, typeOfData])

    useEffect(() => {
        fetchData()
        if (pollingInterval) {
            const intervalId = setInterval(() => {
                fetchData()
            }, pollingInterval)

            return () => clearInterval(intervalId)
        }
    }, [url, pollingInterval, fetchData])

    return { data, loading, setData, totalData, setTotalData, responseStatus, refetch: fetchData, pollingInterval }
}
