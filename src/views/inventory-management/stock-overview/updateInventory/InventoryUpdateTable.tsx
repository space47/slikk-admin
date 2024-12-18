/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import moment from 'moment'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FaDownload } from 'react-icons/fa'
import { TableData, pageSizeOptions, Option } from './updateCommon'
import { Table } from '@/components/ui'
import { rankItem } from '@tanstack/match-sorter-utils'

const { Tr, Th, Td, THead, TBody } = Table

const UpdateInventoryTable = () => {
    const [data, setData] = useState<TableData[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState<string>('')

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axioisInstance.get(`bulkupload/history?type=inventory&p=${page}&page_size=${pageSize}`)
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
    }, [page, pageSize, globalFilter])

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

    const handleDownload = async (failure: number, error_file: string, uploaded_file: string) => {
        console.log(`Action clicked `, error_file, 'UPLOAD', uploaded_file, 'FAIL', failure)

        try {
            const requiredUrl = failure === 0 ? uploaded_file : error_file

            const response = await axioisInstance.get(`file/presign?file_url=${requiredUrl}`)

            const preSignedUrl = response.data.data
            const data = await fetch(preSignedUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${requiredUrl.split('_').slice(0, 2).join('')}.csv`

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

    const handleDownloadOriginalFile = async (failure: number, error_file: string, uploaded_file: string) => {
        try {
            const requiredUrl = uploaded_file

            const response = await axioisInstance.get(`file/presign?file_url=${requiredUrl}`)

            const preSignedUrl = response.data.data
            const data = await fetch(preSignedUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${requiredUrl.split('_').slice(10, 15).join('')}.csv`

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
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD hh:mm:ss a')}</span>,
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
                header: 'Error File Download',
                accessorKey: '',
                cell: ({ row }) => {
                    const failureFile = row.original.failure
                    if (failureFile) {
                        return (
                            <Button
                                onClick={() => handleDownload(row.original.failure, row.original.error_file, row.original.uploaded_file)}
                                variant="reject"
                                size="sm"
                            >
                                <FaDownload className="text-xl" />
                            </Button>
                        )
                    }
                },
            },
            {
                header: 'Success FIle Download',
                accessorKey: '',
                cell: ({ row }) => {
                    const errorFile = row.original.uploaded_file
                    if (errorFile) {
                        return (
                            <Button
                                onClick={() =>
                                    handleDownloadOriginalFile(row.original.failure, row.original.error_file, row.original.uploaded_file)
                                }
                                variant="accept"
                                size="sm"
                            >
                                <FaDownload className="text-xl" />
                            </Button>
                        )
                    } else {
                        return ''
                    }
                },
            },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            globalFilter,
            pagination: { pageIndex: page - 1, pageSize },
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalData / pageSize),
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    return (
        <div>
            <div className="mb-8">
                <input
                    placeholder="Search here..."
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 border rounded-md"
                />
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

export default UpdateInventoryTable

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
