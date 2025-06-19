/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { useProductTypeColummns } from './productTypeUtils/useProductTypeColummns'
import { Dropdown } from '@/components/ui'
import { useSubCategoryFilter } from '../subCategory/subCategoryUtils/subCategoryFilter'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { useGetProductType } from './productTypeUtils/useGetProductTypes'
import { useDeleteFromCatalog } from '@/commonHooks/useDeleteFromCatalog'
import { Product_type_common_types } from './ProductTypeCommon'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import CatalogDeleteModal from '@/common/CatalogDeleteModal'
import { useLocalPaginateData } from '@/commonHooks/useLocalPaginateData'

const { Tr, Th, Td, THead, TBody } = Table

const ProductType = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<Product_type_common_types[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [idStoreForDelete, setIdStoreForDelete] = useState()
    const [selectedDivision, setSelectedDivision] = useState('Select Division')
    const [selectedCategory, setSelectedCategory] = useState('Select Category')
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const subCategories = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const [selectedSubCategory, setSelectedSubCategory] = useState('Select SubCategory')
    const DivisionArray = divisions?.divisions?.map((item) => item?.name)
    const categoryArray = useSubCategoryFilter({ selectedDivision })

    const filteredSubCategories = useMemo(() => {
        if (selectedCategory === 'Select Category') {
            return subCategories?.subcategories
        }

        return subCategories.subcategories.filter((item) => item.category_name === selectedCategory)
    }, [subCategories?.subcategories, selectedCategory])

    const subCategoriesArray = filteredSubCategories?.map((item) => item?.name)

    const productType = useGetProductType({ selectedDivision, selectedCategory, selectedSubCategory }) || []

    useEffect(() => {
        setData(productType.filter((item): item is Product_type_common_types => item !== undefined))
    }, [globalFilter, selectedDivision, selectedCategory, selectedSubCategory, divisions?.divisions])

    const { page, pageSize, paginatedData, setPage, setPageSize, totalPages } = useLocalPaginateData({
        data,
        globalFilter,
    })

    const handleDeleteClick = (id: any) => {
        setDeleteModal(true)
        setIdStoreForDelete(id)
    }

    const { deleteFromCatalog } = useDeleteFromCatalog({ idStoreForDelete, name: 'product-type', setDeleteModal })
    const columns = useProductTypeColummns({ handleDeleteClick })

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
                                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:max-h-[300px]  xl:overflow-y-scroll font-bold ">
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
                    <div className="mb-4">
                        <div className="bg-gray-200 max-h-[140px] px-1 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border   text-black text-lg font-semibold "
                                title={selectedSubCategory}
                                onSelect={(selectedKey) => setSelectedSubCategory(selectedKey)}
                            >
                                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide max-h-[400px]  xl:overflow-y-scroll font-bold ">
                                    {subCategoriesArray?.map((item, key) => (
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
                        onClick={() => navigate('/app/category/productType/addNew')}
                    >
                        ADD NEW PRODUCT_TYPE
                    </button>{' '}
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

export default ProductType
