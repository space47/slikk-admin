import { useState } from 'react'

interface props<T> {
    data: T[] | undefined
    globalFilter: string
}

export const useLocalPaginateData = <T,>({ data, globalFilter }: props<T>) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = data ? Math.ceil(data.length / pageSize) : 0

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
