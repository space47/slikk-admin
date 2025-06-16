// hooks/useFetchSingleData.ts
import { useState, useEffect } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'

interface useFetchSingleDataProps<T> {
    url: string
    initialData?: T
    onErrorStatus?: (status: number) => void
}

export const useFetchSingleData = <T,>({ url, initialData, onErrorStatus }: useFetchSingleDataProps<T>) => {
    const [data, setData] = useState<T | undefined>(initialData)
    const [loading, setLoading] = useState(false)
    const [responseStatus, setResponseStatus] = useState<number | string>()

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get<{ data: T }>(url)
            setData(response.data.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                setResponseStatus(error.response?.status)
                if (error.response?.status && onErrorStatus) {
                    onErrorStatus(error.response.status)
                }
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [url])

    return { data, loading, responseStatus, refetch: fetchData }
}
