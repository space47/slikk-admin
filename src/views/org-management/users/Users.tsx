import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { FaEdit } from 'react-icons/fa'

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
    const [totalData, setTotalData] = useState()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axiosInstance.get(`company/${selectedCompany.id}/users`)
            const data = response.data.data
            const total = response.data.data.length
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    console.log('ssdsds', totalData)

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize, selectedCompany.id])
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize)

    const navigate = useNavigate()

    const handleActionClick = (mobile: string) => {
        navigate(`/app/users/edit/${mobile}`)
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
                cell: ({ getValue }) => <img src={getValue() as string} alt="User" className="w-12 h-12 object-cover" />,
            },
            {
                header: 'Date Joined',
                accessorKey: 'date_joined',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button onClick={() => handleActionClick(row.original.mobile)} className="border-none bg-none">
                        <FaEdit className="text-xl" />
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
        pageCount: Math.ceil(totalData ?? 0 / pageSize),
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

    const handleSeller = () => {
        navigate('/app/users/addNew')
    }

    return (
        <div>
            <div className="flex justify-between">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                <div className="flex items-end justify-end mb-4">
                    <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleSeller}>
                        ADD NEW USERS
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
        </div>
    )
}

export default Seller
