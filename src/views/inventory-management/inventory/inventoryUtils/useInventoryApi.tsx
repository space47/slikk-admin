import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useMemo, useState } from 'react'
import { InventoryType } from './inventoryCommon'

interface Props {
    searchType: { value: string; label?: string }
    store_code?: string
    selectedDivision?: string
    selectedCategory?: string
    selectedSubCategory?: string
    brandList?: number[]
}

export const useInventoryApi = ({ searchType, store_code, brandList, selectedCategory, selectedDivision, selectedSubCategory }: Props) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const query = useMemo(() => {
        let searchParams = ''
        let storeCode = ''
        const brandFilter = brandList?.length ? `&brand=${brandList?.map((item) => item)?.join(',')}` : ''
        const divisionFilter = selectedDivision ? `&division=${encodeURIComponent(selectedDivision)}` : ''
        const categoryFilter = selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''
        const subCategoryFilter = selectedSubCategory ? `&subCategory=${encodeURIComponent(selectedSubCategory)}` : ''

        if (globalFilter) {
            searchParams = `${searchType.value}=${encodeURIComponent(globalFilter)}`
        }
        if (store_code) {
            storeCode = `&store_code=${store_code}`
        }

        return `/inventory-location?p=${page}&page_size=${pageSize}${storeCode}${searchParams ? `&${searchParams}` : ''}${brandFilter}${divisionFilter}${categoryFilter}${subCategoryFilter}`
    }, [page, pageSize, globalFilter, searchType.value, store_code, brandList, selectedCategory, selectedDivision, selectedSubCategory])

    const { data, responseStatus, totalData } = useFetchApi<InventoryType>({ url: query })

    return { data, responseStatus, totalData, setPage, setPageSize, setGlobalFilter, page, pageSize, globalFilter, query }
}
