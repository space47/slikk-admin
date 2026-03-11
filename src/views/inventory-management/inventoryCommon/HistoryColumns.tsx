/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaDownload } from 'react-icons/fa'

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { IndentHistoryData } from '../indent/indentUtils/indent.types'

export const HistoryColumns = () => {
    const extractFileName = (uploadedFile: any) => {
        const parts = uploadedFile.split('/')
        return parts[parts.length - 1]
    }

    const getUploadStatus = (failure: number) => {
        if (failure == 0) {
            return 'success'
        } else {
            return 'failure'
        }
    }

    const handleDownloadFailure = async (failure: number, errorFile: string, uploadedFile: string) => {
        try {
            const requiredUrl = failure === 0 ? uploadedFile : errorFile
            const response = await axioisInstance.get(`file/presign?file_url=${encodeURIComponent(requiredUrl)}`)
            const preSignedUrl = response.data.data
            await fetch(preSignedUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const reader = new FileReader()

                    reader.onload = () => {
                        const utf8Blob = new Blob([reader.result as string], { type: 'text/csv;charset=utf-8;' })

                        const url = URL.createObjectURL(utf8Blob)

                        const a = document.createElement('a')
                        a.href = url
                        a.download = `Fail-${moment().format('YYYY-MM-DD HH-mm-ss a')}`

                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)

                        URL.revokeObjectURL(url)
                    }

                    reader.readAsText(blob, 'utf-8')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error)
            return 'Error'
        }
    }

    const handleDownloadOriginalFile = async (failure: number, errorFile: string, uploadedFile: string) => {
        console.log(`Action clicked `, errorFile, 'UPLOAD', uploadedFile, 'FAIL', failure)
        try {
            const requiredUrl = uploadedFile
            const response = await axioisInstance.get(`file/presign?file_url=${encodeURIComponent(requiredUrl)}`)
            const preSignedUrl = response.data.data
            await fetch(preSignedUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const reader = new FileReader()
                    reader.onload = () => {
                        const utf8Blob = new Blob([reader.result as string], { type: 'text/csv;charset=utf-8;' })
                        const url = URL.createObjectURL(utf8Blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `Pass-${moment().format('YYYY-MM-DD HH-mm-ss a')}`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                    }

                    reader.readAsText(blob, 'utf-8')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error)
            return 'Error'
        }
    }

    return useMemo<ColumnDef<IndentHistoryData>[]>(
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
                cell: (info) => extractFileName(info.getValue()),
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
                header: 'Error File Download',
                accessorKey: '',
                cell: ({ row }) => {
                    const failureFile = row.original.failure
                    if (failureFile) {
                        return (
                            <Button
                                onClick={() =>
                                    handleDownloadFailure(row.original.failure, row.original.error_file, row.original.uploaded_file)
                                }
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
}
