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
import { IoMdDownload } from 'react-icons/io'

interface LastUpdatedBy {
    name: string
    mobile: string
    email: string
}

interface Product {
    barcode: string
    brand_name: string
    color: string
    id: number
    name: string
    size: string
    sku: string
    variant_id: string
}

interface Stock {
    product: Product
    store: number
    quantity: number
    last_updated_by: LastUpdatedBy
    show_out_of_stock: boolean
    is_active: boolean
    offer_is_active: boolean
    expiry_date: string
    batch_number: string
    create_date: string
    update_date: string
    grn: any
    id: number
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

const BrandStock = () => {
    const [data, setData] = useState<Stock[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('YYYY-MM-DD'))
    const [filterInput, setFilterInput] = useState('')

    const fetchData = async (page: number, pageSize: number, from: string, to: string) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(
                `inventory?p=${page}&page_size=${pageSize}&company_id=${selectedCompany.id}&from=${from}&to=${To_Date}`,
            )
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    const filter = async (page: number, pageSize: number, filter: string = '') => {
        try {
            let searchInputType = `&sku=${filter}`
            setFilterInput(searchInputType)

            let response = await axiosInstance.get(
                `inventory?dashboard=true&p=${page}&page_size=${pageSize}${searchInputType}&company_id=${selectedCompany.id}`,
            )

            if (response.data.data.results.length === 0) {
                searchInputType = `&name=${filter}`
                setFilterInput(searchInputType)
                response = await axiosInstance.get(
                    `inventory?dashboard=true&p=${page}&page_size=${pageSize}${searchInputType}&company_id=${selectedCompany.id}`,
                )
            }

            const data = response.data.data.results
            const total = response.data.data.count

            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize, from, to)
    }, [page, pageSize, selectedCompany, from, to, globalFilter])
    useEffect(() => {
        if (globalFilter) {
            filter(page, pageSize, globalFilter)
        }
    }, [page, pageSize, globalFilter])

    // const getUploadStatus = (is_active: any) => {
    //     if (is_active == true) {
    //         return 'Yes'
    //     } else {
    //         return 'No'
    //     }
    // }

    const columns = useMemo<ColumnDef<Stock>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'product.sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Product Name',
                accessorKey: 'product.name',
                cell: (info) => info.getValue(),
            },
            // {
            //     header: 'Store Number',
            //     accessorKey: 'store',
            //     cell: (info) => info.getValue(),
            // },
            // {
            //     header: 'QTY',
            //     accessorKey: 'quantity',
            //     cell: (info) => info.getValue(),
            // },
            {
                header: 'Brand',
                accessorKey: 'product.brand_name',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Color',
                accessorKey: 'product.color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Size',
                accessorKey: 'product.size',
                cell: (info) => info.getValue().toUpperCase(),
            },
            {
                header: ' Stock',
                accessorKey: 'quantity',
                cell: (info) => info.getValue(),
            },
            // {
            //     header: 'Active',
            //     accessorKey: 'is_active',
            //     cell: (info) => getUploadStatus(info.getValue()),
            // },
            // {
            //     header: 'Offer Active',
            //     accessorKey: ' offer_is_active',
            //     cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            // },
            {
                header: 'Expiry',
                accessorKey: 'expiry_date',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Batch Num',
                accessorKey: 'batch_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Created',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Updated',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            // {
            //     header: 'GRN number',
            //     accessorKey: 'grn',
            //     cell: (info) => info.getValue(),
            // },
            // {
            //     header: 'Updated By',
            //     accessorKey: 'last_updated_by.name',
            //     cell: (info) => info.getValue(),
            // },
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

    const date = new Date()
    console.log('DAAAAATE', moment(date).format('YYYY-MM-DD'))

    const handleDownload = async () => {
        try {
            const downloadUrl = `inventory?download=true&p=${page}&page_size=${pageSize}&company_id=${selectedCompany.id}`
            const response = await axiosInstance.get(downloadUrl, {
                responseType: 'blob',
            })
            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${selectedCompany.name}_Stock-${moment(date).format('YYYY-MM-DD')}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="overflow-x-auto shadow-xl p-4 rounded-xl">
            <div className="upper flex flex-col md:flex-row justify-between mb-4 items-center md:items-center gap-4">
                <div className="w-auto md:w-auto">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded-xl w-full md:w-auto"
                    />
                </div>

                <button
                    className="bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg flex order-first xl:order-none "
                    onClick={handleDownload}
                >
                    <IoMdDownload className="text-xl" />
                    Export
                </button>
            </div>
            <Table className="w-full">
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
            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalData}
                    onChange={onPaginationChange}
                    className="w-full md:w-auto mb-4 md:mb-0"
                />
                <div className="min-w-[130px] hidden md:w-auto xl:block">
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                        className="w-full md:w-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default BrandStock
