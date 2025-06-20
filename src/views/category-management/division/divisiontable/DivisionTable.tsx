/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import ClearCache from '@/common/ClearCache'
import { useDivisionColumns } from './divisionUtils/useDivisionColumns'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { DataItem } from './divisionCommon'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import { useDeleteFromCatalog } from '@/commonHooks/useDeleteFromCatalog'
import { useLocalPaginateData } from '@/commonHooks/useLocalPaginateData'
import CatalogDeleteModal from '@/common/CatalogDeleteModal'

const { Tr, Th, Td, THead, TBody } = Table

const DivisionTable = () => {
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [idStoreForDelete, setIdStoreForDelete] = useState<string | number | undefined>()

    const queryParams = useMemo(() => {
        const filterValue = globalFilter ? `&name=${globalFilter}` : ''
        return `division?dashboard=true${encodeURIComponent(filterValue)}`
    }, [globalFilter])

    const { data } = useFetchSingleData<DataItem[]>({ url: queryParams, initialData: [] })

    const { page, pageSize, paginatedData, setPage, setPageSize, totalPages } = useLocalPaginateData({
        data,
        globalFilter,
    })

    const handleDeleteClick = (id: any) => {
        setDeleteModal(true)
        setIdStoreForDelete(id)
    }
    const columns = useDivisionColumns({ handleDeleteClick })

    const { deleteFromCatalog } = useDeleteFromCatalog({ idStoreForDelete, name: 'division', setDeleteModal })

    return (
        <div className="p-3 shadow-xl rounded-xl ">
            <div className="flex justify-between">
                <div className="mb-4">
                    <input
                        type="text"
                        className="p-2 border rounded"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <div>
                    <ClearCache cacheKey="division" />
                </div>
            </div>
            <Table overflow className="scrollbar-hide">
                <THead>
                    <Tr>
                        {columns.map((col) => (
                            <Th key={col.header}>{col.header}</Th>
                        ))}
                    </Tr>
                </THead>
                <TBody>
                    {paginatedData?.map((row: any) => (
                        <Tr key={row.id}>
                            {columns.map((col: any) => (
                                <Td key={col.accessor}>{col.format ? col.format(row[col?.accessor]) : row[col.accessor]}</Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination currentPage={page} total={totalPages} onChange={(page) => setPage(page)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => setPageSize(Number(option?.value))}
                    />
                </div>
            </div>

            {deleteModal && (
                <CatalogDeleteModal deleteModal={deleteModal} setDeleteModal={setDeleteModal} deleteFromCatalog={deleteFromCatalog} />
            )}
        </div>
    )
}

export default DivisionTable
