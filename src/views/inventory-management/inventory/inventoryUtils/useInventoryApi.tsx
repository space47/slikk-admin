import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useMemo, useState } from 'react'
import { InventoryType } from './inventoryCommon'

interface Props {
    searchType: { value: string; label?: string }
    store_code?: string
    typeFetch?: string
    sortByFilter?: string
}

export const useInventoryApi = ({ searchType, store_code, typeFetch, sortByFilter }: Props) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const query = useMemo(() => {
        let params = !globalFilter ? `p=${page}&page_size=${pageSize}` : ''
        let sort = ''

        if (typeFetch) params += `&${typeFetch}`
        if (store_code) params += `&store_code=${encodeURIComponent(store_code)}`
        if (globalFilter) params += `&${searchType.value}=${encodeURIComponent(globalFilter)}`
        if (sortByFilter) sort = `&sort=${sortByFilter}`

        return `/inventory-location?${params}${sort}`
    }, [page, pageSize, globalFilter, searchType.value, store_code, typeFetch, sortByFilter])

    const { data, responseStatus, totalData, loading } = useFetchApi<InventoryType>({ url: query })

    return {
        data,
        responseStatus,
        totalData,
        setPage,
        setPageSize,
        setGlobalFilter,
        page,
        pageSize,
        globalFilter,
        query,
        loading,
    }
}
