/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import type { Order, OrderItem } from './commontypes'
import { Button, Dropdown } from '@/components/ui'
import { ORDER_STATUS } from './commontypes'
import { IoMdDownload } from 'react-icons/io'
import { FaExclamationCircle, FaFilter, FaMapMarkedAlt } from 'react-icons/fa'
import FilterDialogOrder from './filterDialog/FilterDialog'
import { CiFilter } from 'react-icons/ci'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import NotificationSound from '@/common/orderNotification'
import PendingNotification from '@/common/pendingNotification'

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

const SEARCHOPTIONS = [
    { label: 'INVOICE', value: 'invoice' },
    { label: 'MOBILE', value: 'mobile' },
]

export const DELEIVERYOPTIONS = [
    { label: 'Express', value: 'EXPRESS' },
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Try&Buy', value: 'TRY_AND_BUY' },
]

export const PAYMENTOPTIONS = [
    { label: 'COD', value: 'COD' },
    { label: 'ONLINE', value: 'ONLINE' },
    { label: 'POD', value: 'POD' },
]

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [deliveryType, setDeliveryType] = useState<DropdownStatus>({
        value: [],
        name: [],
    })
    const [paymentType, setPaymentType] = useState<DropdownStatus>({
        value: [],
        name: [],
    })
    const [searchInput, setSearchInput] = useState<string>('')
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
    const [showFilter, setShowFilter] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(false)
    const [pendingSound, setPendingSound] = useState(false)
    const [numberClick, setNumberClick] = useState(false)

    const previousOrders = useRef<Order[]>([])

    const fetchOrders = async (page: number, pageSize: number, from: string, to: string) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value?.length === 0 ? '' : `&status=${dropdownStatus?.value}`

            let response
            let deliveryStatus = ''
            let paymentStatus = ''

            if (deliveryType?.value && deliveryType?.value?.length > 0) {
                deliveryStatus = `&delivery_type=${deliveryType?.value}`
            }

            if (paymentType?.value && paymentType?.value.length > 0) {
                paymentStatus = `&payment_mode=${paymentType?.value}`
            }

            if (currentSelectedPage.value === 'invoice' && searchInput) {
                response = await axiosInstance.get(`/merchant/orders?invoice_id=${searchInput}${status}${deliveryStatus}${paymentStatus}`)
            } else if (currentSelectedPage.value === 'mobile' && searchInput) {
                response = await axiosInstance.get(`/merchant/orders?mobile=${searchInput}${status}${deliveryStatus}${paymentStatus}`)
            } else {
                response = await axiosInstance.get(
                    `/merchant/orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${status}${deliveryStatus}${paymentStatus}`,
                )
            }

            const ordersData = response.data?.data.results
            const orderCount = response.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        }
    }

    const checkingNewOrders = async (page: number, pageSize: number, from: string, to: string) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value?.length === 0 ? '' : `&status=${dropdownStatus?.value}`

            let response
            let deliveryStatus = ''
            let paymentStatus = ''

            if (deliveryType?.value && deliveryType?.value?.length > 0) {
                deliveryStatus = `&delivery_type=${deliveryType?.value}`
            }

            if (paymentType?.value && paymentType?.value.length > 0) {
                paymentStatus = `&payment_mode=${paymentType?.value}`
            }

            if (currentSelectedPage.value === 'invoice' && searchInput) {
                response = await axiosInstance.get(`/merchant/orders?invoice_id=${searchInput}${status}${deliveryStatus}${paymentStatus}`)
            } else if (currentSelectedPage.value === 'mobile' && searchInput) {
                response = await axiosInstance.get(`/merchant/orders?mobile=${searchInput}${status}${deliveryStatus}${paymentStatus}`)
            } else {
                response = await axiosInstance.get(
                    `/merchant/orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${status}${deliveryStatus}${paymentStatus}`,
                )
            }

            const ordersData = response.data?.data.results
            const orderCount = response.data?.data.count

            if (previousOrders.current.length > 0) {
                const newOrderExists = ordersData.some(
                    (newOrder) => !previousOrders.current.some((oldOrder) => oldOrder.invoice_id === newOrder.invoice_id),
                )

                if (newOrderExists) {
                    setSoundEnabled(true)
                }
            }

            previousOrders.current = ordersData

            setOrders(ordersData)
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        // Check if numberClick is false before fetching orders
        if (!numberClick) {
            fetchOrders(page, pageSize, from, to)
        }

        const noFilters =
            page === 1 &&
            !dropdownStatus.value.length &&
            !searchInput &&
            !deliveryType.value.length &&
            !paymentType.value.length &&
            numberClick === false // Ensure the interval only runs when numberClick is false

        if (noFilters) {
            const interval = setInterval(() => {
                fetchOrders(page, pageSize, from, to)
                checkingNewOrders(page, pageSize, from, to)
            }, 30000)

            return () => clearInterval(interval)
        }
    }, [page, pageSize, from, to, dropdownStatus, searchInput, deliveryType, paymentType, numberClick, previousOrders])

    useEffect(() => {
        checkingNewOrders(page, pageSize, from, to)

        const noFilters =
            page !== 1 &&
            !dropdownStatus.value.length &&
            !searchInput &&
            !deliveryType.value.length &&
            !paymentType.value.length &&
            numberClick === false

        if (noFilters) {
            const interval = setInterval(() => {
                checkingNewOrders(page, pageSize, from, to)
            }, 30000)

            return () => clearInterval(interval)
        }
    }, [previousOrders])

    useEffect(() => {
        if (soundEnabled) {
            setTimeout(() => setSoundEnabled(false), 5000)
        }
        if (pendingSound) {
            setTimeout(() => setPendingSound(false), 5000)
        }
    }, [soundEnabled, pendingSound])

    const handleNumberClick = async (number) => {
        try {
            const response = await axiosInstance.get(`/merchant/orders?mobile=${number}&page_size=100`)

            const data = response.data.data

            setOrders(data.results)
            setOrderCount(data.count)
            setNumberClick(true) // Set numberClick to true to stop interval and fetchOrders
        } catch (error) {
            console.error(error)
        }
    }

    console.log('OKONUMBER', numberClick)

    const columns = useMemo(
        () => [
            {
                header: 'Invoice Id',
                accessorKey: 'invoice_id',
                cell: ({ getValue, row }) => {
                    const createDate = moment(row.original.create_date)
                    const currentDate = moment()
                    const differenceInSeconds = currentDate.diff(createDate, 'seconds')
                    console.log(`opoop-${row.original.id}`, differenceInSeconds)

                    if (row.original.status === 'PENDING' && differenceInSeconds > 120) {
                        setPendingSound(true)
                        setTimeout(() => setPendingSound(false), 5000)
                    }

                    return (
                        <div className="flex items-center gap-3">
                            <a
                                href={`/app/orders/${getValue()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                            >
                                {getValue()}
                            </a>
                            {row.original.status === 'PENDING' && differenceInSeconds > 60 && (
                                <div className="flex items-center justify-center mt-2">
                                    <FaExclamationCircle className="text-red-600 text-xl" />
                                </div>
                            )}
                        </div>
                    )
                },
            },

            {
                header: 'Order Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Mobile Number',
                accessorKey: 'user.mobile',
                cell: ({ getValue, row }) => {
                    const orderCount = row.original.user_order_count
                    return (
                        <>
                            {orderCount > 1 ? (
                                <div className="text-green-500 cursor-pointer" onClick={() => handleNumberClick(getValue())}>
                                    {getValue()}
                                </div>
                            ) : (
                                <>
                                    <div>{getValue()}</div>
                                </>
                            )}
                        </>
                    )
                },
            },
            { header: 'Order Count', accessorKey: 'user_order_count' },
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

    const handleDownload = async () => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`

            let deliveryStatus = ''
            let paymentStatus = ''

            if (deliveryType?.value && deliveryType?.value.length > 0) {
                deliveryStatus = `&delivery_type=${deliveryType?.value}`
            }

            if (paymentType?.value && paymentType?.value.length > 0) {
                paymentStatus = `&payment_mode=${paymentType?.value}`
            }

            let searwiseDownload = ''

            if (currentSelectedPage.value === 'invoice' && searchInput) {
                searwiseDownload = `&invoice_id=${searchInput}`
            } else if (currentSelectedPage.value === 'mobile' && searchInput) {
                searwiseDownload = `&mobile=${searchInput}`
            }

            const downloadUrl = `merchant/orders?download=true${searwiseDownload}${status}&from=${from}&to=${To_Date}${deliveryStatus}${paymentStatus}`

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
    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }

    const handleDeliverySelect = (selectedValue: string) => {
        if (deliveryType.value.includes(selectedValue)) {
            setDeliveryType((prevState) => ({
                ...prevState,
                value: prevState.value.filter((item) => item !== selectedValue),
            }))
        } else {
            setDeliveryType((prevState) => ({
                ...prevState,
                value: [...prevState.value, selectedValue],
            }))
        }
    }

    const handlePaymentSelect = (selectedValue: string) => {
        if (paymentType.value.includes(selectedValue)) {
            setPaymentType((prevState) => ({
                ...prevState,
                value: prevState.value.filter((item) => item !== selectedValue),
            }))
        } else {
            setPaymentType((prevState) => ({
                ...prevState,
                value: [...prevState.value, selectedValue],
            }))
        }
    }

    const handleDropdownSelect = (selectedValue: string) => {
        if (dropdownStatus.value.includes(selectedValue)) {
            setDropdownStatus((prevState) => ({
                ...prevState,
                value: prevState.value.filter((item) => item !== selectedValue),
            }))
        } else {
            setDropdownStatus((prevState) => ({
                ...prevState,
                value: [...prevState.value, selectedValue],
            }))
        }
    }

    const handleShowFilter = useCallback(() => {
        setShowFilter(true)
    }, [setShowFilter])

    const handleFilterClose = useCallback(() => {
        setShowFilter(false)
    }, [setShowFilter])

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <div className="flex flex-row justify-between lg:flex-row lg:justify-between mb-10 xl:items-center gap-4 md:flex-col sm:flex-col">
                    <div className="flex gap-1 xl:gap-2  xl:flex-row  ">
                        <div className="flex justify-start ">
                            <input
                                type="search"
                                name="search"
                                id=""
                                placeholder="search here"
                                value={searchInput}
                                className="xl:w-[250px] rounded-[10px] w-[130px]"
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="bg-gray-100   xl:text-md text-sm w-auto rounded-md">
                            <Dropdown
                                className=" text-xl text-black bg-gray-200 font-bold "
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={handleSelect}
                            >
                                {SEARCHOPTIONS?.map((item, key) => {
                                    return (
                                        <DropdownItem key={key} eventKey={item.value}>
                                            <span>{item.label}</span>
                                        </DropdownItem>
                                    )
                                })}
                            </Dropdown>
                        </div>
                    </div>
                    {/* From here */}

                    {/* To here */}
                    <div className="flex gap-4">
                        <div className="flex flex-col md:flex-row items-end justify-end mb-4">
                            <button
                                className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200 rounded-lg mb-2 md:mb-0 md:mr-2 hidden xl:flex xl:gap-1"
                                onClick={handleDownload}
                            >
                                <IoMdDownload className="text-xl md:text-xl" />
                                Export
                            </button>
                            <button
                                className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200 rounded-lg mb-2 md:mb-0 md:mr-2 flex gap-1 xl:hidden"
                                onClick={handleDownload}
                            >
                                <IoMdDownload className="text-xl md:text-xl" />
                            </button>
                        </div>
                        <div>
                            <Button variant="new" size="sm" onClick={handleShowFilter} className="hidden xl:flex gap-2">
                                <CiFilter className="text-xl font-extrabold" /> Filter
                            </Button>

                            <Button variant="default" size="sm" onClick={handleShowFilter} className="flex xl:hidden">
                                <FaFilter className="text-xl font-extrabold" />
                            </Button>
                        </div>
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
                    {numberClick !== true && (
                        <Pagination
                            pageSize={pageSize}
                            currentPage={page}
                            total={orderCount}
                            onChange={onPaginationChange}
                            className="mb-4 md:mb-0"
                        />
                    )}
                    <div className="min-w-[130px] flex gap-5">
                        {numberClick !== true && (
                            <Select
                                size="sm"
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => onSelectChange(option?.value)}
                                className="w-full"
                            />
                        )}
                    </div>
                </div>
            </div>
            {showFilter && (
                <FilterDialogOrder
                    showFilter={showFilter}
                    handleFilterClose={handleFilterClose}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={handleDropdownSelect}
                    handleFromChange={handleFromChange}
                    handleToChange={handleToChange}
                    from={from}
                    to={to}
                    deliveryType={deliveryType}
                    handleDeliverySelect={handleDeliverySelect}
                    paymentType={paymentType}
                    handlePaymentSelect={handlePaymentSelect}
                />
            )}

            {soundEnabled && <NotificationSound shouldPlay={soundEnabled} />}
            {pendingSound && <PendingNotification shouldPlay={pendingSound} />}
        </div>
    )
}

export default OrderList

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
