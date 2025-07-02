import { useState } from 'react'

interface props<T> {
    data: T[] | undefined
    globalFilter: string
}

export const useLocalPaginateData = <T,>({ data, globalFilter }: props<T>) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const filteredData = data?.filter((item) =>
        Object.values(item as object).some((val) => (val ? val.toString().toLowerCase().includes(globalFilter.toLowerCase()) : false)),
    )

    const paginatedData = filteredData?.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = filteredData ? Math.ceil(filteredData.length / pageSize) : 0

    return {
        page,
        setPage,
        pageSize,
        globalFilter,
        setPageSize,
        paginatedData,
        totalPages,
    }
}
