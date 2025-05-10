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
            const brandData = brandValue ? `&brand=${brandValue?.name}` : ''
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
            const brandData = brandValue ? `&brand=${brandValue?.name}` : ''
            const response = await axiosInstance.get(`/merchant/product/sales?from=${from}&to=${to}${brandData}&download=true`, {
                responseType: 'blob',
            })

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${brandValue?.name || 'All-Brands'}-${from}-to-${to}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
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
            const brandData = brandValue ? `&brand_name=${brandValue?.name}` : ''
            const response = await axiosInstance.get(
                `/merchant/order_items?download=true&download_type=master&from=${from}&to=${to}${brandData}`,
                {
                    responseType: 'blob',
                },
            )
            const contentType = response.headers['content-type']

            if (contentType === 'text/csv') {
                const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = urlToBeDownloaded
                link.download = `${brandValue?.name || 'OrderItems'}-${from}-to-${to}.csv`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                notification.success({
                    message: response?.data?.message || 'CSV file downloaded successfully',
                })
            }
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
            const brandData = brandValue ? `&brand_name=${brandValue?.name}` : ''
            const response = await axiosInstance.get(
                `/merchant/return_order_items?download=true&download_type=master&from=${from}&to=${to}${brandData}`,
                {
                    responseType: 'blob',
                },
            )
            const contentType = response.headers['content-type']
            if (contentType === 'text/csv') {
                const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = urlToBeDownloaded
                link.download = `${brandValue?.name || 'ReturnOrderItems'}-${from}-to-${to}.csv`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                notification.success({
                    message: response?.data?.message || 'CSV file downloaded successfully',
                })
            }
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

    // const onPaginationChange = (page: number) => {
    //     setPage(page)
    // }
    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="flex flex-col   gap-6">
                {/* Date Pickers Section */}
                <div className="flex flex-col xl:flex-row gap-4  xl:justify-between items-center shadow-md p-4 rounded-md border border-gray-200 ">
                    <div className="flex flex-col xl:flex-row gap-3  xl:gap-8">
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-sm text-gray-700">
                                From Date: {showOneMonthBack ? '(Start of Month)' : ''}
                            </label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600" />}
                                value={new Date(from)}
                                onChange={handleFromChange}
                                className="w-56 rounded-md border-gray-300 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-sm text-gray-700">To Date:</label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600" />}
                                value={new Date(to)}
                                onChange={handleToChange}
                                minDate={new Date(from)}
                                className="w-56 rounded-md border-gray-300 focus:border-blue-500"
                            />
                        </div>
                        <Button variant="new" className="h-1/2 xl:mt-7" onClick={handleDateSubmit}>
                            Submit
                        </Button>
                    </div>

                    {/*  */}
                    <div className="flex items-center gap-8">
                        <div className="flex xl:flex-col flex-row gap-2 xl:items-start items-center">
                            <label className="mb-2 font-semibold text-sm text-gray-700">Brands:</label>
                            <Select
                                options={brands.brands}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id.toString()}
                                onChange={handleBrandSelect}
                                className="w-[200px] items-center"
                            />
                        </div>
                    </div>
                </div>

                {/* Row Dumps....... */}
                <hr />
                <div>
                    <h5>Download Raw Dumps:</h5> <br />
                    <div className="flex flex-col gap-4 xl:flex-row">
                        <div className="xl:mt-7">
                            <Button variant="new" onClick={handleOrderItem} disabled={isRowDumpOrder}>
                                <div className="flex gap-2 items-center">
                                    <span> Order Item </span> <span> {isRowDumpOrder && <Spinner size={20} color="white" />}</span>
                                </div>
                            </Button>
                        </div>
                        <div className="xl:mt-7">
                            <Button variant="new" onClick={handleReturnOrderItem} disabled={isRowDumpReturnOrder}>
                                <div className="flex gap-2 items-center">
                                    <span>Return Order Item </span>{' '}
                                    <span> {isRowDumpReturnOrder && <Spinner size={20} color="white" />}</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <br />

            {/* Conditionally Render Table Section */}
            <div className="flex flex-col">
                {remitance.length > 0 ? (
                    <div className="overflow-x-auto mt-6">
                        <div className="flex justify-center items-center mt-5">
                            <Button onClick={handleDownload} variant="new" className="justify-center gap-2 flex" disabled={isDownloading}>
                                <FaDownload className="text-xl" />{' '}
                                <span className="flex gap-1 items-center">
                                    Download {isDownloading && <Spinner size={20} color="white" />}
                                </span>
                            </Button>
                        </div>
                        <div className="text-right font-semibold text-gray-700 mb-2">
                            TOTAL AMOUNT: <span className="text-green-600">₹{fullRemitanceRespone?.total_amount.toFixed(2)}</span>
                        </div>
                        <Table className="min-w-full">
                            <THead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <Th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</Th>
                                        ))}
                                    </Tr>
                                ))}
                            </THead>
                            <TBody>
                                {table.getRowModel().rows.map((row) => (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                                        ))}
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    )
}

export default AnalyticsReports
