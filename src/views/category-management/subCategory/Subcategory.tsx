/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useSubCategoryColumns } from './subCategoryUtils/useSubCategoryColumns'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import { useSubCategoryFilter } from './subCategoryUtils/subCategoryFilter'
import { useGetSubCategory } from './subCategoryUtils/useGetSubCategory'
import { useDeleteFromCatalog } from '@/commonHooks/useDeleteFromCatalog'
import { useLocalPaginateData } from '@/commonHooks/useLocalPaginateData'
import CatalogDeleteModal from '@/common/CatalogDeleteModal'
import { useAppDispatch, useAppSelector } from '@/store'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { getAllSubCategoryAPI } from '@/store/action/subcategory.action'

const { Tr, Th, Td, THead, TBody } = Table

const Subcategory = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [deleteModal, setDeleteModal] = useState(false)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [idStoreForDelete, setIdStoreForDelete] = useState()
    const [selectedDivision, setSelectedDivision] = useState('Select Division')
    const [selectedCategory, setSelectedCategory] = useState('Select Category')

    useEffect(() => {
        const divisionParam = selectedDivision && selectedDivision !== 'Select Division' ? selectedDivision : undefined
        const categoryParam = selectedCategory && selectedCategory !== 'Select Category' ? selectedCategory : undefined

        const searchParam = globalFilter?.trim() ? globalFilter : undefined

        dispatch(getAllSubCategoryAPI(undefined, searchParam, divisionParam, categoryParam))
    }, [dispatch, globalFilter, selectedDivision, selectedCategory])

    const subCategory = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)

    const subCategories = useMemo(() => {
        return subCategory?.subcategories
    }, [subCategory])

    const { DivisionArray } = useGetSubCategory({ selectedDivision, selectedCategory })

    const { page, pageSize, paginatedData, setPage, setPageSize, totalPages } = useLocalPaginateData({
        data: subCategories,
        globalFilter,
    })
    const categoryArray = useSubCategoryFilter({ selectedDivision })

    const handleDeleteClick = (id: any) => {
        setDeleteModal(true)
        setIdStoreForDelete(id)
    }
    const { deleteFromCatalog } = useDeleteFromCatalog({ idStoreForDelete, name: 'sub-category', setDeleteModal })
    const columns = useSubCategoryColumns({ handleDeleteClick })

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
                                onSelect={(selectedKey) => {
                                    setPage(1)
                                    setSelectedCategory('Select Category')
                                    setSelectedDivision(selectedKey)
                                }}
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
                    <div className="mb-4">
                        <div className="bg-gray-200 max-h-[140px] px-1 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border   text-black text-lg font-semibold "
                                title={selectedCategory}
                                onSelect={(selectedKey) => setSelectedCategory(selectedKey)}
                            >
                                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:max-h-[600px]  xl:overflow-y-scroll font-bold ">
                                    {categoryArray?.map((item, key) => (
                                        <DropdownItem key={key} eventKey={item} className="h-1">
                                            {item}
                                        </DropdownItem>
                                    ))}
                                </div>
                                <div
                                    className="flex mt-3 justify-center items-center rounded-lg cursor-pointer text-white bg-red-500 hover:bg-red-400"
                                    onClick={() => setSelectedCategory('Select Category')}
                                >
                                    Clear
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="flex items-end justify-end mb-4 order-first xl:order-1">
                    <button
                        className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                        onClick={() => navigate('/app/category/subCategory/addNew')}
                    >
                        ADD NEW SUB_CATEGORY
                    </button>{' '}
                    <br />
                    <br />
                </div>
            </div>
            <Table>
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
                                <Td key={col.accessor}>{col.format ? col.format(row[col.accessor]) : row[col.accessor]}</Td>
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

export default Subcategory
