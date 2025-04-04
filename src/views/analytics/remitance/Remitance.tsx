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
    const ToDate = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [isDownloading, setIsDownloading] = useState(false)

    const { fetchRemitanceApi, handleDownload, handleOrderItem, handleReturnOrderItem } = RemitanceApis({
        brandValue,
        from,
        ToDate,
        setRemitance,
        setFullRemitanceResponse,
        setAccessDenied,
        companyData,
        setIsDownloading,
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
                                className="w-56 rounded-md border-gray-300 focus:border-blue-500"
                                onChange={(date) => {
                                    if (date) {
                                        setFrom(moment(date).format('YYYY-MM-DD'))
                                        setShowOneMonthBack(false)
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-sm text-gray-700">To Date:</label>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600" />}
                                value={new Date(to)}
                                minDate={new Date(from)}
                                className="w-56 rounded-md border-gray-300 focus:border-blue-500"
                                onChange={(date) => {
                                    if (date) {
                                        setTo(moment(date).format('YYYY-MM-DD'))
                                    }
                                }}
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
                                isClearable
                                options={brands.brands}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id.toString()}
                                className="w-[200px] items-center"
                                onChange={(val) => setBrandValue(val)}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div>
                    <h5>Dowmload Raw Dumps:</h5> <br />
                    <div className="flex flex-col xl:flex-row gap-4 xl:gap-10">
                        <div className="xl:mt-7">
                            <Button variant="new" onClick={handleOrderItem}>
                                Order Item
                            </Button>
                        </div>
                        <div className="xl:mt-7">
                            <Button variant="new" onClick={handleReturnOrderItem}>
                                Return Order Item
                            </Button>
                        </div>
                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                            <div className="font-semibold">Select Company</div>
                            <div className="flex gap-2 items-center w-auto xl:w-[200px]">
                                <Select
                                    isClearable
                                    className="w-full"
                                    options={companyList}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    value={companyList.filter((option) => fieldValue.includes(option?.name)) || []}
                                    onChange={(newVal: any) => {
                                        setFieldValue([newVal.name])
                                        setCompanyData(newVal?.id)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div className="flex flex-col">
                {remitance.length > 0 ? (
                    <div className="overflow-x-auto mt-6">
                        <div className="flex justify-center items-center mt-5">
                            <Button className="justify-center gap-2 flex" variant="new" onClick={handleDownload} disabled={isDownloading}>
                                <FaDownload className="text-xl" />{' '}
                                <span className="flex gap-1 items-center">
                                    Download {isDownloading && <Spinner size={20} color="white" />}
                                </span>
                            </Button>
                        </div>
                        <div className="mb-3 flex gap-2">
                            <span className="font-bold">TOTAL AMOUNT:</span> {fullRemitanceRespone?.total_amount.toFixed(2)}{' '}
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

export default Remitance
