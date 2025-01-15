/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { FaEdit, FaSync } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import { notification } from 'antd'
import { MdDelete } from 'react-icons/md'
import DialogConfirm from '@/common/DialogConfirm'

interface Brand {
    id: number
    name: string
    title: string
    description: string
    image: string
    is_top: boolean
    is_exclusive: boolean
    is_private: boolean
    footer: string | null
    quick_filter_tags: string[]
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    last_updated_by: string | null
}
interface Action {
    onClick: (id: number) => void
}

type Option = {
    value: number
    label: string
}

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const Brand = () => {
    const [data, setData] = useState<Brand[]>([])
    const [totalData, setTotalData] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [brandId, setBrandId] = useState<number>()
    const [showbrandDelete, setShowBrandDelete] = useState<boolean>(false)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const filtervalue = globalFilter ? `&q=${globalFilter}` : ''
            const response = await axiosInstance.get(`brands?dashboard=true&p=${page}&page_size=${pageSize}${filtervalue}`)
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

    const columns = useMemo<ColumnDef<Brand & Action>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <Button className="bg-none border-none">
                        <a href={`/app/category/brand/${row.original.id}`}>
                            {' '}
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </Button>
                ),
            },
            {
                header: 'Sync',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <Button className="bg-none border-none" onClick={() => handleSyncBrand(row?.original?.name)}>
                        <FaSync className="text-yellow-500 text-xl" />
                    </Button>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Logo',
                accessorKey: 'logo',
                cell: (info) => <img src={info.getValue() as string} alt="product" width="50" />,
            },
            {
                header: 'Top',
                accessorKey: 'is_top',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Exclusive',
                accessorKey: 'is_exclusive',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Private',
                accessorKey: 'is_private',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
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
                header: 'Try and Buy',
                accessorKey: 'is_try_and_buy',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Last Updated By',
                accessorKey: 'last_updated_by',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Delete',
                accessorKey: '',
                cell: ({ getValue, row }) => {
                    return (
                        <div>
                            <button onClick={() => handleDeleteBrand(row?.original?.id)}>
                                <MdDelete className="text-xl text-red-600" />
                            </button>
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const handleDeleteBrand = (id: number) => {
        setBrandId(id)
        setShowBrandDelete(true)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleSyncBrand = async (name: string) => {
        notification.info({
            message: 'SYNC IN PROCESS',
        })
        const body = {
            task_name: 'resize_product_images',
            brand: name,
        }

        try {
            const response = await axiosInstance.post(`/backend/task/create`, body)
            notification.success({
                message: response?.data?.message || 'SYNCED TO Brand',
            })
        } catch (error: any) {
            console.error(error)
            notification.success({
                message: error.response?.data?.message || 'FAILED TO SYNC Brand',
            })
        }
    }

    const handleDelete = async () => {
        const body = {
            remove_tags: true,
        }
        try {
            await axiosInstance.delete(`/brands/${brandId}`, {
                data: body,
            })
            notification.success({
                message: 'Successfully deleted the brand',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to Delete Brand',
            })
        } finally {
            setShowBrandDelete(false)
        }
    }

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search here"
                    value={globalFilter}
                    className="p-2 border rounded"
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>
            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(e) => setPage(e)} />
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
            {showbrandDelete && (
                <DialogConfirm IsDelete setIsOpen={setShowBrandDelete} IsOpen={showbrandDelete} onDialogOk={handleDelete} />
            )}
        </div>
    )
}

export default Brand
