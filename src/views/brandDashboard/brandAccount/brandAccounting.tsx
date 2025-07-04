/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useEffect, useState, useMemo } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'
import DatePicker from '@/components/ui/DatePicker'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { Button, Spinner } from '@/components/ui'
import Table from '@/components/ui/Table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { FaDownload } from 'react-icons/fa'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { commonDownload } from '@/common/commonDownload'

const { Tr, Th, Td, THead, TBody } = Table

const BrandAccounting = () => {
    const [fullRemitanceRespone, setFullRemitanceResponse] = useState<any>()
    const [remitance, setRemitance] = useState([])
    const [from, setFrom] = useState(moment().startOf('month').format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [showOneMonthBack, setShowOneMonthBack] = useState(true)
    const [showSpinner, setShowSpinner] = useState(false)
    const [noData, setNoData] = useState(false)

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((state) => state.company.currCompany)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const fetchRemitance = async () => {
        try {
            setShowSpinner(true)

            const response = await axiosInstance.get(`/merchant/product/sales?brand=${selectedCompany?.name}&from=${from}&to=${to}`)
            const remitanceData = response.data?.data.items
            setShowSpinner(false)
            setFullRemitanceResponse(response.data?.data)
            setRemitance(remitanceData)
            if (remitanceData.length === 0) {
                setNoData(true)
            } else {
                setNoData(false)
            }
        } catch (error) {
            console.error('Error fetching remitance:', error)
            setShowSpinner(false)
        }
    }

    useEffect(() => {
        fetchRemitance()
    }, [selectedCompany])

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

    const handleDownload = async () => {
        try {
            const response = await axiosInstance.get(
                `/merchant/product/sales?from=${from}&to=${to}&download=true&brand=${selectedCompany?.name}`,
                {
                    responseType: 'blob',
                },
            )

            commonDownload(response, `${selectedCompany?.name}-${from}-to-${to}.csv`)
        } catch (error) {
            console.error('Error downloading CSV:', error)
        }
    }

    const columns = useMemo(
        () => [
            { header: 'Invoice Id', accessorKey: 'invoice_id' },
            { header: 'SKU', accessorKey: 'sku' },
            { header: 'Creation Date', accessorKey: 'create_date' },
            { header: 'Completed Date', accessorKey: 'complete_date' },
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

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    return (
        <div className="p-6 sm:p-8 lg:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <div className="flex flex-col gap-8">
                {/* Date Filters */}
                <div className="flex flex-col xl:flex-row xl:items-end gap-6  w-full">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                From Date {showOneMonthBack && <span className="text-xs text-gray-500">(Start of Month)</span>}
                            </label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600 dark:text-gray-400" />}
                                value={new Date(from)}
                                onChange={handleFromChange}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition"
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600 dark:text-gray-400" />}
                                value={new Date(to)}
                                onChange={handleToChange}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition"
                            />
                        </div>
                    </div>
                    <Button
                        variant="new"
                        className="mt-4 xl:mt-0 h-11 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition"
                        onClick={handleDateSubmit}
                    >
                        Submit
                    </Button>
                </div>

                <hr className="border-t border-gray-200 dark:border-gray-700" />
            </div>

            {/* Table Section */}
            <div className="mt-10">
                {remitance.length > 0 ? (
                    <div className="overflow-x-auto">
                        {/* Download Button */}
                        <div className="flex justify-end mb-4">
                            <Button
                                onClick={handleDownload}
                                variant="new"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-md transition"
                            >
                                <FaDownload className="text-lg" />
                                <span>Download</span>
                            </Button>
                        </div>

                        {/* Total Amount */}
                        <div className="mb-6 flex items-center gap-3">
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">TOTAL AMOUNT:</span>
                            <span className="text-lg font-bold text-green-600">
                                ₹{fullRemitanceRespone?.total_amount?.toFixed(2) ?? '0.00'}
                            </span>
                        </div>

                        {/* Table or No Data */}
                        {noData ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Data Available</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Try changing the date range</p>
                            </div>
                        ) : (
                            <Table className="min-w-full border-collapse">
                                <THead className="bg-gray-100 dark:bg-gray-800">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id} className="border-b border-gray-300 dark:border-gray-700">
                                            {headerGroup.headers.map((header) => (
                                                <Th
                                                    key={header.id}
                                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </Th>
                                            ))}
                                        </Tr>
                                    ))}
                                </THead>
                                <TBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <Tr
                                            key={row.id}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <Td key={cell.id} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </Td>
                                            ))}
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300">No Data</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No data available for the selected date range.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrandAccounting
