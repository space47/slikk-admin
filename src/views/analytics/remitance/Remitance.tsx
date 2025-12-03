/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'
import DatePicker from '@/components/ui/DatePicker'
import { useAppDispatch, useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { Select, Button, Spinner } from '@/components/ui'
import Table from '@/components/ui/Table'
import { Item, REMITANCE } from '@/store/types/remitance.types'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import {
    FaFileDownload,
    FaDatabase,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaFilter,
    FaBuilding,
    FaFileExport,
    FaDownload,
    FaChevronUp,
} from 'react-icons/fa'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import AccessDenied from '@/views/pages/AccessDenied'
import { RemitanceColumns } from './remitanceUtils/RemitanceColumns'
import RemitanceApis from './remitanceUtils/RemitanceApiCalls'
import { MdSearchOff } from 'react-icons/md'
import { Collapse, Tag } from 'antd'

const { Tr, Th, Td, THead, TBody } = Table
const { Panel } = Collapse

const Remitance = () => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [fullRemitanceResponse, setFullRemitanceResponse] = useState<REMITANCE>()
    const [remitance, setRemitance] = useState<Item[]>([])
    const [from, setFrom] = useState(moment().startOf('month').format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [showOneMonthBack, setShowOneMonthBack] = useState(true)
    const [brandValue, setBrandValue] = useState<any | null>(null)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [fieldValue, setFieldValue] = useState<any[]>([])
    const [companyData, setCompanyData] = useState<any>(null)
    const [accessDenied, setAccessDenied] = useState(false)
    const dispatch = useAppDispatch()
    const [isDownloading, setIsDownloading] = useState(false)
    const [isRowDumpOrder, setIsRowDumpOrder] = useState(false)
    const [isRowDumpReturnOrder, setIsRowDumpReturnOrder] = useState(false)

    const { fetchRemitanceApi, handleDownload, handleOrderItem, handleReturnOrderItem } = RemitanceApis({
        brandValue,
        from,
        ToDate: to,
        setRemitance,
        setFullRemitanceResponse,
        setAccessDenied,
        companyData,
        setIsDownloading,
        setIsRowDumpOrder,
        setIsRowDumpReturnOrder,
    })

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    useEffect(() => {
        fetchRemitanceApi()
    }, [brandValue])

    const handleDateSubmit = () => {
        fetchRemitanceApi()
    }
    const table = useReactTable({
        data: remitance || [],
        columns: RemitanceColumns(),
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
                        <FaChevronUp className={`transition-transform duration-200 ${isActive ? 'rotate-180' : ''} text-gray-500`} />
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
                                    Download Remittance Reports
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
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                Date Range Selection
                            </h4>
                            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
                                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                    <div className="flex flex-col gap-1 xl:mt-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            From Date {showOneMonthBack && <Tag color="blue">Start of Month</Tag>}
                                        </label>
                                        <DatePicker
                                            inputPrefix={<HiOutlineCalendar className="text-lg text-gray-500" />}
                                            value={new Date(from)}
                                            className="w-56 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                                            onChange={(date) => {
                                                if (date) {
                                                    setFrom(moment(date).format('YYYY-MM-DD'))
                                                    setShowOneMonthBack(false)
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 xl:mt-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                                        <DatePicker
                                            inputPrefix={<HiOutlineCalendar className="text-lg text-gray-500" />}
                                            value={new Date(to)}
                                            minDate={new Date(from)}
                                            className="w-56 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                                            onChange={(date) => {
                                                if (date) setTo(moment(date).format('YYYY-MM-DD'))
                                            }}
                                        />
                                    </div>
                                    <div className="xl:mt-7">
                                        <Button variant="new" className="h-10 px-6 text-sm rounded-md" onClick={handleDateSubmit}>
                                            Apply Dates
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <FaFilter className="text-purple-500" />
                                Filter & Download
                            </h4>
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brands</label>
                                    <Select
                                        isClearable
                                        options={brands.brands}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id.toString()}
                                        className="xl:w-[600px] w-full"
                                        onChange={(val) => setBrandValue(val)}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        variant="new"
                                        disabled={isDownloading}
                                        icon={<FaDownload />}
                                        loading={isDownloading}
                                        onClick={handleDownload}
                                    >
                                        Download Report
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
                        <FaChevronUp className={`transition-transform duration-200 ${isActive ? 'rotate-180' : ''} text-gray-500`} />
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
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Export raw order and return data for specific companies
                                </p>
                            </div>
                        </div>
                    }
                    key="2"
                    className="mb-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 "
                >
                    <div className="space-y-6 pt-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            <div className=" mb-4 ">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FaBuilding className="text-orange-500" />
                                    Company Selection
                                </h4>
                                <p>Select a company to export their data</p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Company</label>
                                    <Select
                                        isClearable
                                        className="xl:w-[600px] w-full"
                                        options={companyList}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        value={companyList.find((option) => fieldValue.includes(option?.name)) || null}
                                        onChange={(newVal: any) => {
                                            setFieldValue([newVal.name])
                                            setCompanyData(newVal?.id)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

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
                                                ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                                                : 'border-red-100 hover:border-red-300 dark:border-red-800 hover:shadow-md'
                                        }`}
                                        onClick={handleReturnOrderItem}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                                    <FaDownload className="text-red-600 dark:text-red-300" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Return Order Item</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Export all return order items
                                                    </p>
                                                </div>
                                            </div>
                                            {isRowDumpReturnOrder && <Spinner size={18} color="red" />}
                                        </div>
                                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                            Download comprehensive return order data
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="text-green-600 font-medium">Note:</span> Click on a card to download the respective
                                    data export
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        )
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-800">
            <div className="flex flex-col gap-8">
                {DownloadMISUi()}
                {DownloadDumpUi()}
                {remitance.length > 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FaMoneyBillWave className="text-lg text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Weekly Remittance Summary</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Calculated from selected date range</p>
                            </div>
                        </div>
                        <div className="text-right text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-start mb-6">
                            TOTAL AMOUNT:{' '}
                            <span className="text-green-600 font-semibold ml-2 text-lg">
                                ₹{fullRemitanceResponse?.total_amount.toFixed(2)}
                            </span>
                        </div>
                        <div className=" rounded-xl border border-gray-200 dark:bg-slate-800 shadow-sm">
                            <Table className="min-w-full text-sm text-gray-800">
                                <THead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <Th key={header.id} className="px-4 py-3 text-left">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </Th>
                                            ))}
                                        </Tr>
                                    ))}
                                </THead>
                                <TBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <Tr key={row.id} className="hover:bg-gray-50 dark:bg-gray-800">
                                            {row.getVisibleCells().map((cell) => (
                                                <Td key={cell.id} className="px-4 py-3 dark:text-gray-300">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </Td>
                                            ))}
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <MdSearchOff className="text-red-600 dark:text-red-400 text-4xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Remittance Data Found</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    There is no remittance data available for the selected week
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Remitance
