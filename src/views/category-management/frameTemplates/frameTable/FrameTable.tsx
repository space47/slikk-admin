import EasyTable from '@/common/EasyTable'
import { Button } from '@/components/ui'
import { frameService } from '@/store/services/frameTemplatesService'
import { FrameTemplate } from '@/store/types/frameTemplateType'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { ColumnDef } from '@tanstack/react-table'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { PiFrameCornersBold } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

const FrameTable = () => {
    const [frameData, setFrameData] = useState<FrameTemplate[]>([])
    const frameCall = frameService.useFrameListQuery({})
    const navigate = useNavigate()

    useEffect(() => {
        if (frameCall.isSuccess && frameCall.data) {
            setFrameData(frameCall.data)
        }
    }, [frameCall.isSuccess, frameCall.data])

    const handleDelete = useCallback(async (id?: string | number) => {
        if (!id) return
        try {
            const res = await axioisInstance.delete(`frame-style-templates/${id}`)
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }, [])

    const columns = useMemo<ColumnDef<FrameTemplate>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <FaEdit
                            className="cursor-pointer text-blue-500 hover:text-blue-700"
                            onClick={() => navigate(`/app/category/frameTemplates/edit/${row.original?.id}`)}
                        />
                    </div>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => row.original?.name || '-',
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: ({ row }) => row.original?.description || '-',
            },
            {
                header: 'Active',
                accessorKey: 'is_active',
                cell: ({ row }) => (row.original?.is_active ? 'Yes' : 'No'),
            },
            {
                header: 'Created At',
                accessorKey: 'create_date',
                cell: ({ row }) => {
                    const date = row.original?.create_date
                    return date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '-'
                },
            },
            {
                header: 'Delete', // ✅ fixed duplicate header
                accessorKey: 'id',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <FaTrash
                            className="cursor-pointer text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(row.original?.id)}
                        />
                    </div>
                ),
            },
        ],
        [navigate, handleDelete], // ✅ IMPORTANT
    )

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <PiFrameCornersBold className="text-2xl text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">Frame Templates</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-md">Manage and create templates</p>
                    </div>
                </div>
            </div>

            {/* Add Button */}
            <div className="mb-4 flex justify-end">
                <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate(`/category/frameTemplates/add`)}>
                    Add New Frame
                </Button>
            </div>

            {/* Table */}
            {frameCall.isLoading || frameCall.isFetching ? (
                <div className="text-gray-500">Loading...</div>
            ) : (
                <div className="p-3 shadow-lg ">
                    <EasyTable noPage overflow mainData={frameData} columns={columns} />
                </div>
            )}
        </div>
    )
}

export default FrameTable
