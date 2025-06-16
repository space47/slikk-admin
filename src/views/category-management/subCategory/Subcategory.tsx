/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { Modal } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useSubCategoryColumns } from './subCategoryUtils/useSubCategoryColumns'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import { useSubCategoryFilter } from './subCategoryUtils/subCategoryFilter'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useAppSelector } from '@/store'
import { SINGLE_SUBCATEGORY_DATA } from '@/store/types/subcategory.types'

const { Tr, Th, Td, THead, TBody } = Table

const Subcategory = () => {
    const [data, setData] = useState<SINGLE_SUBCATEGORY_DATA[]>([])
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [idStoreForDelete, setIdStoreForDelete] = useState()
    const [selectedDivision, setSelectedDivision] = useState('Select Division')
    const [selectedCategory, setSelectedCategory] = useState('Select Category')

    const DivisionArray = divisions?.divisions?.map((item) => item?.name)

    useEffect(() => {
        let subCategories: any[] = []

        if (selectedDivision !== 'Select Division' && selectedCategory !== 'Select Category') {
            subCategories =
                divisions?.divisions
                    ?.find((division) => division?.name === selectedDivision)
                    ?.categories?.find((category) => category?.name === selectedCategory)?.sub_categories || []
        } else if (selectedDivision !== 'Select Division') {
            subCategories =
                divisions?.divisions
                    ?.find((division) => division?.name === selectedDivision)
                    ?.categories?.flatMap((category) => category?.sub_categories || []) || []
        } else if (selectedCategory !== 'Select Category') {
            subCategories =
                divisions?.divisions?.flatMap(
                    (division) => division?.categories?.find((category) => category?.name === selectedCategory)?.sub_categories || [],
                ) || []
        } else {
            subCategories =
                divisions?.divisions?.flatMap((division) => division?.categories?.flatMap((category) => category?.sub_categories || [])) ||
                []
        }

        setData(subCategories)
    }, [globalFilter, selectedDivision, selectedCategory, divisions?.divisions])

    const filteredData = data?.filter((item) =>
        Object.values(item).some((val) => (val ? val.toString().toLowerCase().includes(globalFilter.toLowerCase()) : false)),
    )

    const paginatedData = filteredData?.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.ceil(filteredData?.length / pageSize)

    const navigate = useNavigate()

    const categoryArray = useSubCategoryFilter({ selectedDivision })

    console.log('filtered categories', categoryArray)

    const handleSeller = () => {
        navigate('/app/category/subCategory/addNew')
    }

    const handleDeleteClick = (id: any) => {
        console.log('DELETE', id)
        setDeleteModal(true)
        setIdStoreForDelete(id)
    }

    const deleteUser = async () => {
        try {
            const body = {
                id: idStoreForDelete,
            }
            await axiosInstance.delete(`sub-category`, {
                data: body,
            })
            setDeleteModal(false)
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseModal = () => {
        setDeleteModal(false)
    }
    const columns = useSubCategoryColumns({ handleDeleteClick })

    return (
        <div>
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
                    <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleSeller}>
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
                    {paginatedData.map((row: any) => (
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
                <Modal
                    title=""
                    open={deleteModal}
                    okText="DELETE"
                    okButtonProps={{
                        style: { backgroundColor: 'red', borderColor: 'red' },
                    }}
                    onOk={deleteUser}
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

export default Subcategory
