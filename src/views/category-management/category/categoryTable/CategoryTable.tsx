import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    useGlobalFilter,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { MdEdit } from 'react-icons/md'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Modal } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'
import { categoryItem, Option, pageSizeOptions } from './categoryCommon'

const { Tr, Th, Td, THead, TBody } = Table

const CategoryTable = () => {
    const [data, setData] = useState<categoryItem[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [idStoreForDelete, setIdStoreForDelete] = useState()
    const navigate = useNavigate()

    const fetchData = async (filter: string = '') => {
        try {
            const filtervalue = globalFilter ? `&q=${globalFilter}` : ''
            const response = await axiosInstance.get(`category?${filtervalue}`)
            const data = response.data.data
            setData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(globalFilter)
    }, [globalFilter])
    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize
        const end = start + pageSize
        return data.slice(start, end)
    }, [data, page, pageSize])

    const totalData = data.length

    const handleActionClick = (id: number) => {
        navigate(`/app/category/category/${id}`)
    }

    const columns = useMemo<ColumnDef<categoryItem>[]>(
        () => [
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
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <Button onClick={() => handleActionClick(row.original.id)} className="bg-none border-none">
                        <FaEdit className="text-xl text-blue-600" />
                    </Button>
                ),
            },
            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ getValue, row }) => (
                    <button onClick={() => handleDeleteClick(row.original.id)} className="border-none bg-none">
                        <FaTrash className="text-xl text-red-600" />
                    </button>
                ),
            },
        ],
        [],
    )

    const table = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(totalData / pageSize),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
            globalFilter,
        },
        onPaginationChange: ({ pageIndex, pageSize }) => {
            setPage(pageIndex + 1)
            setPageSize(pageSize)
        },
        // onGlobalFilterChange: setGlobalFilter,
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
        setPage(1)
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
            const response = await axiosInstance.delete(`category`, {
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
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                <div className="flex items-end justify-end mb-4 order-first xl:order-1">
                    <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleSeller}>
                        ADD NEW CATEGORY
                    </button>{' '}
                </div>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
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
                    onOk={deleteUser}
                    onCancel={handleCloseModal}
                    okText="DELETE"
                    okButtonProps={{
                        style: { backgroundColor: 'red', borderColor: 'red' },
                    }}
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
