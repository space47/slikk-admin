import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    useGlobalFilter,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import { date } from 'yup'

interface OrderDetails {
    barcode: string
    brand: string
    category: string
    color: null | string
    division: string
    final_price: string
    fulfilled_quantity: string
    id: number
    image: string
    is_returnable: boolean
    mrp: string
    name: string
    order_item_rating: null | number
    product_type: string
    quantity: string
    returnable_quantity: number
    size: string
    sku: string
    sp: string
    sub_category: string
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

const BrandOrder = () => {
    const [data, setData] = useState<OrderDetails[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>(
        (store) => store.company.currCompany,
    )
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))

    const fetchData = async (
        page: number,
        pageSize: number,
        from: string,
        to: string,
    ) => {
        try {
            const response = await axiosInstance.get(
                `merchant/order_items?company_id=${selectedCompany.id}&from=${from}&to=${to}`,
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
        fetchData(page, pageSize, from, to)
    }, [page, pageSize, selectedCompany, from, to])

    const columns = useMemo<ColumnDef<OrderDetails>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: (info) => {
                    const imageUrl = (info.getValue() as string).split(',')[0]
                    return (
                        <img
                            src={imageUrl}
                            alt="Product Image"
                            width={50}
                            height={50}
                        />
                    )
                },
            },
            {
                header: 'MRP',
                accessorKey: 'mrp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SP',
                accessorKey: 'sp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Fulfilled Quantity',
                accessorKey: 'fulfilled_quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Size',
                accessorKey: 'size',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Color',
                accessorKey: 'color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Division',
                accessorKey: 'division',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Sub Category',
                accessorKey: 'sub_category',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Product Type',
                accessorKey: 'product_type',
                cell: (info) => info.getValue(),
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
    const handleFromChange = (date: Date | null) => {
        if (date) {
            setFrom(moment(date).format('YYYY-MM-DD'))
        } else {
            setFrom(moment().format('YYYY-MM-DD'))
        }
    }

    const handleToChange = (date: Date | null) => {
        if (date) {
            setTo(moment(date).format('YYYY-MM-DD'))
        } else {
            setTo(moment().format('YYYY-MM-DD'))
        }
    }

    const addOneDay = (date: string) => {
        return moment(date).add(1, 'days').format('YYYY-MM-DD')
    }

    return (
        <div className="overflow-x-auto">
            <div className="upper flex justify-between mb-5 items-center ">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>

                <div className="flex gap-5">
                    <div>
                        <div className="mb-1 font-semibold text-sm">
                            FROM DATE:
                        </div>
                        <DatePicker
                            inputPrefix={
                                <HiOutlineCalendar className="text-lg" />
                            }
                            defaultValue={new Date()}
                            value={new Date(from)}
                            selected={moment(from).toDate()}
                            onChange={handleFromChange}
                        />
                    </div>
                    <div>
                        <div className="mb-1 font-semibold text-sm">
                            TO DATE:
                        </div>
                        <DatePicker
                            inputSuffix={
                                <TbCalendarStats className="text-xl" />
                            }
                            defaultValue={new Date()}
                            value={new Date(to)}
                            selected={moment(to).toDate()}
                            onChange={handleToChange}
                            minDate={moment(from).toDate()}
                        />
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

export default BrandOrder
