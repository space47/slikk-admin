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

    console.log('Company names', selectedCompany?.name)

    const fetchRemitance = async () => {
        try {
            setShowSpinner(true)
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/merchant/product/sales?brand=${selectedCompany?.name}&from=${from}&to=${To_Date}`)
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
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(
                `/merchant/product/sales?from=${from}&to=${To_Date}&download=true&brand=${selectedCompany?.name}`,
                {
                    responseType: 'blob',
                },
            )

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${selectedCompany?.name}-${from}-to-${to}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
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
        <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <div className="flex flex-col gap-6">
                {/* Date Pickers Section */}
                <div className="flex flex-col xl:flex-row gap-4 xl:justify-between items-center">
                    <div className="flex flex-col xl:flex-row gap-3 xl:gap-8 w-full">
                        <div className="flex gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300">
                                    From Date: {showOneMonthBack ? '(Start of Month)' : ''}
                                </label>
                                <DatePicker
                                    inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600 dark:text-gray-400" />}
                                    value={new Date(from)}
                                    onChange={handleFromChange}
                                    className="w-full sm:w-56 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                                />
                            </div>
                            <div className="flex flex-col flex-1 ">
                                <label className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300">To Date:</label>
                                <DatePicker
                                    inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600 dark:text-gray-400" />}
                                    value={new Date(to)}
                                    onChange={handleToChange}
                                    // minDate={new Date(from)}
                                    className="w-full sm:w-56 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <div>
                                <Button
                                    variant="new"
                                    className="mt-2 sm:mt-0 h-full px-4 py-2 rounded-md shadow hover:shadow-lg transition duration-150"
                                    onClick={handleDateSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />
            </div>

            <div className="mt-8">
                {/* Conditionally Render Table Section */}
                {remitance.length && remitance.length > 0 ? (
                    <div className="overflow-x-auto mt-6">
                        <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-4">
                            <Button
                                onClick={handleDownload}
                                variant="new"
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md shadow hover:shadow-lg transition duration-150"
                            >
                                <FaDownload className="text-xl" /> <span>Download</span>
                            </Button>
                        </div>
                        <div className="mb-3 flex flex-wrap items-center gap-2 mt-4">
                            <span className="font-bold text-xl text-gray-800 dark:text-gray-200">TOTAL AMOUNT:</span>
                            <span className="text-xl text-green-500">
                                {fullRemitanceRespone?.total_amount ? fullRemitanceRespone.total_amount.toFixed(2) : 0}
                            </span>
                        </div>
                        {noData ? (
                            <div className="flex flex-col gap-1 justify-center items-center h-64">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Data Available</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Try changing the date</p>
                            </div>
                        ) : (
                            <Table className="min-w-full border-collapse">
                                <THead className="bg-gray-100 dark:bg-gray-800">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                                            {headerGroup.headers.map((header) => (
                                                <Th
                                                    key={header.id}
                                                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
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
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <Td key={cell.id} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
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
                    <div className="h-full flex flex-col items-center justify-center py-20">
                        <div className="mt-6 text-center">
                            <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-300">No Data</h3>
                            <p className="text-base text-gray-500 dark:text-gray-400">No Data available for the current Date</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrandAccounting
