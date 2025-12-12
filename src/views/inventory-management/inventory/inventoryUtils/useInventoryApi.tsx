import { useEffect, useState } from 'react'
import { InventoryType } from './inventoryCommon'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

interface Props {
    searchType: { value: string; label?: string }
    store_code?: string
    typeFetch?: string
    sortByFilter?: string
}

export const useInventoryApi = ({ searchType, store_code, typeFetch, sortByFilter }: Props) => {
    const [data, setData] = useState<InventoryType[]>([])
    const [responseStatus, setResponseStatus] = useState<string | number>()
    const [totalData, setTotalData] = useState(0)
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(false)
    const [globalFilter, setGlobalFilter] = useState('')
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })

    const query = () => {
        let params = `p=${page}&page_size=${pageSize}` || ''
        let sort = ''

        if (typeFetch) params += `&${typeFetch}`
        if (store_code) params += `&store_code=${encodeURIComponent(store_code)}`
        if (debounceFilter) params += `&${searchType.value}=${encodeURIComponent(debounceFilter)}`
        if (sortByFilter) sort = `&sort=${sortByFilter}`

        return `/inventory-location?${params}${sort}`
    }

    const fetchData = async () => {
        try {
            setLoading(true)

            const res = await axioisInstance.get(query())
            setTotalData(res?.data?.data?.count)
            setTotalQuantity(res?.data?.data?.total_quantity)
            setData(res?.data?.data?.results)
            setResponseStatus(res?.status)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
                setData([])
                setResponseStatus(error.response?.status)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, pageSize, debounceFilter, searchType.value, store_code, typeFetch, sortByFilter])

    return {
        data,
        query,
        totalQuantity,
        responseStatus,
        totalData,
        setPage,
        setPageSize,
        setGlobalFilter,
        page,
        pageSize,
        globalFilter,
        loading,
    }
}
