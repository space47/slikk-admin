/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { GiBrain } from 'react-icons/gi'
import { MdPushPin } from 'react-icons/md'

interface ReportTableProps {
    extra_attributes: any
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

const ReportTable = ({ tableData, keyName, tableName, handleDownloadCsv, extra_attributes }: ReportTableProps) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showCaseText, setShowCaseText] = useState(false)
    const [showLogicText, setShowLogicText] = useState(false)

    const paginatedData = tableData ? tableData.slice((page - 1) * pageSize, page * pageSize) : []

    const totalPages = Math.ceil((tableData?.length || 0) / pageSize)

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl xl:text-2xl font-bold text-blue-700 tracking-wide">{keyName ? keyName.toUpperCase() : ''}</h2>

                <Button variant="new" size="sm" className="self-start sm:self-auto" onClick={() => handleDownloadCsv(tableName)}>
                    Download CSV
                </Button>
            </div>

            {/* Buttons */}
            {(extra_attributes?.use_case || extra_attributes?.logic) && (
                <div className="flex flex-wrap gap-3">
                    {!!extra_attributes?.use_case && (
                        <Button
                            variant={showCaseText ? 'reject' : 'twoTone'}
                            size="sm"
                            icon={showCaseText ? '' : <MdPushPin />}
                            onClick={() => setShowCaseText((prev) => !prev)}
                        >
                            {showCaseText ? 'Close Use Case' : 'See Use Case'}
                        </Button>
                    )}

                    {!!extra_attributes?.logic && (
                        <Button
                            variant={showLogicText ? 'reject' : 'twoTone'}
                            size="sm"
                            icon={showLogicText ? '' : <GiBrain />}
                            onClick={() => setShowLogicText((prev) => !prev)}
                        >
                            {showLogicText ? 'Close Logic' : 'See Logic behind the query'}
                        </Button>
                    )}
                </div>
            )}

            {/* Use Case */}
            {showCaseText && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-gray-700">
                    <div className="font-semibold text-blue-700 mb-1">Use Case</div>
                    <p>{extra_attributes?.use_case}</p>
                </div>
            )}

            {/* Logic */}
            {showLogicText && (
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-gray-700">
                    <div className="font-semibold text-purple-700 mb-1">Logic Behind This Query</div>
                    <p>{extra_attributes?.logic}</p>
                </div>
            )}

            {/* Table Container */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                    {/* Sticky header table */}
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
                            <tr>
                                {columns.map((col: any) => (
                                    <th key={col.accessorKey} className="px-4 py-3 text-[13px] text-left font-semibold border-b">
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((row, i) => (
                                <tr key={i} className="border-b">
                                    {columns.map((col: any) => {
                                        const value = row[col.accessorKey]

                                        if (col.cell) {
                                            return (
                                                <td key={col.accessorKey} className="px-4 py-3">
                                                    {col.cell({
                                                        getValue: () => value,
                                                    })}
                                                </td>
                                            )
                                        }

                                        return (
                                            <td key={col.accessorKey} className="px-4 py-3">
                                                {value}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Pagination currentPage={page} total={totalPages} onChange={(page) => setPage(page)} />

                <div className="min-w-[130px]">
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
