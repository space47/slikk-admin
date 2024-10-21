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
import { NOTIFYSTATS, NotifyResponse, pageSizeOptions } from './getNotiStats.common'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import EasyTable from '@/common/EasyTable'

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

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
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/notification/stats?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}`)
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
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD hh:mm:ss a')}</span>,
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
        ],
        [],
    )

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    const navigate = useNavigate()

    const handleSeller = () => {
        navigate('/app/appsCommuncication/sendNotification/addNew')
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4 flex gap-2 items-center">
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
                    <div className="mt-4">
                        <button
                            className="bg-black text-white px-5 py-2 items-center justify-center rounded-md hover:bg-gray-700 xl:hidden  flex"
                            onClick={handleSeller}
                        >
                            Add New
                        </button>
                    </div>
                </div>

                <div className="flex gap-5 items-center flex-col xl:flex-row mb-4">
                    <div className="">
                        <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
                    </div>
                    <div className=" mt-4 order-first xl:order-1">
                        <button
                            className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700 hidden xl:flex"
                            onClick={handleSeller}
                        >
                            Create Notification
                        </button>{' '}
                    </div>
                </div>
            </div>
            <EasyTable mainData={data} page={page} pageSize={pageSize} columns={columns} />
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
