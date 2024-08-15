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

type Product = {
    account_holder_name: string
    account_number: string
    address: string
    alternate_contact_number: string
    bank_name: string
    cin: string
    contact_number: string
    create_date: string
    damages_per_sku: number
    gstin: string
    handling_charges_per_order: number
    id: number
    ifsc: string
    is_active: boolean
    name: string
    poc: string
    poc_email: string
    registered_name: string
    removal_fee_per_sku: number
    revenue_share: number
    segment: string
    settlement_days: number
    update_date: string
    warehouse_charge_per_sku: number
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
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('') //1

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axiosInstance.get(
                `merchant/company?p=${page}&page_size=${pageSize}`,
            )
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize])

    // const getFirstImageUrl = (images: string) => {
    //     const img = images.split(',')
    //     return img[0]
    // }

    const handleActionClick = (id: number) => {
        // console.log('OK', id)
        navigate(`/app/sellers/${id}`)
    }

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'Account Holder Name',
                accessorKey: 'account_holder_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Account Number',
                accessorKey: 'account_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Address',
                accessorKey: 'address',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Alternate Contact Number',
                accessorKey: 'alternate_contact_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Bank Name',
                accessorKey: 'bank_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'CIN',
                accessorKey: 'cin',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Contact Number',
                accessorKey: 'contact_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                ),
            },
            {
                header: 'Damages Per SKU',
                accessorKey: 'damages_per_sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'GSTIN',
                accessorKey: 'gstin',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Handling Charges Per Order',
                accessorKey: 'handling_charges_per_order',
                cell: (info) => info.getValue(),
            },
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (info) => info.getValue(),
            },
            {
                header: 'IFSC',
                accessorKey: 'ifsc',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Is Active',
                accessorKey: 'is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC',
                accessorKey: 'poc',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC Email',
                accessorKey: 'poc_email',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Registered Name',
                accessorKey: 'registered_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Removal Fee Per SKU',
                accessorKey: 'removal_fee_per_sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Revenue Share',
                accessorKey: 'revenue_share',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Segment',
                accessorKey: 'segment',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Settlement Days',
                accessorKey: 'settlement_days',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                ),
            },
            {
                header: 'Warehouse Charge Per SKU',
                accessorKey: 'warehouse_charge_per_sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <Button onClick={() => handleActionClick(row.original.id)}>
                        EDIT
                    </Button>
                ),
            },
        ],
        [],
    )

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
    const navigate = useNavigate()

    const handleSeller = () => {
        navigate('/app/sellers/addnew')
    }

    return (
        <div>
            <div className="flex items-end justify-end mb-2">
                <button
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                    onClick={handleSeller}
                >
                    ADD NEW SELLER
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
        </div>
    )
}

export default Seller
