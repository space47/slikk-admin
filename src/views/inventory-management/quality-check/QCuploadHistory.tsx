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
// import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { SaveAs } from '@mui/icons-material'

type User = {
    name: string
    email: string
    mobile: string
}

type TableData = {
    comments: string
    company: number
    create_date: string
    error_file: string
    failure: number
    id: number
    success: number
    upload_type: string
    uploaded_file: string
    user: User
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
            const response = await axioisInstance.get(
                `bulkupload/history?type=quality_check&p=${page}&page_size=${pageSize}`,
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

    const getUploadStatus = (failure: number) => {
        if (failure == 0) {
            return 'success'
        } else {
            return 'failure'
        }
    }
    const extractFileName = (uploadedFile: any) => {
        const parts = uploadedFile.split('/')
        return parts[parts.length - 1]
    }
    const extractErrorName = (uploadedFile: any) => {
        const parts = uploadedFile.split('/')
        return parts[parts.length - 1]
    }

    const handleDownload = async (
        failure: number,
        error_file: string,
        uploaded_file: string,
    ) => {
        console.log(`Action clicked `, error_file, uploaded_file, failure)

        try {
            const requiredUrl = failure === 0 ? uploaded_file : error_file

            const response = await axioisInstance.get(
                `file/presign?file_url=${requiredUrl}`,
                { responseType: 'blob' },
            )

            const preSignedUrl = response.data.data
            const data = await fetch(preSignedUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${requiredUrl}.csv`

                    document.body.appendChild(a)

                    a.click()

                    document.body.removeChild(a)

                    URL.revokeObjectURL(url)
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error)
            return 'Error'
        }
    }

    const columns = useMemo<ColumnDef<TableData>[]>(
        () => [
            {
                header: 'Upload Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                ),
            },
            {
                header: 'File name',
                accessorKey: 'uploaded_file',
                cell: (info) => extractFileName(info.getValue()),
            },
            {
                header: 'Batch Id',
                accessorKey: 'id',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Upload Status',
                accessorKey: 'failure',
                cell: (info) => {
                    const failure = info.getValue() as number
                    return getUploadStatus(failure)
                },
            },
            {
                header: '#Uploaded',
                accessorKey: 'success',
                cell: (info) => info.getValue(),
            },
            {
                header: '#Rejected',
                accessorKey: 'failure',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Error File',
                accessorKey: 'error_file',
                cell: (info) => extractErrorName(info.getValue()),
            },
            {
                header: 'Action',
                accessorKey: '',
                cell: ({ row }) => (
                    <Button
                        onClick={() =>
                            handleDownload(
                                row.original.failure,
                                row.original.error_file,
                                row.original.uploaded_file,
                            )
                        }
                    >
                        DOWNLOAD
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

    return (
        <div>
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
