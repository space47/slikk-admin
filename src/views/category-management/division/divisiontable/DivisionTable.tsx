/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { Modal } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'
import ClearCache from '@/common/ClearCache'
import { useDivisionColumns } from './divisionUtils/useDivisionColumns'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { DataItem } from './divisionCommon'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import { useDeleteFromCatalog } from '@/commonHooks/useDeleteFromCatalog'

const { Tr, Th, Td, THead, TBody } = Table

const DivisionTable = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [idStoreForDelete, setIdStoreForDelete] = useState<string | number | undefined>()

    const queryParams = useMemo(() => {
        const filtervalue = globalFilter ? `&q=${globalFilter}` : ''
        return `division?dashboard=true${filtervalue}`
    }, [globalFilter])

    const { data } = useFetchSingleData<DataItem[]>({ url: queryParams, initialData: [] })

    const filteredData = data?.filter((item) =>
        Object.values(item).some((val) => (val ? val.toString().toLowerCase().includes(globalFilter.toLowerCase()) : false)),
    )

    const paginatedData = filteredData?.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = filteredData ? Math.ceil(filteredData.length / pageSize) : 0

    const handleDeleteClick = (id: any) => {
        setDeleteModal(true)
        setIdStoreForDelete(id)
    }
    const columns = useDivisionColumns({ handleDeleteClick })

    const { deleteFromCatalog } = useDeleteFromCatalog({ idStoreForDelete, name: 'division', setDeleteModal })

    const handleCloseModal = () => {
        setDeleteModal(false)
    }

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
                <Modal
                    title=""
                    open={deleteModal}
                    okText="DELETE"
                    okButtonProps={{
                        style: { backgroundColor: 'red', borderColor: 'red' },
                    }}
                    onOk={deleteFromCatalog}
                    onCancel={handleCloseModal}
                >
                    <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                        <IoWarningOutline className="text-red-600 text-4xl" /> ARE YOU SURE YOU WANT TO DELETE !!
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default DivisionTable
