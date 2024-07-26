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

type TableData = {
    id: number
    company: number
    create_date: string
    document: string
    document_date: string
    document_number: string
    images: string[]
    last_updated_by: {
        name: string
        mobile: string
    }
    received_address: string
    received_by: {
        name: string
        mobile: string
    }
    slikk_owned: boolean
    store: number
    total_quantity: number
    total_sku: number
    update_date: string
    action: React.ReactNode
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

const PaginationTable = () => {
    const [data, setData] = useState<TableData[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axiosInstance.get(
                `goods/received?p=${page}&page_size=${pageSize}`,
            )
            const data = response.data.data.results // Adjusted for your API response
            const total = response.data.data.count // Adjusted for your API response
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize])

    const getowner = (own: any) => {
        if (own === true) {
            return 'Yes'
        } else {
            return 'No'
        }
    }
    // const extractFileName = (uploadedFile: any) => {
    //     const parts = uploadedFile.split('/')
    //     return parts[parts.length - 1]
    // }
    // const extractErrorName = (uploadedFile: any) => {
    //     const parts = uploadedFile.split('/')
    //     return parts[parts.length - 1]
    // }
    const handleGRNClick = (document_number: any, company: any) => {
        console.log('done', document_number)

        navigate(`/app/goods/received/${company}/${document_number}`)
    }

    const columns = useMemo<ColumnDef<TableData>[]>(
        () => [
            {
                header: 'GRN Number',
                accessorKey: 'document_number', // Ensure this key matches your data structure
                cell: ({ row }) => (
                    <div
                        onClick={() =>
                            handleGRNClick(
                                row.original.document_number,
                                row.original.company,
                            )
                        }
                        className="cursor-pointer bg-gray-200 px-2 py-3 rounded-md text-black font-semibold"
                    >
                        {row.original.document_number}
                    </div>
                ),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Document url',
                accessorKey: 'document',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Document Date',
                accessorKey: 'document_date',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Images',
                accessorKey: 'images',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Received At',
                accessorKey: 'received_address',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Received By',
                accessorKey: 'received_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Slikk Owned',
                accessorKey: 'slikk_owned',
                cell: (info) => getowner(info.getValue()),
            },
            {
                header: 'Total QTY',
                accessorKey: 'total_quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Total SKU',
                accessorKey: ' total_sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Updated On',
                accessorKey: 'update_date',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Action',
                accessorKey: 'action',
                cell: ({ row }) => (
                    <Button onClick={() => handleActionClick(row.original.id)}>
                        DOWNLOAD
                    </Button>
                ),
            },
        ],
        [],
    )

    const handleActionClick = (batchId: number) => {
        // Implement action click handler
        console.log(`Action clicked for batchId: ${batchId}`)
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(totalData / pageSize), // Ensure page count is updated
        manualPagination: true, // Enable manual pagination
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
        },
        onPaginationChange: ({ pageIndex, pageSize }) => {
            setPage(pageIndex + 1) // React Table uses zero-based index
            setPageSize(pageSize)
        },
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const navigate = useNavigate()

    const handleGRN = () => {
        navigate('/app/goods/received/form')
    }

    return (
        <div>
            <div className="flex items-end justify-end mb-5">
                <button
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                    onClick={handleGRN}
                >
                    ADD NEW GRN
                </button>{' '}
                <br />
                <br />
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

export default PaginationTable
