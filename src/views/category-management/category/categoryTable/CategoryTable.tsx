/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'
import { categoryItem, Option, pageSizeOptions } from './categoryCommon'
import EasyTable from '@/common/EasyTable'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useCategoryColumns } from './categoryUtils/useCategoryColumns'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useDeleteFromCatalog } from '@/commonHooks/useDeleteFromCatalog'

const CategoryTable = () => {
    const navigate = useNavigate()
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [idStoreForDelete, setIdStoreForDelete] = useState()
    const [selectedDivision, setSelectedDivision] = useState('Select Division')

    const DivisionArray = divisions?.divisions?.map((item) => item?.name)

    const queryParams = useMemo(() => {
        const filterValue = globalFilter ? `&name=${globalFilter}` : ''
        const divisionFilter = selectedDivision !== 'Select Division' ? `&division=${selectedDivision}` : ''
        return `category?dashboard=true${filterValue}${divisionFilter}`
    }, [globalFilter, selectedDivision])

    const { data } = useFetchSingleData<categoryItem[]>({ url: queryParams })

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize
        const end = start + pageSize
        return data?.slice(start, end)
    }, [data, page, pageSize])

    const handleDeleteClick = (id: any) => {
        setDeleteModal(true)
        setIdStoreForDelete(id)
    }

    const { deleteFromCatalog } = useDeleteFromCatalog({ idStoreForDelete, name: 'category', setDeleteModal })
    const columns = useCategoryColumns({ handleDeleteClick })

    return (
        <div className="p-2 rounded-xl shadow-xl">
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="flex flex-col gap-2 xl:flex-row items-center">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search here"
                            value={globalFilter}
                            className="p-2 border rounded"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <div className="bg-gray-200 max-h-[140px] px-1 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border   text-black text-lg font-semibold "
                                title={selectedDivision}
                                onSelect={(selectedKey) => setSelectedDivision(selectedKey)}
                            >
                                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:max-h-[600px]  xl:overflow-y-scroll font-bold ">
                                    {DivisionArray?.map((item, key) => (
                                        <DropdownItem key={key} eventKey={item} className="h-1">
                                            {item}
                                        </DropdownItem>
                                    ))}
                                </div>
                                <div
                                    className="flex mt-3 justify-center items-center rounded-lg cursor-pointer text-white bg-red-500 hover:bg-red-400"
                                    onClick={() => setSelectedDivision('Select Division')}
                                >
                                    Clear
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-end justify-end mb-4 order-first xl:order-1">
                        <button
                            className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                            onClick={() => navigate('/app/category/category/add')}
                        >
                            ADD NEW CATEGORY
                        </button>{' '}
                    </div>
                </div>
            </div>
            <EasyTable mainData={paginatedData || []} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={data?.length || 0} onChange={(page) => setPage(page)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            if (option) {
                                setPage(1)
                                setPageSize(option?.value)
                            }
                        }}
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
                    onCancel={() => setDeleteModal(false)}
                >
                    <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                        <IoWarningOutline className="text-red-600 text-4xl" /> ARE YOU SURE YOU WANT TO DELETE !!
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default CategoryTable
