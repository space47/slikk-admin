/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FaDownload } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'

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

const PaginationTable = () => {
    const [data, setData] = useState<TableData[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState<string>('')

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axioisInstance.get(`bulkupload/history?type=catalogue&p=${page}&page_size=${pageSize}`)
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

    const handleActionClick = async (failure: number, error_file: string, uploaded_file: string) => {
        try {
            const requiredFile = failure === 0 ? uploaded_file : error_file
            const response = await axioisInstance.get(`file/presign?file_url=${encodeURIComponent(requiredFile)}`)
            console.log('sss', response)
            const preSignedUrl = response.data.data
            await fetch(preSignedUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${requiredFile}.csv`

                    document.body.appendChild(a)

                    a.click()

                    document.body.removeChild(a)

                    URL.revokeObjectURL(url)
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error)
        }
    }

    const handleDownloadOriginalFile = async (failure: number, error_file: string, uploaded_file: string) => {
        try {
            const requiredFile = uploaded_file
            const response = await axioisInstance.get(`file/presign?file_url=${encodeURIComponent(requiredFile)}`)
            console.log('sss', response)
            const preSignedUrl = response.data.data
            await fetch(preSignedUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${requiredFile}.csv`

                    document.body.appendChild(a)

                    a.click()

                    document.body.removeChild(a)

                    URL.revokeObjectURL(url)
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error)
        }
    }

    const columns = useMemo<ColumnDef<TableData>[]>(
        () => [
            {
                header: 'Upload Date',
                accessorKey: 'create_date',
                cell: (info) => info.getValue(),
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
                header: 'Updated By',
                accessorKey: 'user',
                cell: ({ row }) => <span>{row?.original?.user?.name}</span>,
            },
            {
                header: 'Updated By Number',
                accessorKey: 'user',
                cell: ({ row }) => <span>{row?.original?.user?.mobile}</span>,
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
                                onClick={() => handleActionClick(row.original.failure, row.original.error_file, row.original.uploaded_file)}
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
                header: 'Success File Download ',
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
                        return 'No Errors'
                    }
                },
            },
        ],
        [],
    )

    return (
        <div>
            <div className="mb-8">
                <input
                    placeholder="Search here..."
                    value={globalFilter || ''}
                    className="p-2 border rounded-md"
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <EasyTable overflow columns={columns} mainData={data} page={page} pageSize={pageSize} />
            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
        </div>
    )
}

export default PaginationTable
