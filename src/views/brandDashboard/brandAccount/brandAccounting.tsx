import moment from 'moment'
import React, { useEffect, useState, useMemo } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'
import DatePicker from '@/components/ui/DatePicker'
import { useAppDispatch, useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { Select, Button, Pagination } from '@/components/ui'
import Table from '@/components/ui/Table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Item, REMITANCE } from '@/store/types/remitance.types'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { FaDownload } from 'react-icons/fa'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { DoubleSidedImage } from '@/components/shared'

const { Tr, Th, Td, THead, TBody } = Table

const BrandAccounting = () => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [fullRemitanceRespone, setFullRemitanceResponse] = useState<REMITANCE>()
    const [remitance, setRemitance] = useState<Item[]>([])
    const [from, setFrom] = useState(moment().startOf('month').format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [showOneMonthBack, setShowOneMonthBack] = useState(true)
    const [brandValue, setBrandValue] = useState<any | null>(null)
    // const [page, setPage] = useState(1)
    // const [pageSize, setPageSize] = useState(10)

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const fetchRemitance = async () => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/merchant/product/sales?from=${from}&to=${To_Date}`)
            const remitanceData = response.data?.data.items
            setFullRemitanceResponse(response.data?.data)
            setRemitance(remitanceData)
        } catch (error) {
            console.error('Error fetching remitance:', error)
        }
    }

    useEffect(() => {
        fetchRemitance()
    }, [from, to])

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
            const response = await axiosInstance.get(`/merchant/product/sales?from=${from}&to=${To_Date}&download=true`, {
                responseType: 'blob',
            })

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `Brands'-${from}-to-${to}.csv`
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

    return (
        <div className="p-6 ">
            <div className="flex flex-col   gap-6">
                {/* Date Pickers Section */}
                <div className="flex flex-col xl:flex-row gap-4  xl:justify-between items-center ">
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
                    </div>

                    {/*  */}
                </div>

                {/* Row Dumps....... */}
                <hr />
            </div>
            <br />
            <br />

            {/* Conditionally Render Table Section */}
            <div className="flex flex-col">
                {remitance.length > 0 ? (
                    <div className="overflow-x-auto mt-6">
                        <div className="flex justify-end items-center mt-5">
                            <Button onClick={handleDownload} variant="new" className="justify-center gap-2 flex">
                                <FaDownload className="text-xl" /> Download
                            </Button>
                        </div>
                        <div className="mb-3 flex gap-2">
                            {' '}
                            <span className="font-bold">TOTAL AMOUNT:</span> {fullRemitanceRespone?.total_amount}{' '}
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
                    <div>
                        <div className="h-full flex flex-col items-center justify-center">
                            <DoubleSidedImage src="/img/others/img-2.png" darkModeSrc="/img/others/img-2-dark.png" alt="Access Denied!" />
                            <div className="mt-6 text-center">
                                <h3 className="mb-2">No Data</h3>
                                <p className="text-base">No Data available for the current Date</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrandAccounting
