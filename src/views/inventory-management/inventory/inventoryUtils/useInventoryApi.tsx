import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useMemo, useState } from 'react'
import { InventoryType } from './inventoryCommon'

interface props {
    searchType: Record<string, string>
}

export const useInventoryApi = ({ searchType }: props) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const query = useMemo(() => {
        let searchParams = ''
        if (globalFilter && searchType.value === 'sku') searchParams = `sku=${encodeURIComponent(globalFilter)}`
        if (globalFilter && searchType.value === 'skid') searchParams = `skid=${encodeURIComponent(globalFilter)}`

        return `/inventory-location?page=${page}&pageSize=${pageSize}${searchParams ? `&${searchParams}` : ''}`
    }, [page, pageSize, globalFilter, searchType])

    const { data, responseStatus, totalData } = useFetchApi<InventoryType>({ url: query, initialData: [] })

    return { data, responseStatus, totalData, setPage, setPageSize, setGlobalFilter, page, pageSize, globalFilter }
}
