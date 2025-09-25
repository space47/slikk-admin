import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useMemo, useState } from 'react'
import { InventoryType } from './inventoryCommon'

interface Props {
    searchType: { value: string; label?: string }
    store_code?: string
}

export const useInventoryApi = ({ searchType, store_code }: Props) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const query = useMemo(() => {
        let searchParams = ''
        let storeCode = ''
        if (globalFilter) {
            searchParams = `${searchType.value}=${encodeURIComponent(globalFilter)}`
        }
        if (store_code) {
            storeCode = `&store_code=${store_code}`
        }

        return `/inventory-location?p=${page}&page_size=${pageSize}${storeCode}${searchParams ? `&${searchParams}` : ''}`
    }, [page, pageSize, globalFilter, searchType.value, store_code])

    const { data, responseStatus, totalData } = useFetchApi<InventoryType>({ url: query })

    return { data, responseStatus, totalData, setPage, setPageSize, setGlobalFilter, page, pageSize, globalFilter }
}
