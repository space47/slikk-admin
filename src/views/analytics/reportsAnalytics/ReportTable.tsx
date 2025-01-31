/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Button, Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import moment from 'moment'
import React, { useEffect, useMemo } from 'react'

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
                if (key.toLowerCase().includes('date')) {
                    console.log('Date identified')
                    return <span>{moment(value).utcOffset(330).format('YYYY-MM-DD hh:mm:ss a')}</span>
                }
                if (key.toLowerCase().includes('image')) {
                    return <img src={value?.split(',')[0] || value} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                }
                return <span>{value}</span>
            },
        }))
    }, [tableData])

    useEffect(() => {
        if (pageSize > 10) {
            setPage(1)
        }
    }, [])

    return (
        <div>
            <div className="flex justify-between mb-5">
                <div className="font-bold text-xl w-1/2 xl:text-2xl text-blue-700 ">{keyName ? keyName.toUpperCase() : ''}</div>
                <div className="flex justify-end  ">
                    <Button variant="new" onClick={() => handleDownloadCsv(tableName)} size="sm">
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
