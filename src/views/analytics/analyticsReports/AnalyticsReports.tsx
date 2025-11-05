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
import { FaDownload } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'
import { notification } from 'antd'
import { commonDownload } from '@/common/commonDownload'

const { Tr, Th, Td, THead, TBody } = Table

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
            const response = await axiosInstance.get(`/merchant/product/sales?from=${from}&to=${to}${brandData}`)
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

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg border dark:bg-slate-800 border-gray-100">
            <div className="flex flex-col gap-8">
                {/* Date Pickers Section */}
                <div className="flex flex-col xl:flex-row gap-6 xl:justify-between items-center p-5 rounded-xl border border-gray-200 dark:bg-gray-900 shadow-sm bg-gray-50">
                    <div className="flex flex-col xl:flex-row gap-4 xl:gap-10 items-start xl:items-center">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-800 dark:text-gray-300 ">
                                From Date <span className="text-xs text-gray-500">{showOneMonthBack ? '(Start of Month)' : ''}</span>
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
                        <Button
                            variant="new"
                            className="xl:mt-6 h-10 px-6 text-sm rounded-md shadow hover:shadow-md transition"
                            onClick={handleDateSubmit}
                        >
                            Submit
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-800 dark:text-gray-300">Brands</label>
                        <div className="flex flex-col xl:flex-row items-start gap-2">
                            <Select
                                options={brands.brands}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id.toString()}
                                onChange={handleBrandSelect}
                                className="w-[200px]"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-t border-gray-200" />

                {/* Raw Dump Section */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-800">Download Raw Dumps</h2>
                    <div className="flex flex-col xl:flex-row gap-4">
                        <Button variant="accept" onClick={handleOrderItem} disabled={isRowDumpOrder}>
                            <div className="flex gap-2 items-center">
                                <FaDownload /> <span>Order Item</span>
                                {isRowDumpOrder && <Spinner size={18} color="white" />}
                            </div>
                        </Button>

                        <Button variant="accept" onClick={handleReturnOrderItem} disabled={isRowDumpReturnOrder}>
                            <div className="flex gap-2 items-center">
                                <FaDownload /> <span>Return Order Item</span>
                                {isRowDumpReturnOrder && <Spinner size={18} color="white" />}
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                {remitance.length > 0 && (
                    <div className=" flex flex-col gap-4">
                        <div className="flex justify-end">
                            <Button
                                onClick={handleDownload}
                                variant="new"
                                className="flex items-center gap-2 px-5 h-10 rounded-md text-sm bg-green-600 text-white hover:bg-green-700 transition"
                                disabled={isDownloading}
                            >
                                <FaDownload className="text-lg" />
                                <span>Download {isDownloading && <Spinner size={18} color="white" />}</span>
                            </Button>
                        </div>

                        <div className="text-right font-semibold text-sm text-gray-700 dark:text-gray-300 ">
                            TOTAL AMOUNT: <span className="text-green-600">₹{fullRemitanceRespone?.total_amount.toFixed(2)}</span>
                        </div>

                        <div className="overflow-x-auto  rounded-xl shadow-sm">
                            <div className="font-bold text-xl mb-3">Remitance Table:</div>
                            <Table className="min-w-full text-sm">
                                <THead className="bg-gray-100">
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
                                        <Tr key={row.id} className="hover:bg-gray-50 transition">
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnalyticsReports
