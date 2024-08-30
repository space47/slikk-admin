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
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { Modal, notification } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'
import { FaEdit, FaTrash } from 'react-icons/fa'

interface User {
    first_name: string
    last_name: string
    email: string
    mobile: string
    country_code: string
    dob: string
    gender: string
    image: string
    date_joined: string
}

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const Seller = () => {
    const [data, setData] = useState<User[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [getMobilenumber, setGetMobileNumber] = useState('')

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>(
        (store) => store.company.currCompany,
    )

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axiosInstance.get(
                `company/${selectedCompany.id}/users`,
            )
            const data = response.data.data
            const total = response.data.data.length
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize, selectedCompany])

    const navigate = useNavigate()

    const handleActionClick = (mobile: string) => {
        navigate(`/app/vendor/users/${mobile}`)
    }

    const handleDeleteClick = async (mobile: string) => {
        setShowDeleteModal(true)
        setGetMobileNumber(mobile)
    }

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                header: 'Name',
                accessorFn: (row) => `${row.first_name} ${row.last_name}`,
                cell: (info) => info.getValue(),
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ getValue }) => (
                    <img
                        src={getValue() as string}
                        alt="User"
                        className="w-12 h-12 object-cover"
                    />
                ),
            },
            {
                header: 'Date Joined',
                accessorKey: 'date_joined',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                ),
            },
            // {
            //     header: 'Edit',
            //     accessorKey: 'mobile',
            //     cell: ({ row }) => (
            //         <button
            //             onClick={() => handleActionClick(row.original.mobile)}
            //             className="border-none bg-none"
            //         >
            //             <FaEdit className="text-xl" />
            //         </button>
            //     )
            // },
            // {
            //     header: 'Delete',
            //     accessorKey: '',
            //     cell: ({ row }) => (
            //         <button
            //             onClick={() => handleDeleteClick(row.original.mobile)}
            //             className="border-none bg-none"
            //         >
            //             <FaTrash className="text-xl text-red-500" />
            //         </button>
            //     )
            // }
        ],
        [],
    )

    const handleCloseModal = () => {
        setShowDeleteModal(false)
    }

    const deleteUser = async () => {
        const body = {
            company_id: selectedCompany.id,
            action: 'remove',
        }

        try {
            const response = await axiosInstance.patch(
                `company/user/${getMobilenumber}`,
                body,
            )
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message ||
                    'User has benn Successfully deleted',
            })
            navigate(0)
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Unable to delete',
            })
        }

        setShowDeleteModal(false)
    }

    const table = useReactTable({
        data,
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
        onGlobalFilterChange: setGlobalFilter,
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleUser = () => {
        navigate('/app/vendor/users/addNew')
    }

    return (
        <div>
            <div className="flex items-end justify-end mb-2">
                <button
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                    onClick={handleUser}
                >
                    ADD NEW USER
                </button>{' '}
                <br />
                <br />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search here"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalData}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find(
                            (option) => option.value === pageSize,
                        )}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>

            {showDeleteModal && (
                <Modal
                    title=""
                    open={showDeleteModal}
                    onOk={deleteUser}
                    onCancel={handleCloseModal}
                    okText="DELETE"
                    okButtonProps={{
                        style: { backgroundColor: 'red', borderColor: 'red' },
                    }}
                >
                    <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                        <IoWarningOutline className="text-red-600 text-4xl" />{' '}
                        ARE YOU SURE YOU WANT TO DELETE !!
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Seller
