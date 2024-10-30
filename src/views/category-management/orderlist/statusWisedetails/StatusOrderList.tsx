/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import type { FilterFn } from '@tanstack/react-table'
import type { OrderItem } from '../commontypes'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown } from '@/components/ui'
import { ORDER_STATUS } from '../commontypes'
import { IoMdDownload } from 'react-icons/io'
import { FaLocationDot } from 'react-icons/fa6'
import { FaMapMarkedAlt } from 'react-icons/fa'

interface Order {
    invoice_id: string
    create_date: string
    user: {
        name: string
        mobile: string
    }
    store: {
        address: string
        latitude: string
        longitude: string
    }
    rating: number
    amount: number
    payment: {
        mode: string
        amount: number
    }
    order_items: OrderItem[]
    status: string
    update_date: string
    from: string
    to: string
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]
interface DropdownStatus {
    value: string[]
    name: string[]
}

const StatusOrderList = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const location = useLocation()
    const [globalFilter, setGlobalFilter] = useState('')
    const [mobileFilter, setMobileFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState()
    const [dropdownStatus, setDropdownStatus] = useState<DropdownStatus>({
        value: [],
        name: [],
    })
    const { var1, var2 } = location.state || {}

    const fetchOrders = async (page: number, pageSize: number, from: string, to: string) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`

            let response

            if (globalFilter) {
                response = await axiosInstance.get(`/merchant/orders?invoice_id=${globalFilter}&status=COMPLETED`)
            } else if (mobileFilter) {
                response = await axiosInstance.get(
                    `/merchant/orders?mobile=${mobileFilter}&status=COMPLETED&p=${page}&page_size=${pageSize}`,
                )

                const totalOrders = response.data?.data.count
                setPageSize(totalOrders)
                setPage(1)
            } else {
                response = await axiosInstance.get(`/merchant/orders?p=${page}&page_size=${pageSize}&status=COMPLETED`)
            }

            const ordersData = response.data?.data.results
            const orderCount = response.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrders(page, pageSize, from, to)
    }, [page, pageSize, from, to, dropdownStatus, mobileFilter, globalFilter])

    useEffect(() => {
        if (!mobileFilter) {
            setPageSize(10)
        }
    }, [mobileFilter])

    const columns = useMemo(
        () => [
            {
                header: 'Invoice Id',
                accessorKey: 'invoice_id',
                cell: ({ getValue }) => {
                    return (
                        <a
                            href={`/app/orders/${getValue()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                            // onClick={() => handleInvoiceClick(getValue() as string)}
                        >
                            {getValue()}
                        </a>
                    )
                },
            },
            {
                header: 'Order Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            { header: 'Mobile Number', accessorKey: 'user.mobile' },
            { header: 'Customer Name', accessorKey: 'user.name' },
            { header: 'Delivery Type', accessorKey: 'delivery_type' },
            // { header: 'Store Address', accessorKey: 'store.address' },
            {
                header: 'Customer Address',
                accessorKey: 'location_url',
                cell: ({ getValue }) => (
                    <a href={getValue()} target="_blank" rel="noreferrer">
                        <div className="flex justify-center">
                            <FaMapMarkedAlt className="text-xl" />
                        </div>
                    </a>
                ),
            },
            { header: 'Rating', accessorKey: 'rating' },
            { header: 'Payment Mode', accessorKey: 'payment.mode' },
            { header: 'Payment Status', accessorKey: 'payment.status' },
            { header: 'Total Items', accessorKey: 'order_items.length' },
            { header: 'Order Total', accessorKey: 'payment.amount' },
            { header: 'Status', accessorKey: 'status' },
            {
                header: 'Last Update',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [],
    )

    const table = useReactTable({
        data: orders,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            globalFilter: globalFilter,
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
        },
        onGlobalFilterChange: setMobileFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(orderCount ?? 0 / pageSize),
    })

    const handleInvoiceClick = (invoiceId: string) => {
        navigate(`/app/orders/${invoiceId}`)
    }
    console.log('STATUS', dropdownStatus.value.length)

    const handleDownload = async () => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`

            let searwiseDownload = ''

            if (globalFilter) {
                searwiseDownload = `&invoice_id=${globalFilter}`
            } else if (mobileFilter) {
                searwiseDownload = `&mobile=${mobileFilter}`
            }

            const downloadUrl = `merchant/orders?download=true${searwiseDownload}&status=COMPLETED`

            const response = await axiosInstance.get(downloadUrl, {
                responseType: 'blob',
            })

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = 'OrderDetails.csv'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading the file:', error)
        }
    }

    const onPaginationChange = (page: number) => {
        setPage(page)

        console.log('sssssssssssssssssssss', page)
        // setPageSize(pageSize)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleFromChange = (date: Date | null) => {
        if (date) {
            setFrom(moment(date).format('YYYY-MM-DD'))
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

    const handleDropdownSelect = (selectedValue: string) => {
        setDropdownStatus((prevStatus) => {
            const isSelected = prevStatus.value.includes(selectedValue)

            const updatedValue = isSelected ? prevStatus.value.filter((val) => val !== selectedValue) : [...prevStatus.value, selectedValue]

            const updatedName = isSelected
                ? prevStatus.name.filter((name) => name !== ORDER_STATUS.find((item) => item.value === selectedValue)?.name)
                : [...prevStatus.name, ORDER_STATUS.find((item) => item.value === selectedValue)?.name || '']

            return {
                value: updatedValue,
                name: updatedName,
            }
        })
    }
    console.log('ssssssswddwdwdw', dropdownStatus)

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <div className="flex flex-col lg:flex-row justify-between mb-6 items-center xl:gap-14">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="mb-4 lg:mb-0">
                            <div className="text-sm md:text-base">SEARCH BY INVOICE_ID</div>
                            <input
                                type="text"
                                placeholder="Search here"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="p-2 border rounded mt-1 w-full"
                            />
                        </div>

                        <div className="mb-4 lg:mb-0">
                            <div className="text-sm md:text-base">SEARCH BY MOBILE</div>
                            <input
                                type="text"
                                placeholder="Search through mobile"
                                value={mobileFilter}
                                onChange={(e) => setMobileFilter(e.target.value)}
                                className="p-2 border rounded mt-1 w-full"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mt-4 lg:mt-0">
                        {/* <div className="flex flex-col lg:flex-row gap-6">
                            <div>
                                <div className="mb-1 font-semibold text-xs md:text-sm">FROM DATE:</div>
                                <DatePicker
                                    inputPrefix={<HiOutlineCalendar className="text-base md:text-lg" />}
                                    defaultValue={new Date()}
                                    value={new Date(from)}
                                    onChange={handleFromChange}
                                    className="w-[240px]"
                                />
                            </div>
                            <div>
                                <div className="mb-1 font-semibold text-xs md:text-sm">TO DATE:</div>
                                <DatePicker
                                    inputSuffix={<TbCalendarStats className="text-base md:text-xl" />}
                                    defaultValue={new Date()}
                                    value={moment(to).toDate()}
                                    onChange={handleToChange}
                                    minDate={moment(from).toDate()}
                                    className="w-[240px]"
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
                <br />

                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <Sorter sort={header.column.getIsSorted()} />
                                            </div>
                                        )}
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

                <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                    <Pagination
                        pageSize={pageSize}
                        currentPage={page}
                        total={orderCount}
                        onChange={onPaginationChange}
                        className="mb-4 md:mb-0"
                    />
                    <div className="min-w-[130px] flex gap-5">
                        <Select
                            size="sm"
                            isSearchable={true}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => onSelectChange(option?.value)}
                            className="w-full"
                        />

                        <div className="flex flex-col md:flex-row items-end justify-end mb-4">
                            <button
                                className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200 rounded-lg mb-2 md:mb-0 md:mr-2"
                                onClick={handleDownload}
                            >
                                <IoMdDownload className="text-xl md:text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusOrderList

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
