import React, { useEffect, useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { USERANALYTICS_TYPE, User } from '@/store/types/userAnalytics.types'
import moment from 'moment'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import { FaCheckCircle, FaUsers } from 'react-icons/fa'

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const UserAnalyticsTable = () => {
    const [userData, setUserData] = useState<USERANALYTICS_TYPE>()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalData, setTotalData] = useState(0)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get(
                `/merchant/analytic/user?type=login&from=${from}&to=${to}&is_verified=True`,
            )
            const data = response.data
            setUserData(data)
            setTotalData(data?.data?.count || 0)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [page, pageSize, from, to])

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                header: 'First Name',
                accessorKey: 'first_name',
                cell: (info) => info.getValue() || '',
            },
            {
                header: 'Last Name',
                accessorKey: 'last_name',
                cell: (info) => info.getValue() || '',
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (info) => info.getValue() || '',
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    )

    const table = useReactTable({
        data: userData?.data.results || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(totalData / pageSize),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
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

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex flex-col md:flex-row md:gap-6 p-4 bg-gray-100 rounded-lg shadow-md">
                    <div className="flex items-center gap-2 text-blue-600 mb-2 md:mb-0">
                        <FaUsers className="text-2xl" />
                        <span className="text-lg font-semibold">
                            Online Users: {userData?.total_otp_verified}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle className="text-2xl" />
                        <span className="text-lg font-semibold">
                            Total Logged Users: {userData?.total_logged_in}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-6">
                    <div className="mb-4 md:mb-0">
                        <div className="mb-1 font-semibold text-xs md:text-sm">
                            FROM DATE:
                        </div>
                        <DatePicker
                            inputPrefix={
                                <HiOutlineCalendar className="text-base md:text-lg" />
                            }
                            defaultValue={new Date()}
                            value={new Date(from)}
                            onChange={handleFromChange}
                            className="w-full md:w-[240px]"
                        />
                    </div>
                    <div>
                        <div className="mb-1 font-semibold text-xs md:text-sm">
                            TO DATE:
                        </div>
                        <DatePicker
                            inputSuffix={
                                <TbCalendarStats className="text-base md:text-xl" />
                            }
                            defaultValue={new Date()}
                            value={moment(to).toDate()}
                            onChange={handleToChange}
                            minDate={moment(from).toDate()}
                            className="w-full md:w-[240px]"
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
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
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalData}
                    onChange={onPaginationChange}
                    className="flex-shrink-0"
                />
                <div className="min-w-[130px]">
                    <Select
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

export default UserAnalyticsTable
