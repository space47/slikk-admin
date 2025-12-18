/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useEffect, useState, useMemo } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'
import DatePicker from '@/components/ui/DatePicker'
import { useAppDispatch, useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { Select, Button, Spinner } from '@/components/ui'
import Table from '@/components/ui/Table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Item, REMITANCE } from '@/store/types/remitance.types'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { FaFileDownload, FaDatabase, FaMoneyBillWave, FaCalendarAlt, FaFilter, FaFileExport, FaDownload } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'
import { Collapse, notification } from 'antd'
import { commonDownload } from '@/common/commonDownload'
import { MdSearchOff } from 'react-icons/md'

const { Tr, Th, Td, THead, TBody } = Table

const { Panel } = Collapse

const AnalyticsReports = () => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [fullRemitanceRespone, setFullRemitanceResponse] = useState<REMITANCE>()
    const [remitance, setRemitance] = useState<Item[]>([])
    const [from, setFrom] = useState(moment().startOf('month').format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [showOneMonthBack, setShowOneMonthBack] = useState(true)
    const [brandValue, setBrandValue] = useState<any | null>(null)
    const [accessDenied, setAccessDenied] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isRowDumpOrder, setIsRowDumpOrder] = useState(false)
    const [isRowDumpReturnOrder, setIsRowDumpReturnOrder] = useState(false)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const fetchRemitance = async () => {
        try {
            const brandData = brandValue ? `&brand=${encodeURIComponent(brandValue?.name)}` : ''
            const response = await axiosInstance.get(
                `/merchant/product/sales?from=${moment().startOf('week').format('YYYY-MM-DD')}&to=${moment().endOf('week').format('YYYY-MM-DD')}${brandData}`,
            )
            const remitanceData = response.data?.data.items
            setFullRemitanceResponse(response.data?.data)
            setRemitance(remitanceData)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error('Error fetching remitance:', error)
        }
    }

    useEffect(() => {
        fetchRemitance()
    }, [brandValue])

    const handleDateSubmit = () => {
        fetchRemitance()
    }

    const handleFromChange = (date: Date | null) => {
        if (date) {
            setFrom(moment(date).format('YYYY-MM-DD'))
            setShowOneMonthBack(false)
        }
    }

    const handleToChange = (date: Date | null) => {
        if (date) {
            setTo(moment(date).format('YYYY-MM-DD'))
        }
    }

    const handleBrandSelect = (newVal: any) => {
        setBrandValue(newVal)
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        notification.info({
            message: 'Download in process',
        })
        try {
            const brandData = brandValue ? `&brand=${encodeURIComponent(brandValue?.name)}` : ''
            const response = await axiosInstance.get(`/merchant/product/sales?from=${from}&to=${to}${brandData}&download=true`, {
                responseType: 'blob',
            })

            commonDownload(response, `${encodeURIComponent(brandValue?.name) || 'Remitance'}-${from}-to-${to}.csv`)
        } catch (error: any) {
            notification.error({ message: error?.response?.data?.message || 'Error downloading CSV' })
            console.error('Error downloading CSV:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleOrderItem = async () => {
        setIsRowDumpOrder(true)
        notification.info({
            message: 'Download in process',
        })
        try {
            const brandData = brandValue ? `&brand_name=${encodeURIComponent(brandValue?.name)}` : ''
            const response = await axiosInstance.get(
                `/merchant/order_items?download=true&download_type=master&from=${from}&to=${to}${brandData}`,
                {
                    responseType: 'blob',
                },
            )
            commonDownload(response, `${encodeURIComponent(brandValue?.name) || 'OrderItems'}-${from}-to-${to}.csv`)
        } catch (error: any) {
            notification.error({ message: error?.response?.data.message || 'Error downloading CSV' })
            console.error('Error downloading CSV:', error)
        } finally {
            setIsRowDumpOrder(false)
        }
    }

    const handleReturnOrderItem = async () => {
        setIsRowDumpReturnOrder(true)
        notification.info({
            message: 'Download in process',
        })
        try {
            const brandData = brandValue ? `&brand_name=${encodeURIComponent(brandValue?.name)}` : ''
            const response = await axiosInstance.get(
                `/merchant/return_order_items?download=true&download_type=master&from=${from}&to=${to}${brandData}`,
                {
                    responseType: 'blob',
                },
            )
            commonDownload(response, `${encodeURIComponent(brandValue?.name) || 'ReturnOrderItems'}-${from}-to-${to}.csv`)
        } catch (error: any) {
            notification.error({ message: error?.response.data.message || 'Error downloading CSV' })
            console.error('Error downloading CSV:', error)
        } finally {
            setIsRowDumpReturnOrder(false)
        }
    }

    const columns = useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
            { header: 'Product Name', accessorKey: 'name' },
            { header: 'Brand', accessorKey: 'brand_name' },
            { header: 'Quantity', accessorKey: 'quantity' },
            { header: 'MRP', accessorKey: 'mrp' },
            { header: 'Selling Price', accessorKey: 'selling_price' },
            { header: 'Size', accessorKey: 'size' },
        ],
        [],
    )

    const table = useReactTable({
        data: remitance || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    if (accessDenied) {
        return <AccessDenied />
    }

    const DownloadMISUi = () => {
        return (
            <Collapse
                bordered={false}
                expandIconPosition="end"
                className="custom-collapse bg-transparent"
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => (
                    <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <FaCalendarAlt className={`transition-transform duration-200 ${isActive ? 'rotate-180' : ''} text-gray-500`} />
                    </div>
                )}
            >
                <Panel
                    header={
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaFileDownload className="text-lg text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    Download Reports
                                    {isDownloading && (
                                        <span className="ml-3 text-xs text-blue-600 dark:text-blue-400 animate-pulse">Processing...</span>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Generate custom reports with date ranges and brand filters
                                </p>
                            </div>
                        </div>
                    }
                    key="1"
                    className="mb-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 "
                >
                    <div className="space-y-6 pt-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                Date Range Selection
                            </h4>
                            <div className="flex flex-col xl:flex-row gap-4 xl:gap-10 items-start xl:items-center">
                                <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 items-start xl:items-center">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-800 dark:text-gray-300">
                                            From Date{' '}
                                            <span className="text-xs text-gray-500">{showOneMonthBack ? '(Start of Month)' : ''}</span>
                                        </label>
                                        <DatePicker
                                            inputPrefix={<HiOutlineCalendar className="text-gray-500 text-lg" />}
                                            value={new Date(from)}
                                            onChange={handleFromChange}
                                            className="w-52 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-800 dark:text-gray-300">To Date</label>
                                        <DatePicker
                                            inputPrefix={<HiOutlineCalendar className="text-gray-500 text-lg" />}
                                            value={new Date(to)}
                                            onChange={handleToChange}
                                            minDate={new Date(from)}
                                            className="w-52 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    <div className="xl:mt-6">
                                        <Button
                                            variant="new"
                                            className="h-10 px-6 text-sm rounded-md shadow hover:shadow-md transition"
                                            onClick={handleDateSubmit}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <FaFilter className="text-purple-500" />
                                Filter & Download
                            </h4>
                            <div className="flex flex-col xl:flex-row items-center gap-4 justify-between">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-800 dark:text-gray-300">Brands</label>
                                    <div className="flex flex-col xl:flex-row items-start gap-2">
                                        <Select
                                            isClearable
                                            options={brands.brands}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id.toString()}
                                            onChange={handleBrandSelect}
                                            className="xl:w-[600px] w-auto"
                                        />
                                    </div>
                                </div>

                                <div className="">
                                    <Button
                                        onClick={handleDownload}
                                        variant="new"
                                        disabled={isDownloading}
                                        icon={<FaDownload className="text-lg" />}
                                        loading={isDownloading}
                                    >
                                        <span>Download</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        )
    }

    const DownloadDumpUi = () => {
        return (
            <Collapse
                bordered={false}
                expandIconPosition="end"
                className="custom-collapse bg-transparent"
                defaultActiveKey={['2']}
                expandIcon={({ isActive }) => (
                    <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <FaDatabase className={`transition-transform duration-200 ${isActive ? 'rotate-180' : ''} text-gray-500`} />
                    </div>
                )}
            >
                <Panel
                    header={
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <FaDatabase className="text-lg text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Download Raw Dumps</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Export raw order and return data</p>
                            </div>
                        </div>
                    }
                    key="2"
                    className="mb-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                    <div className="space-y-6 pt-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <FaFileExport className="text-green-500" />
                                Export Options
                            </h4>

                            <div className="flex flex-col xl:flex-row gap-4">
                                <div
                                    className={`p-5 rounded-lg border-2 cursor-pointer transition-all min-w-[200px] flex-1 ${
                                        isRowDumpOrder
                                            ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                                            : 'border-green-100 hover:border-green-300 dark:border-green-800 hover:shadow-md'
                                    }`}
                                    onClick={handleOrderItem}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                                <FaDownload className="text-green-600 dark:text-green-300" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800 dark:text-gray-200">Order Item</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Export all order items</p>
                                            </div>
                                        </div>
                                        {isRowDumpOrder && <Spinner size={18} color="green" />}
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        Download comprehensive order item data
                                    </div>
                                </div>
                                <div
                                    className={`p-5 rounded-lg border-2 cursor-pointer transition-all min-w-[200px] flex-1 ${
                                        isRowDumpReturnOrder
                                            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-blue-100 hover:border-blue-300 dark:border-blue-800 hover:shadow-md'
                                    }`}
                                    onClick={handleReturnOrderItem}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                <FaDownload className="text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800 dark:text-gray-200">Return Order Item</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Export all return order items</p>
                                            </div>
                                        </div>
                                        {isRowDumpReturnOrder && <Spinner size={18} color="blue" />}
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        Download comprehensive return order data
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="text-green-600 font-medium">Note:</span> Click on a card to download the respective data
                                export
                            </div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        )
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg border dark:bg-slate-800 border-gray-100">
            <div className="flex flex-col gap-8">
                {DownloadMISUi()}
                {DownloadDumpUi()}
                {remitance.length > 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FaMoneyBillWave className="text-lg text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Remittance Table</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Summary of all remittance records</p>
                            </div>
                        </div>
                        <div className="text-right font-semibold text-sm text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                                TOTAL AMOUNT:
                            </span>
                            <span className="text-green-600 dark:text-green-400 text-lg">
                                ₹{fullRemitanceRespone?.total_amount.toFixed(2)}
                            </span>
                        </div>
                        <div className="overflow-x-auto rounded-xl shadow-sm">
                            <Table className="min-w-full text-sm">
                                <THead className="bg-gray-100 dark:bg-gray-800">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <Th
                                                    key={header.id}
                                                    className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </Th>
                                            ))}
                                        </Tr>
                                    ))}
                                </THead>
                                <TBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <Tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                            {row.getVisibleCells().map((cell) => (
                                                <Td key={cell.id} className="py-2 px-4 text-gray-800 dark:text-gray-300">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </Td>
                                            ))}
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        </div>

                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-right">Showing {remitance.length} records</div>
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                                    <MdSearchOff className="text-red-600 dark:text-red-400 text-4xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                        No Remittance Data Found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        There is no remittance data available for the selected week
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AnalyticsReports
