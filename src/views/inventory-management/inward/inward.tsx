/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import { FaEdit } from 'react-icons/fa'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

type TableData = {
    id: number
    company: number
    create_date: string
    document_url: string
    document_date: string
    document_number: string
    images: string
    last_updated_by: {
        name: string
        mobile: string
    }
    received_address: string
    received_by: {
        name: string
        mobile: string
    }
    slikk_owned: boolean
    store: number
    total_quantity: number
    total_sku: number
    update_date: string
    grn_number: string
    action: React.ReactNode
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
    { value: 100, label: '100 / page' }
]

const PaginationTable = () => {
    const [data, setData] = useState<TableData[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('YYYY-MM-DD'))

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>(
        (store) => store.company.currCompany
    )

    const fetchData = async (
        page: number,
        pageSize: number,
        from: string,
        to: string
    ) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(
                `goods/received/${selectedCompany.id}?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}` // &company_id
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
    }, [page, pageSize, from, to, selectedCompany])

    const getowner = (own: any) => {
        if (own === true) {
            return 'Yes'
        } else {
            return 'No'
        }
    }

    const handleGRNClick = (document_number: any, company: any) => {
        console.log('done', document_number)

        navigate(`/app/goods/received/${company}/${document_number}`)
    }
    // const getFirstImageUrl = (images: string): string => {
    //     if (images.length === 0) return ''
    //     const img = images.split(',')
    //     return img[0] || ''
    // }

    const handleDocumentClick = (id: any) => {
        console.log('ok', id)
    }

    const handleActionClick = (grn: string) => {
        navigate(`/app/goods/received/edit/${grn}`)
    }

    const columns = useMemo<ColumnDef<TableData>[]>(
        () => [
            {
                header: 'GRN Number',
                accessorKey: 'grn_number',
                cell: ({ row }) => (
                    <div
                        onClick={() =>
                            handleGRNClick(
                                row.original.grn_number,
                                row.original.company
                            )
                        }
                        className="cursor-pointer bg-gray-200 px-3 py-3 rounded-md text-black font-semibold"
                    >
                        {row.original.grn_number}
                    </div>
                )
            },
            {
                header: 'Document Number',
                accessorKey: 'document_number',
                cell: (info) => info.getValue()
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                )
            },
            {
                header: 'Document url',
                accessorKey: 'document_url',
                cell: (info) => (
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDocumentClick(info.getValue())}
                    >
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                header: 'Document Date',
                accessorKey: 'document_date',
                cell: (info) => info.getValue()
            },

            {
                header: 'Images',
                accessorKey: 'images',
                cell: (info) => info.getValue()
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue()
            },
            {
                header: 'Received At',
                accessorKey: 'received_address',
                cell: (info) => info.getValue()
            },
            {
                header: 'Received By',
                accessorKey: 'received_by.name',
                cell: (info) => info.getValue()
            },
            {
                header: 'Slikk Owned',
                accessorKey: 'slikk_owned',
                cell: (info) => getowner(info.getValue())
            },
            {
                header: 'Total QTY',
                accessorKey: 'total_quantity',
                cell: (info) => info.getValue()
            },
            {
                header: 'Total SKU',
                accessorKey: 'total_sku',
                cell: (info) => info.getValue()
            },
            {
                header: 'Updated On',
                accessorKey: 'update_date',
                cell: ({ getValue }) => (
                    <span>
                        {moment(getValue() as string).format('YYYY-MM-DD')}
                    </span>
                )
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button
                        onClick={() =>
                            handleActionClick(row.original.grn_number)
                        }
                        className="border-none bg-none"
                    >
                        <FaEdit className="text-xl" />
                    </button>
                )
            }
        ],
        []
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(totalData / pageSize), // Ensure page count is updated
        manualPagination: true, // Enable manual pagination
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize
            }
        },
        onPaginationChange: ({ pageIndex, pageSize }) => {
            setPage(pageIndex + 1) // React Table uses zero-based index
            setPageSize(pageSize)
        }
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const navigate = useNavigate()

    const handleGRN = () => {
        navigate('/app/goods/received/form')
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

    return (
        <div>
            <div className=" flex gap-6 justify-end mb-5">
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
                            onChange={handleToChange}
                            minDate={moment(from).add(1, 'day').toDate()}
                        />
                    </div>
                </div>
                <div className="flex items-end justify-end">
                    <button
                        className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                        onClick={handleGRN}
                    >
                        ADD NEW GRN
                    </button>{' '}
                </div>
                <br />
                <br />
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
                    onChange={onPaginationChange}
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
        </div>
    )
}

export default PaginationTable
