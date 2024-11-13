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
import { FaDownload } from 'react-icons/fa'
import { Spinner } from '@/components/ui'
import { IoMdDownload } from 'react-icons/io'
import UltimateDatePicker from '@/common/UltimateDateFilter'

interface Product {
    name: string
    sku: string
    brand: string
    mrp: number
    sp: number
}

interface OrderItem {
    create_date: string
    order_item: number
    product: Product
    quantity: string
    return_amount: string
    return_reason: string
    from: string
    to: string
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

const BrandReturns = () => {
    const [data, setData] = useState<OrderItem[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('YYYY-MM-DD'))
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [showSpinner, setShowSpinner] = useState(false)

    const fetchData = async (page: number, pageSize: number, from: string, to: string) => {
        try {
            // setShowSpinner(true)
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(
                `merchant/return_order_items?company_id=${selectedCompany.id}&brand=true&from=${from}&to=${To_Date}`,
            )
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
            setShowSpinner(false)
        } catch (error) {
            console.error(error)
            setShowSpinner(false)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize, from, to)
    }, [page, pageSize, selectedCompany, from, to])

    const columns = useMemo<ColumnDef<OrderItem>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'product.sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Name',
                accessorKey: 'product.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Brand',
                accessorKey: 'product.brand',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Size',
                accessorKey: 'value.size',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Color',
                accessorKey: 'value.color',
                cell: (info) => info.getValue(),
            },

            {
                header: 'MRP',
                accessorKey: 'product.mrp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SP',
                accessorKey: 'product.sp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Order Item',
                accessorKey: 'order_item',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return Amount',
                accessorKey: 'return_amount',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return Reason',
                accessorKey: 'return_reason',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    )

    const handleDownload = async () => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(
                `merchant/return_order_items?company_id=${selectedCompany.id}&brand_data=true&from=${from}&to=${To_Date}&download=true`,
                {
                    responseType: 'blob',
                },
            )

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${selectedCompany.name}(${from}-${to}).csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading the file:', error)
        }
    }

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
    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    console.log(from, '--------------', to)

    return (
        <>
            {showSpinner ? (
                <>
                    <div className="flex justify-center items-center h-screen">
                        <Spinner size="40px" />
                    </div>
                </>
            ) : (
                <div className="overflow-x-auto">
                    <div className="flex xl:flex-row xl:justify-between mb-5 items-center xl:items-end flex-col gap-4 ">
                        <button
                            className="bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg flex mt-6 xl:hidden  "
                            onClick={handleDownload}
                        >
                            <IoMdDownload className="text-xl" />
                        </button>
                        <div className=" align-bottom">
                            <input
                                type="text"
                                placeholder="Search here"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="p-2 border rounded"
                            />
                        </div>

                        <div className="flex gap-5 items-center xl:items-end xl:flex-row flex-col ">
                            <UltimateDatePicker
                                from={from}
                                setFrom={setFrom}
                                to={to}
                                setTo={setTo}
                                handleFromChange={handleFromChange}
                                handleToChange={handleToChange}
                                handleDateChange={handleDateChange}
                            />
                            <div>
                                <div className="flex items-end justify-end ">
                                    <button
                                        className="bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg xl:flex mt-6 hidden  "
                                        onClick={handleDownload}
                                    >
                                        <IoMdDownload className="text-xl" />
                                        Export
                                    </button>{' '}
                                    <br />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                    {data && data.length === 0 ? (
                        <div className="flex flex-col gap-1 justify-center items-center h-screen">
                            <h3>No Data Available</h3>
                            <p>Try changing the date </p>
                        </div>
                    ) : (
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
                    )}
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
            )}
        </>
    )
}

export default BrandReturns
