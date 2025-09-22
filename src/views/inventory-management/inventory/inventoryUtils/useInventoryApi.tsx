import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useMemo, useState } from 'react'
import { InventoryType } from './inventoryCommon'

interface Props {
    searchType: { value: string; label?: string }
}

export const useInventoryApi = ({ searchType }: Props) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const query = useMemo(() => {
        let searchParams = ''
        if (globalFilter) {
            searchParams = `${searchType.value}=${encodeURIComponent(globalFilter)}`
        }

        return `/inventory-location?page=${page}&pageSize=${pageSize}${searchParams ? `&${searchParams}` : ''}`
    }, [page, pageSize, globalFilter, searchType.value])

    const { data, responseStatus, totalData } = useFetchApi<InventoryType>({ url: query, initialData: [] })

    return { data, responseStatus, totalData, setPage, setPageSize, setGlobalFilter, page, pageSize, globalFilter }
}
