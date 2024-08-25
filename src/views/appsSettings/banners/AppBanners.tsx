/* eslint-disable @typescript-eslint/no-explicit-any */
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
    useGlobalFilter
} from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

import { BANNERMODEL } from './BannerCommon'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Modal, notification } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' }
]

const AppBanners = () => {
    const [data, setData] = useState<BANNERMODEL[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [bannerid, setBannerid] = useState<number>()

    const navigate = useNavigate()

    const fetchData = async (
        page: number,
        pageSize: number,
        filter: string
    ) => {
        try {
            const response = await axiosInstance.get(
                `/banners?p=${page}&page_size=${pageSize}&filter=${filter}`
            )
            const data = response.data.data.results

            const total = response.data.data.count
            setData(data)
            setTotalData(total)

            const count = response.data.data.count
            setData(data)
            setTotalData(count)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize, globalFilter)
    }, [page, pageSize, globalFilter])

    const columns = useMemo(
        () => [
            { header: 'ID', accessorKey: 'id' },
            { header: 'Name', accessorKey: 'name' },
            { header: 'Section Heading', accessorKey: 'section_heading' },
            { header: 'Parent Banner', accessorKey: 'parent_banner' },
            {
                header: 'Quick Filter Tags',
                accessorKey: 'quick_filter_tags',
                cell: (info: any) => info.getValue().join(', ')
            },
            {
                header: 'Brand Name',
                accessorKey: 'brand.name',
                cell: (info: any) =>
                    info.row.original.brand.map((item: any, key: number) => (
                        <div key={key}>{item.name}</div>
                    ))
            },
            {
                header: 'DIVISION Name',
                accessorKey: 'division.name',
                cell: (info: any) =>
                    info.row.original.division.map((item: any, key: number) => (
                        <div key={key}>{item.name}</div>
                    ))
            },

            {
                header: 'Category Name',
                accessorKey: 'category.name',
                cell: (info) =>
                    info.row.original.category.map((item: any, key: number) => (
                        <div key={key}>{item.name}</div>
                    ))
            },

            {
                header: 'Sub Category Name',
                accessorKey: 'sub_category',
                cell: (info: any) =>
                    info.row.original.sub_category.map(
                        (item: any, key: number) => (
                            <div key={key}>{item.name}</div>
                        )
                    )
            },
            {
                header: 'Product Type Name',
                accessorKey: 'product_type',
                cell: (info: any) =>
                    info.row.original.product_type.map(
                        (item: any, key: number) => (
                            <div key={key}>{item.name}</div>
                        )
                    )
            },
            {
                header: 'Image (WEB)',
                accessorKey: 'image_web',
                cell: (info) =>
                    info.getValue() ? (
                        <img
                            src={info.getValue().split(',')[0]}
                            alt=""
                            className=" object-contain w-[100px] h-[100xp] "
                        />
                    ) : (
                        ''
                    )
            },
            {
                header: 'Image (Mobile)',
                accessorKey: 'image_mobile',
                cell: (info) =>
                    info.getValue() ? (
                        <img
                            src={info.getValue().split(',')[0]}
                            alt=""
                            className=" object-contain w-[100px]  "
                        />
                    ) : (
                        ''
                    )
            },

            { header: 'Offers', accessorKey: 'offers' },
            { header: 'Offer ID', accessorKey: 'offer_id' },
            { header: 'Page', accessorKey: 'page' },
            {
                header: 'From Date',
                accessorKey: 'from_date',
                cell: ({ getValue }) => (
                    <span>{moment(getValue()).format('YYYY-MM-DD')}</span>
                )
            },
            {
                header: 'To Date',
                accessorKey: 'to_date',
                cell: ({ getValue }) => (
                    <span>{moment(getValue()).format('YYYY-MM-DD')}</span>
                )
            },
            { header: 'Upto Off', accessorKey: 'uptoff' },
            {
                header: 'Tags',
                accessorKey: 'tags',
                cell: (info: any) => info.getValue().join(', ')
            },
            { header: 'Footer', accessorKey: 'footer' },
            { header: 'Coupon Code', accessorKey: 'coupon_code' },
            { header: 'Is Clickable', accessorKey: 'is_clickable' },
            {
                header: 'Section Background Web',
                accessorKey: 'section_background_web',
                cell: ({ getValue }) => {
                    const imageUrl = getValue() as string
                    console.log('SECTION URL:', imageUrl)

                    return (
                        <img
                            src={imageUrl}
                            alt="Image"
                            style={{ width: '100px', height: 'auto' }}
                        />
                    )
                }
            },
            {
                header: 'Section Background Mobile',
                accessorKey: 'section_background_mobile',
                cell: ({ getValue }) => (
                    <a href={getValue()}>
                        <img src={getValue()} alt="" />
                    </a>
                )
            },
            { header: 'Max Price', accessorKey: 'max_price' },
            { header: 'Min Price', accessorKey: 'min_price' },
            { header: 'Barcodes', accessorKey: 'barcodes' },
            {
                header: 'Redirection URL',
                accessorKey: 'redirection_url',
                cell: ({ row }) => (
                    <div className="w-[180px] text-overflow:ellipsis">
                        <a href={row.original.redirection_url}>
                            {' '}
                            {row.original.redirection_url}
                        </a>
                    </div>
                )
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button
                        onClick={() => handleActionClick(row.original.id)}
                        className="border-none bg-none"
                    >
                        <FaEdit className="text-xl" />
                    </button>
                )
            },
            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button
                        onClick={() => handleDeleteClick(row.original.id)}
                        className="border-none bg-none"
                    >
                        <FaTrash className="text-xl text-red-500" />
                    </button>
                )
            }
        ],
        []
    )

    const handleActionClick = (id: number) => {
        navigate(`/app/appSettings/banners/${id}`)
    }

    const handleDeleteClick = (id: number) => {
        setShowDeleteModal(true)
        setBannerid(id)
    }

    const handleCloseModal = () => {
        setShowDeleteModal(false)
    }

    console.log('Bannner Id', bannerid)

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
                pageSize: pageSize
            },
            globalFilter
        },
        onPaginationChange: ({ pageIndex, pageSize }) => {
            setPage(pageIndex + 1)
            setPageSize(pageSize)
        },
        onGlobalFilterChange: setGlobalFilter
    })

    // const onPaginationChange = (page: number) => {
    //     setPage(page)
    // }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleBanner = () => {
        navigate('/app/appSettings/banners/addNew')
    }

    const deleteBanner = async () => {
        const formData = {
            banner_id: bannerid
        }
        console.log('data', formData)
        try {
            const response = await axiosInstance.delete(`/banners`, {
                data: formData
            })
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message ||
                    'User has benn Successfully deleted'
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Unable to delete'
            })
        }

        setShowDeleteModal(false)
    }

    return (
        <div>
            <div className="flex justify-between mb-2">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                <div className="flex gap-3 items-center justify-center">
                    <div className="flex items-end justify-end mb-2">
                        <button
                            className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                            onClick={handleBanner}
                        >
                            ADD NEW BANNER
                        </button>
                    </div>
                </div>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
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
                                        cell.getContext()
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
                    onChange={(page) => setPage(page)}
                />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find(
                            (option) => option.value === pageSize
                        )}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
            {showDeleteModal && (
                <Modal
                    title=""
                    open={showDeleteModal}
                    onOk={deleteBanner}
                    onCancel={handleCloseModal}
                    okText="DELETE"
                    okButtonProps={{
                        style: { backgroundColor: 'red', borderColor: 'red' }
                    }}
                >
                    <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                        <IoWarningOutline className="text-red-600 text-4xl" />{' '}
                        ARE YOU SURE YOU WANT TO DELETE THE BANNER Id:{' '}
                        {bannerid} !!
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default AppBanners
