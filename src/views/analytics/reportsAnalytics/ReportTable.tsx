/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Button, Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import moment from 'moment'
import React, { useMemo } from 'react'

interface ReportTableProps {
    tableData: any[]
    page: number
    pageSize: number
    orderCount?: number
    onPaginationChange?: any
    setPageSize: any
    setPage: any
    keyName?: any
    showSpinner?: any
    tableName?: any
    handleDownloadCsv: any
}

type Option = {
    value: number
    label: string
}

const ReportTable = ({ tableData, page, pageSize, setPage, setPageSize, keyName, tableName, handleDownloadCsv }: ReportTableProps) => {
    const paginatedData = tableData ? tableData?.slice((page - 1) * pageSize, page * pageSize) : []
    const totalPages = Math.ceil(tableData.length / pageSize)

    const columns = useMemo(() => {
        if (!tableData || tableData.length === 0) return []

        return Object.keys(tableData[0]).map((key) => ({
            header: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            accessorKey: key,
            cell: ({ getValue }: any) => {
                const value = getValue()
                if (key.toLowerCase().includes('%date%') || key === 'Order_Date' || key === 'Launch_Date') {
                    console.log('Date identified')
                    return <span>{moment(value).utcOffset(330).format('YYYY-MM-DD hh:mm:ss a')}</span>
                }
                return <span>{value}</span>
            },
        }))
    }, [tableData])

    return (
        <div>
            <div className="flex justify-between mb-5">
                <div className="font-bold text-2xl ">{keyName ? keyName.toUpperCase() : ''}</div>
                <div className="flex justify-end ">
                    <Button variant="new" onClick={() => handleDownloadCsv(tableName)}>
                        Download CSV
                    </Button>
                </div>
            </div>
            <EasyTable mainData={paginatedData} columns={columns} overflow />

            <div className="flex items-center justify-between mt-4">
                <Pagination currentPage={page} total={totalPages} onChange={(page) => setPage(page)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => setPageSize(Number(option?.value))}
                    />
                </div>
            </div>
        </div>
    )
}

export default ReportTable
