import React, { useEffect, useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import { USERANALYTICS_TYPE } from '@/store/types/userAnalytics.types'
import { fetchUserAnalytics, setFrom, setTo, setPage, setPage_size } from '@/store/slices/userAnalytics/userAnalytics.slice'
import moment from 'moment'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import { FaCheckCircle, FaUsers } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@/store'
import { Pagination } from '@/components/ui'
import AccessDenied from '@/views/pages/AccessDenied'

const { Tr, Th, Td, THead, TBody } = Table

const UserAnalyticsTable = () => {
    const dispatch = useAppDispatch()
    const { data, from, to, total_logged_in, total_otp_verified, page, page_size, accessDenied } = useAppSelector(
        (state: { userAnalytics: USERANALYTICS_TYPE }) => state.userAnalytics,
    )

    useEffect(() => {
        dispatch(fetchUserAnalytics())
    }, [dispatch, from, to, page, page_size])

    const columns = useMemo(
        () => [
            { header: 'First Name', accessorKey: 'first_name' },
            { header: 'Last Name', accessorKey: 'last_name' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Mobile', accessorKey: 'mobile' },
        ],
        [],
    )

    const table = useReactTable({
        data: data?.results || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: false,
        // state: {
        //     pagination: {
        //         pageIndex: 0,
        //         pageSize: data?.results?.length || 10,
        //     },
        // },
    })

    console.log('AccessDenied', accessDenied)

    const handleFromChange = (date: Date | null) => {
        dispatch(setFrom(date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')))
    }

    const handleToChange = (date: Date | null) => {
        dispatch(setTo(date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')))
    }

    const onPaginationChange = (page: number) => {
        dispatch(setPage(page))
    }

    if (accessDenied === true) {
        return <AccessDenied />
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex flex-col md:flex-row md:gap-6 p-4 bg-gray-100 rounded-lg shadow-md">
                    <div className="flex items-center gap-2 text-blue-600 mb-2 md:mb-0">
                        <FaUsers className="text-2xl" />
                        <span className="text-lg font-semibold">Online Users: {total_otp_verified}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle className="text-2xl" />
                        <span className="text-lg font-semibold">Total Logged Users: {total_logged_in}</span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-6">
                    <div className="mb-4 md:mb-0">
                        <div className="mb-1 font-semibold text-xs md:text-sm">FROM DATE:</div>
                        <DatePicker
                            inputPrefix={<HiOutlineCalendar className="text-base md:text-lg" />}
                            value={new Date(from)}
                            onChange={handleFromChange}
                            className="w-full md:w-[240px]"
                        />
                    </div>
                    <div>
                        <div className="mb-1 font-semibold text-xs md:text-sm">TO DATE:</div>
                        <DatePicker
                            inputSuffix={<TbCalendarStats className="text-base md:text-xl" />}
                            value={moment(to).toDate()}
                            onChange={handleToChange}
                            minDate={moment(from).toDate()}
                            className="w-full md:w-[240px]"
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                {data?.results && data?.results.length === 0 ? (
                    <div className="flex flex-col gap-1 justify-center items-center h-screen">
                        <h3>No Data Available</h3>
                        <p>Try changing the date </p>
                    </div>
                ) : (
                    <Table className="min-w-full">
                        <THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</Th>
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
            </div>
            <Pagination pageSize={page_size} currentPage={page} total={data?.count} onChange={onPaginationChange} />
        </div>
    )
}

export default UserAnalyticsTable
