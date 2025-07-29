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
import { FaDownload } from 'react-icons/fa'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import AccessDenied from '@/views/pages/AccessDenied'
import { RemitanceColumns } from './remitanceUtils/RemitanceColumns'
import RemitanceApis from './remitanceUtils/RemitanceApiCalls'

const { Tr, Th, Td, THead, TBody } = Table

const Remitance = () => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [fullRemitanceRespone, setFullRemitanceResponse] = useState<REMITANCE>()
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
    // const ToDate = moment(to).format('YYYY-MM-DD')
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

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-800">
            <div className="flex flex-col gap-8">
                {/* Date & Brand Filter Section */}
                <div className="flex flex-col xl:flex-row gap-6 xl:justify-between items-start xl:items-center bg-gray-50 p-5 rounded-xl border dark:bg-gray-900 border-gray-200 shadow-sm">
                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* From Date */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                From Date {showOneMonthBack && <span className="text-xs text-blue-500">(Start of Month)</span>}
                            </label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-500" />}
                                value={new Date(from)}
                                onChange={(date) => {
                                    if (date) {
                                        setFrom(moment(date).format('YYYY-MM-DD'))
                                        setShowOneMonthBack(false)
                                    }
                                }}
                                className="w-56 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* To Date */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-500" />}
                                value={new Date(to)}
                                minDate={new Date(from)}
                                onChange={(date) => {
                                    if (date) setTo(moment(date).format('YYYY-MM-DD'))
                                }}
                                className="w-56 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Submit */}
                        <div className="xl:mt-7">
                            <Button variant="new" className="h-10 px-6 text-sm rounded-md" onClick={handleDateSubmit}>
                                Submit
                            </Button>
                        </div>
                    </div>

                    {/* Brand Select */}
                    <div className="flex flex-col gap-1 w-full xl:w-auto">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brands</label>
                        <Select
                            isClearable
                            options={brands.brands}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id.toString()}
                            className="w-52"
                            onChange={(val) => setBrandValue(val)}
                        />
                    </div>
                </div>

                <hr className="border-t border-gray-200" />

                {/* Downloads Section */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800">Download Raw Dumps</h2>

                    <div className="flex flex-col xl:flex-row gap-8 xl:items-end">
                        <div className="flex gap-4">
                            <Button variant="accept" onClick={handleOrderItem} disabled={isRowDumpOrder}>
                                <div className="flex items-center gap-2">
                                    <FaDownload /> <span>Order Item</span>
                                    {isRowDumpOrder && <Spinner size={20} color="white" />}
                                </div>
                            </Button>
                            <Button variant="accept" onClick={handleReturnOrderItem} disabled={isRowDumpReturnOrder}>
                                <div className="flex items-center gap-2">
                                    <FaDownload /> <span>Return Order Item</span>
                                    {isRowDumpReturnOrder && <Spinner size={20} color="white" />}
                                </div>
                            </Button>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Company</label>
                            <Select
                                isClearable
                                className="w-60"
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

                {/* Table Section */}
                {remitance.length > 0 && (
                    <div className="mt-8 space-y-5">
                        <div className="font-bold text-xl mb-3">Remitance Table:</div>
                        {/* Download Button */}
                        <div className="flex justify-end">
                            <Button
                                variant="new"
                                className="flex items-center gap-2 px-5 py-2 text-sm rounded-md"
                                onClick={handleDownload}
                                disabled={isDownloading}
                            >
                                <FaDownload className="text-lg" />
                                <span className="flex gap-1 items-center">
                                    Download {isDownloading && <Spinner size={20} color="white" />}
                                </span>
                            </Button>
                        </div>

                        {/* Total Amount */}
                        <div className="text-right text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-start">
                            TOTAL AMOUNT:{' '}
                            <span className="text-green-600 font-semibold">₹{fullRemitanceRespone?.total_amount.toFixed(2)}</span>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:bg-slate-800 shadow-sm">
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
                )}
            </div>
        </div>
    )
}

export default Remitance
