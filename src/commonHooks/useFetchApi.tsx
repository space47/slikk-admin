// hooks/useFetchConfigurations.ts
import { useState, useEffect } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'

interface Api_Hooks_props<T> {
    url: string
    initialData?: T[]
}

interface ApiResponse<T> {
    data: {
        count: number
        results: T[]
    } | null
}

export const useFetchApi = <T,>({ url, initialData = [] }: Api_Hooks_props<T>) => {
    const [data, setData] = useState<T[]>(initialData)
    const [totalData, setTotalData] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [accessDenied, setAccessDenied] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axioisInstance.get<ApiResponse<T>>(url)
                setData(response.data?.data?.results ?? [])
                setTotalData(response.data?.data?.count ?? 0)
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 403) {
                    setAccessDenied(true)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [url])

    return { data, loading, accessDenied, setData, totalData, setTotalData }
}
