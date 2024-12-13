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
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

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
                header: 'Description',
                accessorKey: 'description',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
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
                header: 'Footer',
                accessorKey: 'footer',
                cell: (info) => {
                    console.log('ValueData', info.getValue())
                    return (
                        <div className="w-[200px] h-[70px] overflow-hidden">
                            <div
                                className="text-ellipsis whitespace-wrap line-clamp-3 overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: info.getValue() as string }}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Quick Filter Tags',
                accessorKey: 'quick_filter_tags',
                cell: (info) => info.getValue() as string[],
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
        ],
        [],
    )

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
        </div>
    )
}

export default Brand
