/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Pagination, Select, Tooltip } from '@/components/ui'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import {
    HiOutlineDownload,
    HiOutlineSortAscending,
    HiOutlineSortDescending,
    HiOutlinePhotograph,
    HiOutlineCalendar,
    HiOutlineCurrencyRupee,
    HiOutlineTable,
    HiOutlineRefresh,
} from 'react-icons/hi'
import { FaChevronLeft, FaChevronRight, FaImage, FaCalendarAlt, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'

interface SalesReportTableProps {
    tableData: any[]
    orderCount?: number
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

const SalesReportTable = ({ tableData, keyName, tableName, handleDownloadCsv, showSpinner }: SalesReportTableProps) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
    const [hoveredRow, setHoveredRow] = useState<number | null>(null)

    // Sort data
    const sortedData = useMemo(() => {
        if (!tableData || tableData.length === 0) return []

        let sortableData = [...tableData]
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }
        return sortableData
    }, [tableData, sortConfig])

    // Paginate sorted data
    const paginatedData = sortedData?.slice((page - 1) * pageSize, page * pageSize) || []
    const totalPages = Math.ceil((tableData?.length || 0) / pageSize)

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FaSort className="w-3 h-3 text-gray-300 group-hover:text-gray-400" />
        }
        return sortConfig.direction === 'asc' ? (
            <FaSortUp className="w-3 h-3 text-blue-500" />
        ) : (
            <FaSortDown className="w-3 h-3 text-blue-500" />
        )
    }

    const columns = useMemo(() => {
        if (!tableData || tableData.length === 0) return []

        return Object.keys(tableData[0]).map((key) => ({
            header: () => (
                <button
                    onClick={() => requestSort(key)}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors duration-150 group w-full"
                >
                    <span className="font-semibold text-xs uppercase tracking-wider text-gray-600">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    {getSortIcon(key)}
                </button>
            ),
            accessorKey: key,
            cell: ({ getValue, row }: any) => {
                const value = getValue()
                const isHovered = hoveredRow === row.index

                // Date formatting
                if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) {
                    return (
                        <div
                            className={`flex items-center gap-2 text-sm px-3 py-2 transition-all duration-150 ${isHovered ? 'bg-blue-50/50' : ''}`}
                        >
                            <HiOutlineCalendar className="text-blue-400 text-sm flex-shrink-0" />
                            <span className="font-mono text-xs text-gray-600 truncate">
                                {moment(value).utcOffset(330).format('DD MMM YYYY, hh:mm a')}
                            </span>
                        </div>
                    )
                }

                // Image handling
                if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('img')) {
                    const imageUrl = value?.split(',')[0] || value
                    return (
                        <Tooltip content="Click to view full image">
                            <div className="relative group/image px-3 py-1">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 cursor-pointer">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110"
                                        onClick={() => window.open(imageUrl, '_blank')}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-20 transition-all duration-300"></div>
                                </div>
                            </div>
                        </Tooltip>
                    )
                }

                // Currency formatting
                if (
                    key.toLowerCase().includes('price') ||
                    key.toLowerCase().includes('amount') ||
                    key.toLowerCase().includes('total') ||
                    key.toLowerCase().includes('cost')
                ) {
                    return (
                        <div className={`flex items-center gap-1.5 px-3 py-2 ${isHovered ? 'bg-emerald-50/50' : ''}`}>
                            <HiOutlineCurrencyRupee className="text-emerald-500 text-sm flex-shrink-0" />
                            <span className="font-mono font-medium text-sm text-gray-700">
                                {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                }).format(Number(value) || 0)}
                            </span>
                        </div>
                    )
                }

                // Percentage
                if (key.toLowerCase().includes('percentage') || key.toLowerCase().includes('percent') || key.toLowerCase().includes('%')) {
                    return (
                        <div className={`px-3 py-2 ${isHovered ? 'bg-purple-50/50' : ''}`}>
                            <span className="text-sm text-gray-600">{Number(value).toFixed(2)}%</span>
                        </div>
                    )
                }

                // Numbers
                if (typeof value === 'number') {
                    return (
                        <div className={`px-3 py-2 ${isHovered ? 'bg-blue-50/50' : ''}`}>
                            <span className="font-mono text-sm text-gray-600">{new Intl.NumberFormat('en-IN').format(value)}</span>
                        </div>
                    )
                }

                // Default text
                return (
                    <div className={`px-3 py-2 ${isHovered ? 'bg-gray-50' : ''}`}>
                        <span className="text-sm text-gray-600 line-clamp-2">{value || '—'}</span>
                    </div>
                )
            },
        }))
    }, [tableData, sortConfig, hoveredRow])

    if (showSpinner) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl">
                <HiOutlineRefresh className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                <p className="text-sm text-gray-500">Loading data...</p>
            </div>
        )
    }

    if (!tableData || tableData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
                <HiOutlineTable className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 mb-1">No data available</p>
                <p className="text-xs text-gray-400">Try adjusting your filters</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-800 tracking-tight">{keyName ? keyName.toUpperCase() : ''}</h3>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100">
                        {tableData.length} records
                    </span>
                </div>

                <button
                    onClick={() => handleDownloadCsv(tableName)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl
                             hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 
                             transition-all duration-200 group"
                >
                    <HiOutlineDownload className="text-lg text-gray-500 group-hover:text-blue-500" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Export</span>
                </button>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <EasyTable mainData={paginatedData} columns={columns} onRowHover={(index: number) => setHoveredRow(index)} />
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
                    <div className="text-sm text-gray-500 order-2 sm:order-1">
                        Showing <span className="font-medium text-gray-700">{(page - 1) * pageSize + 1}</span> to{' '}
                        <span className="font-medium text-gray-700">{Math.min(page * pageSize, tableData.length)}</span> of{' '}
                        <span className="font-medium text-gray-700">{tableData.length}</span> entries
                    </div>

                    <div className="flex items-center gap-4 order-1 sm:order-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 hidden sm:block">Rows:</span>
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => {
                                    setPageSize(Number(option?.value))
                                    setPage(1)
                                }}
                                className="w-20 sm:w-24"
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`p-2 rounded-lg border ${
                                    page === 1
                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                                } transition-colors duration-200`}
                            >
                                <FaChevronLeft className="w-3 h-3" />
                            </button>

                            <div className="flex items-center gap-1 mx-2">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum = page
                                    if (page <= 3) {
                                        pageNum = i + 1
                                    } else if (page >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i
                                    } else {
                                        pageNum = page - 2 + i
                                    }

                                    if (pageNum > 0 && pageNum <= totalPages) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                    page === pageNum ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    }
                                    return null
                                })}
                                {totalPages > 5 && <BsThreeDots className="w-4 h-4 text-gray-400" />}
                            </div>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={`p-2 rounded-lg border ${
                                    page === totalPages
                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                                } transition-colors duration-200`}
                            >
                                <FaChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SalesReportTable
