import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'
import { NOTIFYSTATS, NotifyResponse } from './getNotiStats.common'
import { DatePicker } from '@/components/ui'
import { HiOutlineCalendar } from 'react-icons/hi'

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

const GetNotificationStats = () => {
    const [data, setData] = useState<NOTIFYSTATS[]>([])
    const [totalData, setTotalData] = useState(0)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const fetchData = async (page: number, pageSize: number) => {
        try {
            // const filterValue = globalFilter ? `&name=${globalFilter}` : ''
            const response = await axiosInstance.get(`/notification/stats?p=${page}&page_size=${pageSize}&from=${from}&to=${to}`)
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
    }, [page, pageSize, globalFilter, from, to])

    // const handleActionClick = (id: number) => {
    //     // console.log('OK', id)
    //     navigate(`/app/sellers/${id}`)
    // }

    const columns = useMemo<ColumnDef<NOTIFYSTATS>[]>(
        () => [
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
                header: 'Message',
                accessorKey: 'message',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Total users',
                accessorKey: 'total_users',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Success',
                accessorKey: 'success',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Failure',
                accessorKey: 'failure',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },

            {
                header: 'Notification',
                accessorKey: 'notification',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },

            // {
            //     header: 'Edit',
            //     accessorKey: '',
            //     cell: ({ row }) => (
            //         <button onClick={() => handleActionClick(row.original.id)} className="border-none bg-none">
            //             <FaEdit className="text-xl text-blue-600" />
            //         </button>
            //     ),
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

    const navigate = useNavigate()

    const handleSeller = () => {
        navigate('/app/appsCommuncication/sendNotification/addNew')
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4 flex">
                    <div>
                        <div>Enter name:</div>
                        <input
                            type="text"
                            placeholder="Search here"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="flex gap-5 items-center flex-col xl:flex-row mb-4">
                    <div className="flex ">
                        <div>
                            <div className="mb-1 font-semibold text-sm">FROM DATE:</div>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg" />}
                                defaultValue={new Date()}
                                value={new Date(from)}
                                onChange={handleFromChange}
                                className="w-2/3"
                            />
                        </div>
                        <div>
                            <div className="mb-1 font-semibold text-sm">TO DATE:</div>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-xl" />}
                                defaultValue={new Date()}
                                value={new Date(to)}
                                onChange={handleToChange}
                                minDate={moment(from).toDate()}
                                className="w-2/3"
                            />
                        </div>
                    </div>
                    <div className=" mt-4 order-first xl:order-1">
                        <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleSeller}>
                            Create Notification
                        </button>{' '}
                    </div>
                </div>
            </div>
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
    )
}

export default GetNotificationStats
