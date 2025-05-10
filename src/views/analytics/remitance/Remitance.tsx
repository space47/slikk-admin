/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'
import DatePicker from '@/components/ui/DatePicker'
import { useAppDispatch, useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { Select, Button } from '@/components/ui'
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
        <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="flex flex-col gap-6">
                {/* Section: Date Range & Brand Filter */}
                <div className="flex flex-col xl:flex-row gap-6 xl:justify-between items-center shadow-md p-4 rounded-md border border-gray-200">
                    <div className="flex flex-col xl:flex-row gap-6 ">
                        {/* From Date */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-sm text-gray-800">
                                From Date {showOneMonthBack && <span className="text-xs text-blue-500">(Start of Month)</span>}
                            </label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-500" />}
                                value={new Date(from)}
                                className="w-56 rounded-md border border-gray-300 focus:border-blue-500"
                                onChange={(date) => {
                                    if (date) {
                                        setFrom(moment(date).format('YYYY-MM-DD'))
                                        setShowOneMonthBack(false)
                                    }
                                }}
                            />
                        </div>

                        {/* To Date */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-sm text-gray-800">To Date</label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-500" />}
                                value={new Date(to)}
                                minDate={new Date(from)}
                                className="w-56 rounded-md border border-gray-300 focus:border-blue-500"
                                onChange={(date) => {
                                    if (date) {
                                        setTo(moment(date).format('YYYY-MM-DD'))
                                    }
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="xl:mt-7">
                            <Button variant="new" className="h-10" onClick={handleDateSubmit}>
                                Submit
                            </Button>
                        </div>
                    </div>

                    {/* Brand Select */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Brands</label>
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

                <hr className="my-4" />

                {/* Section: Downloads */}
                <div className="space-y-6">
                    <h5 className="text-lg font-semibold text-gray-900">Download Raw Dumps</h5>
                    <div className="flex flex-col xl:flex-row gap-6 xl:items-center xl:gap-12">
                        {/* Buttons */}
                        <div className="flex gap-4 mt-5">
                            <Button variant="new" onClick={handleOrderItem} disabled={isRowDumpOrder}>
                                <div className="flex gap-2 items-center">
                                    <span>Order Item</span>
                                    {isRowDumpOrder && <Spinner size={20} color="white" />}
                                </div>
                            </Button>

                            <Button variant="new" onClick={handleReturnOrderItem} disabled={isRowDumpReturnOrder}>
                                <div className="flex gap-2 items-center">
                                    <span>Return Order Item</span>
                                    {isRowDumpReturnOrder && <Spinner size={20} color="white" />}
                                </div>
                            </Button>
                        </div>

                        {/* Company Select */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-800">Select Company</label>
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

                {/* Section: Table */}
                {remitance.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-center">
                            <Button className="flex items-center gap-2" variant="new" onClick={handleDownload} disabled={isDownloading}>
                                <FaDownload className="text-xl" />
                                <span className="flex gap-1 items-center">
                                    Download {isDownloading && <Spinner size={20} color="white" />}
                                </span>
                            </Button>
                        </div>

                        <div className="text-right font-semibold text-gray-700">
                            TOTAL AMOUNT: <span className="text-green-600">₹{fullRemitanceRespone?.total_amount.toFixed(2)}</span>
                        </div>

                        <div className="overflow-x-auto rounded-md border border-gray-200">
                            <Table className="min-w-full text-sm text-gray-800">
                                <THead className="bg-gray-100">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <Th key={header.id} className="px-4 py-2 text-left">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </Th>
                                            ))}
                                        </Tr>
                                    ))}
                                </THead>
                                <TBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <Tr key={row.id} className="hover:bg-gray-50">
                                            {row.getVisibleCells().map((cell) => (
                                                <Td key={cell.id} className="px-4 py-2">
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
