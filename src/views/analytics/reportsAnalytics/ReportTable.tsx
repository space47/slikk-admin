/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Button, Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import moment from 'moment'
import React, { useMemo, useState } from 'react'

interface ReportTableProps {
    tableData: any[]
    onPaginationChange?: any
    keyName?: any
    showSpinner?: any
    tableName?: any
    handleDownloadCsv: any
}

type Option = {
    value: number
    label: string
}

const ReportTable = ({ tableData, keyName, tableName, handleDownloadCsv }: ReportTableProps) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
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
                    return <span>{moment(value).utcOffset(330).format('YYYY-MM-DD hh:mm:ss a')}</span>
                }
                if (key.toLowerCase().includes('image')) {
                    return <img src={value?.split(',')[0] || value} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                }
                if (key.toLowerCase().includes('return_order_id')) {
                    return (
                        <span>
                            <a
                                href={`/app/returnOrders/${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white bg-red-600 rounded-xl p-3"
                            >
                                {value}
                            </a>
                        </span>
                    )
                }
                if (key.toLowerCase().includes('invoice_id')) {
                    return (
                        <span>
                            <a
                                href={`/app/orders/${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white bg-red-600 rounded-xl p-3"
                            >
                                {value}
                            </a>
                        </span>
                    )
                }
                return <span>{value}</span>
            },
        }))
    }, [tableData])

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
            <div className="border border-gray-300 p-4 rounded-xl">
                <EasyTable mainData={paginatedData} columns={columns} overflow page={page} pageSize={pageSize} />
            </div>

            <div className="flex items-center justify-between mt-4">
                <Pagination currentPage={page} total={totalPages} onChange={(page) => setPage(page)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            setPage(1)
                            setPageSize(Number(option?.value))
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ReportTable
