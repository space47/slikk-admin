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
import { STORETABLE } from './commonStores'
import { FaEdit } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'

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

const Stores = () => {
    const [data, setData] = useState<STORETABLE[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('') //1
    const [accessDenied, setAccessDenied] = useState(false)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axiosInstance.get(`merchant/store?p=${page}&page_size=${pageSize}`)
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
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
        navigate(`/app/stores/${id}`)
    }

    const columns = useMemo<ColumnDef<STORETABLE>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button onClick={() => handleActionClick(row.original.id)} className="border-none bg-none">
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'CODE',
                accessorKey: 'code',
                cell: (info) => info.getValue(),
            },
            {
                header: 'IMAGE',
                accessorKey: 'image',
                cell: (info) => <img src={info.getValue() as string} alt="" />,
            },
            {
                header: 'Fullfillment Center',
                accessorKey: 'is_fulfillment_center',
                cell: (info) => (info.getValue() ? 'YES' : 'NO'),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Area',
                accessorKey: 'area',
                cell: (info) => info.getValue(),
            },
            {
                header: 'City',
                accessorKey: 'city',
                cell: (info) => info.getValue(),
            },
            {
                header: 'State',
                accessorKey: 'state',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Pincode',
                accessorKey: 'pincode',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Rating',
                accessorKey: 'rating',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Latitude',
                accessorKey: 'latitude',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Longitude',
                accessorKey: 'longitude',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Contact Number',
                accessorKey: 'contactNumber',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Alternate Contact Number',
                accessorKey: 'alternate_contact_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC',
                accessorKey: 'poc',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC Designation',
                accessorKey: 'poc_designation',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return Area',
                accessorKey: 'return_area',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return City',
                accessorKey: 'return_city',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return State',
                accessorKey: 'return_state',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return Pincode',
                accessorKey: 'return_pincode',
                cell: (info) => info.getValue(),
            },
            {
                header: 'GSTIN',
                accessorKey: 'gstin',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Instruction',
                accessorKey: 'instruction',
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
                header: 'Location URL',
                accessorKey: 'location_url',
                cell: (info) => (
                    <a href={info.getValue() as string} target="_blank" rel="noopener noreferrer">
                        Location
                    </a>
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

    const handleStore = () => {
        navigate('/app/stores/addNew')
    }

    if (accessDenied) {
        return <AccessDenied />
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
                <div className="flex items-end justify-end mb-4 order-first xl:order-none">
                    <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleStore}>
                        ADD NEW STORE
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

export default Stores
