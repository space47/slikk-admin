/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import moment from 'moment'
import React, { useMemo } from 'react'

interface ReportTableProps {
    tableData: any[]
    page: number
    pageSize: number
    orderCount: number
    onPaginationChange: any
    setPageSize: any
    setPage: any
}

const ReportTable = ({ tableData, page, pageSize, orderCount, onPaginationChange, setPageSize }: ReportTableProps) => {
    const columns = useMemo(() => {
        if (!tableData || tableData.length === 0) return []

        return Object.keys(tableData[0]).map((key) => ({
            header: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            accessorKey: key,
            cell: ({ getValue }: any) => {
                const value = getValue()
                if (key === 'date' || key === 'Order_Date') {
                    return <span>{moment(value).utcOffset(330).format('YYYY-MM-DD hh:mm:ss a')}</span>
                }
                return <span>{value}</span>
            },
        }))
    }, [tableData])

    return (
        <div>
            <EasyTable mainData={tableData} columns={columns} />

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={orderCount} onChange={onPaginationChange} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => setPageSize(option?.value)}
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
        </div>
    )
}

export default ReportTable
