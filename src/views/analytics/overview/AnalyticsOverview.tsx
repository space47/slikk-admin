/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { Button } from '@/components/ui'

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    // useGlobalFilter,
    PaginationState,
    Updater,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import AnalyticsOrderGraph from './analyticsOrderGraph/AnalyticsOrderGraph'
// import AnalyticsQuantityGraph from './AnalyticsOrderGraph/AnalyticsQuantityGraph'
import AnalyticsQuantityGraph from './analyticsOrderGraph/AnalyticsQuantityGraph'
import { FaDownload, FaFilter } from 'react-icons/fa'
import ImageMODAL from '@/common/ImageModal'
// import AnalyticsQuantityGraph from './AnalyticsQuantityGraph/AnalyticsQuantityGraph'
import AnalyticsOrderDrawer from './analyticsOrderDrawer/AnalyticsOrderDrawer'
import { IoMdDownload } from 'react-icons/io'

type SKU_DETAILS = {
    name: string
    mrp: number
    sp: number
    image: string
    total_quantity: number
    total_amount: number
}

type DATA_WISE_SALES = {
    total_quantity: number
    total_amount: number
}

type SalesData = {
    status: string
    total_quantity: number
    total_amount: number
    sku_wise_sales_data: {
        [sku: string]: SKU_DETAILS
    }
    date_wise_sales_data: {
        date: DATA_WISE_SALES
    }
}

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const AnalyticsOverview = () => {
    const [data, setData] = useState<SalesData>()

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [from, setFrom] = useState(moment().subtract(6, 'days').format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('YYYY-MM-DD'))
    const [showLastSevenDays, setShowLastSevenDays] = useState(true)
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState([])

    const [skuWiseDetails, setSkuWiseDetails] = useState<Array<{ key: string; value: SKU_DETAILS }>>([])
    const [datewisedetails, setDatewisedetails] = useState<Array<{ key: string; value: DATA_WISE_SALES }>>([])

    const [divisionArray, setDivisionArray] = useState([])
    const [categoryArray, setCategoryArray] = useState([])
    const [subCategoryArray, setSubCategoryArray] = useState([])
    const [brandArray, setBrandArray] = useState([])

    const [divisionList, setDivisionList] = useState<string[]>([])
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [typeFetch, setTypeFetch] = useState('')

    const [showDrawer, setShowDrawer] = useState(false)

    const fetchData = async (
        // page: number,
        // pageSize: number,
        from: string,
        to: string,
    ) => {
        try {
            setSkuWiseDetails([])
            setDatewisedetails([])

            const response = await axiosInstance.get(`/merchant/sales?from=${from}&to=${to}&${typeFetch}`)
            const data = response.data

            setData(data)

            console.log('ssssssssssssssss', data)
            const skuData = data.sku_wise_sales_data

            const dateWiseData = data.date_wise_sales_data

            console.log('SKUDATA', skuData, dateWiseData)
            const div = data.tags.division.map((item: any) => ({
                id: item,
                name: item,
                value: item,
            }))

            const cat = data.tags.category.map((item: any) => ({
                id: item,
                name: item,
                value: item,
            }))

            const sub = data.tags.subcategory.map((item: any) => ({
                id: item,
                name: item,
                value: item,
            }))
            const brnd = data.tags.brand.map((item: any) => ({
                id: item,
                name: item,
                value: item,
            }))

            setDivisionArray(div)
            setCategoryArray(cat)
            setSubCategoryArray(sub)
            setBrandArray(brnd)

            const skuDetailsArray = skuData
                ? Object.entries(skuData).map(([key, value]) => ({
                      key,
                      value,
                  }))
                : []

            setSkuWiseDetails(skuDetailsArray)

            const dateWIseDetailArray = Object.entries(dateWiseData).map(([key, value]) => ({
                key,
                value,
            }))

            setDatewisedetails(dateWIseDetailArray)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(from, to)
    }, [page, pageSize, selectedCompany.id, from, to, typeFetch])

    const columns = useMemo<ColumnDef<{ key: SKU_DETAILS; value: SKU_DETAILS }>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'key',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Name',
                accessorKey: 'value.name',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Size',
                accessorKey: 'value.size',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Color',
                accessorKey: 'value.color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'MRP',
                accessorKey: 'value.mrp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SP',
                accessorKey: 'value.sp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Total Quantity',
                accessorKey: 'value.total_quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Total Quantity',
                accessorKey: 'value.total_quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Total Amount',
                accessorKey: 'value.total_amount',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'value.image',
                cell: ({ getValue, row }) => (
                    <img
                        src={getValue().split(',')[0]}
                        alt="Image"
                        className="w-24 h-20 object-cover cursor-pointer"
                        onClick={() => handleOpenModal(row.original.value.image)}
                    />
                ),
            },
        ],
        [],
    )

    const handleOpenModal = (img: any) => {
        console.log('sdsds', img)
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const handleDownload = async () => {
        try {
            const response = await axiosInstance.get(`/merchant/sales?from=${from}&to=${to}&${typeFetch}&download=true`, {
                responseType: 'blob',
            })

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${selectedCompany.name}(${from} to ${to}).csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading the file:', error)
        }
    }

    const paginatedData = skuWiseDetails.slice((page - 1) * pageSize, page * pageSize)

    const table = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(skuWiseDetails.length / pageSize),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
            globalFilter,
        },
        onPaginationChange: (updater: Updater<PaginationState>) => {
            const newPagination = typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater

            setPage(newPagination.pageIndex + 1)
            setPageSize(newPagination.pageSize)
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }
    const handleFromChange = (date: Date | null) => {
        if (date) {
            setFrom(moment(date).format('YYYY-MM-DD'))
            setShowLastSevenDays(false)
        } else {
            setFrom(moment().format('YYYY-MM-DD'))
        }
    }

    const handleToChange = (date: Date | null) => {
        if (date) {
            setTo(moment(date).format('YYYY-MM-DD'))
        } else {
            setTo(moment().format('YYYY-MM-DD'))
        }
    }

    const handleDrawer = () => {
        setShowDrawer(true)
    }

    const handleCloseDrawer = () => {
        setShowDrawer(false)
    }

    const handleMultiSelect = (fieldName: string, selectedValues: any) => {
        if (fieldName === 'division') {
            setDivisionList(selectedValues)
        } else if (fieldName === 'category') {
            setCategoryList(selectedValues)
        } else if (fieldName === 'sub_category') {
            setSubCategoryList(selectedValues)
        } else if (fieldName === 'brand') {
            setBrandList(selectedValues)
        }
    }
    const handleApply = () => {
        let query = ''

        if (divisionList.length > 0) {
            const divisionIds = divisionList.map((item: any) => item.id).join(',')
            query += `division=${divisionIds}`
        }

        if (categoryList.length > 0) {
            const categoryIds = categoryList.map((item: any) => item.id).join(',')
            if (query) query += '&'
            query += `category=${categoryIds}`
        }

        if (subCategoryList.length > 0) {
            const subCategoryIds = subCategoryList.map((item: any) => item.id).join(',')
            if (query) query += '&'
            query += `subcategory=${subCategoryIds}`
        }
        if (brandList.length > 0) {
            const brandIds = brandList.map((item: any) => item.id).join(',')
            if (query) query += '&'
            query += `brand=${brandIds}`
        }

        setTypeFetch(query)
        setShowDrawer(false)
    }

    console.log('QUERY', typeFetch)

    const handleResetFilters = (resetForm: any) => {
        resetForm()
        // setDivisionList([])
        // setCategoryList([])
        // setSubCategoryList([])
        // setShowDrawer(false)
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col lg:flex-row justify-between mb-5 items-center gap-5">
                <div className="w-auto lg:w-1/2 flex flex-col  ">
                    <Button variant="new" onClick={handleDrawer} className="xl:w-1/2 w-auto flex gap-3 items-center justify-center">
                        {' '}
                        <FaFilter className="text-lg" /> <p>CATEGORY FILTER</p>
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-5 items-start lg:items-end">
                    <div>
                        <div className="mb-1 font-semibold text-sm">FROM DATE: {showLastSevenDays && '(Last 7 Days)'}</div>
                        <DatePicker
                            inputPrefix={<HiOutlineCalendar className="text-lg" />}
                            defaultValue={new Date()}
                            value={new Date(from)}
                            onChange={handleFromChange}
                        />
                    </div>
                    <div>
                        <div className="mb-1 font-semibold text-sm">TO DATE:</div>
                        <DatePicker
                            inputSuffix={<TbCalendarStats className="text-xl" />}
                            defaultValue={new Date()}
                            value={new Date(to)}
                            onChange={handleToChange}
                            minDate={moment(from).toDate()}
                        />
                    </div>
                    <div>
                        <div className="flex items-end justify-end">
                            <button
                                className="bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg flex xl:mt-5 "
                                onClick={handleDownload}
                            >
                                <IoMdDownload className="text-xl" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 justify-center mb-6">
                <div className="Total">
                    <span className="font-bold">TOTAL AMOUNT:</span>
                    <span className="italic">{data?.total_amount}</span>
                </div>
                <div className="total">
                    <span className="font-bold">TOTAL QUANTITY :</span>
                    <span className="italic">{data?.total_quantity}</span>
                </div>
            </div>

            <div className="mb-10 flex flex-col lg:flex-row gap-10 justify-center">
                <AnalyticsOrderGraph
                    data={datewisedetails.map((item) => ({
                        dateKey: item.key,
                        total_amount: item.value.total_amount,
                    }))}
                />
                <AnalyticsQuantityGraph
                    data={datewisedetails.map((item) => ({
                        dateKey: item.key,
                        total_quantity: item.value.total_quantity,
                    }))}
                />
            </div>

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
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

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={skuWiseDetails && skuWiseDetails.length}
                    onChange={onPaginationChange}
                />
                <div className="mt-3 sm:mt-0" style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
            {showDrawer && (
                <AnalyticsOrderDrawer
                    divisionArray={divisionArray}
                    categoryArray={categoryArray}
                    showDrawer={showDrawer}
                    subCategoryArray={subCategoryArray}
                    brandArray={brandArray}
                    handleApply={handleApply}
                    handleCloseDrawer={handleCloseDrawer}
                    handleMultiSelect={handleMultiSelect}
                    handleResetFilters={handleResetFilters}
                    division={divisionList}
                    category={categoryList}
                    sub_category={subCategoryList}
                    brand={brandList}
                    setSubCategoryList={setSubCategoryList}
                    setCategoryList={setCategoryList}
                    setDivisionList={setDivisionList}
                    setBrandList={setBrandList}
                    setTypeFetch={setTypeFetch}
                />
            )}

            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
        </div>
    )
}

export default AnalyticsOverview
