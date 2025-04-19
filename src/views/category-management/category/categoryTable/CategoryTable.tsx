/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Modal } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'
import { categoryItem, Option, pageSizeOptions } from './categoryCommon'
import EasyTable from '@/common/EasyTable'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'

const DivisionArray = ['Men', 'Women', 'Fashion', 'Footwear', 'Beauty & Personal Care', 'Home Decor', 'Accessories', 'Travel and Handbags']

const CategoryTable = () => {
    const [data, setData] = useState<categoryItem[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [idStoreForDelete, setIdStoreForDelete] = useState()
    const [selectedDivision, setSelectedDivision] = useState('Select Division')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const filtervalue = globalFilter ? `&q=${globalFilter}` : ''
                const divisionFilter = selectedDivision !== 'Select Division' ? `&division=${selectedDivision}` : ''
                const response = await axiosInstance.get(`category?${filtervalue}${divisionFilter}`)
                const data = response.data.data
                setData(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [globalFilter, selectedDivision])

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize
        const end = start + pageSize
        return data.slice(start, end)
    }, [data, page, pageSize])

    const totalData = data.length

    const columns = useMemo<ColumnDef<categoryItem>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <Button className="bg-none border-none">
                        <a href={`/app/category/category/${row.original.id}`}>
                            {' '}
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </Button>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: (info) => <img src={info.getValue() as string} alt="product" width="50" />,
            },
            {
                header: 'Division',
                accessorKey: 'division',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Division Name',
                accessorKey: 'division_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Footer',
                accessorKey: 'footer',
                cell: (info) => {
                    return (
                        <div className="w-[200px] h-[70px] overflow-hidden">
                            <div
                                className="text-ellipsis whitespace-wrap line-clamp-3 overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: info.getValue() as string }}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Quick Filter Tags',
                accessorKey: 'quick_filter_tags',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Position',
                accessorKey: 'position',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Gender',
                accessorKey: 'gender',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Active',
                accessorKey: 'is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Try_&_Buy',
                accessorKey: 'is_try_and_buy',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Last Updated By',
                accessorKey: 'last_updated_by',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => handleDeleteClick(row.original.id)}>
                        <FaTrash className="text-xl text-red-600" />
                    </button>
                ),
            },
        ],
        [],
    )

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
        setPage(1)
    }

    const handleSectionHeading = (selectedKey: string) => {
        setSelectedDivision(selectedKey)
    }

    const handleSeller = () => {
        navigate('/app/category/category/add')
    }

    const handleDeleteClick = (id: any) => {
        setDeleteModal(true)
        setIdStoreForDelete(id)
    }

    const deleteUser = async () => {
        try {
            const body = {
                id: idStoreForDelete,
            }
            await axiosInstance.delete(`category`, {
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
                                onSelect={handleSectionHeading}
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
                        <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleSeller}>
                            ADD NEW CATEGORY
                        </button>{' '}
                    </div>
                </div>
            </div>
            <EasyTable mainData={paginatedData} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={onPaginationChange} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
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

export default CategoryTable
