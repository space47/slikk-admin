/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import { Button, Dropdown, Input } from '@/components/ui'
import { IoMdDownload } from 'react-icons/io'
import { FaExclamationCircle, FaFilter, FaMapMarkedAlt } from 'react-icons/fa'
import FilterDialogOrder from '@/views/category-management/orderlist/filterDialog/FilterDialog'
import { CiFilter } from 'react-icons/ci'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import RedMarkTable from '@/common/RedMarkTable'
import { HiSearch } from 'react-icons/hi'
import LoadingSpinner from '@/common/LoadingSpinner'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import NotFoundData from '@/views/pages/NotFound/Notfound'

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
const scheduleSlots: any = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}

const Exchangeorders = () => {
    const location = useLocation()
    const { var1, var2 } = location.state || {}

    const [orders, setOrders] = useState<any[]>([])
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

    const [pageSize, setPageSize] = useState(10)

    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [from, setFrom] = useState(var1 ? var1 : moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(var2 ? var2 : moment().format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState()
    const [dropdownStatus, setDropdownStatus] = useState<DropdownStatus>({
        value: [],
        name: [],
    })

    const [storeInvoiceId, setStoreInvoiceId] = useState()
    const [showFilter, setShowFilter] = useState(false)
    const [numberClick, setNumberClick] = useState(false)

    const previousOrders = useRef<any[]>([])
    const [deliveryTypes, setDeliveryTypes] = useState<Record<string, string>>({})

    const [showSpinner, setShowSpinner] = useState(false)

    const fetchOrders = async (page: number, pageSize: number, from: string, to: string) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value?.length === 0 ? '' : `&status=${dropdownStatus?.value}`

            const deliveryStatus = `&delivery_type=EXCHANGE`
            let paymentStatus = ''
            let searchingParam = ''

            if (paymentType?.value && paymentType?.value.length > 0) {
                paymentStatus = `&payment_mode=${paymentType?.value}`
            }
            if (currentSelectedPage.value === 'invoice' && searchInput) {
                searchingParam = `&invoice_id=${searchInput}`
            }
            if (currentSelectedPage.value === 'mobile' && searchInput) {
                searchingParam = `&mobile=${searchInput}`
            }

            const response = await axiosInstance.get(
                `/merchant/orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${searchingParam}${status}${deliveryStatus}${paymentStatus}`,
            )

            const ordersData = response.data?.data.results
            const orderCount = response.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        } finally {
            setShowSpinner(false)
        }
    }

    useEffect(() => {
        if (!numberClick) {
            fetchOrders(page, pageSize, from, to)
        }

        const noFilters =
            page === 1 &&
            !dropdownStatus.value.length &&
            !searchInput &&
            !deliveryType.value.length &&
            !paymentType.value.length &&
            numberClick === false

        if (noFilters) {
            const interval = setInterval(() => {
                fetchOrders(page, pageSize, from, to)
            }, 30000)

            return () => clearInterval(interval)
        }
    }, [page, pageSize, from, to, dropdownStatus, searchInput, paymentType, numberClick, previousOrders])

    const handleNumberClick = async (number: any) => {
        try {
            const response = await axiosInstance.get(`/merchant/orders?mobile=${number}&page_size=100`)

            const data = response.data.data

            setOrders(data.results)
            setOrderCount(data.count)
            setNumberClick(true)
        } catch (error) {
            console.error(error)
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Invoice Id',
                accessorKey: 'invoice_id',
                cell: ({ getValue, row }: any) => {
                    const createDate = moment(row.original.create_date)
                    const currentDate = moment()
                    const differenceInSeconds = currentDate.diff(createDate, 'seconds')
                    setStoreInvoiceId(getValue())

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
            { header: 'Device Type', accessorKey: 'device_type' },
            { header: 'Customer Name', accessorKey: 'user.name' },
            {
                header: 'Delivery Type',
                accessorKey: 'delivery_type',
            },
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

            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const statuses = row?.original?.status
                    return (
                        <div>
                            {statuses === 'PENDING' || statuses === 'CANCELLED' ? (
                                <span className="text-red-700 font-semibold bg-red-100 p-2 rounded-md">{statuses}</span>
                            ) : statuses === 'COMPLETED' ? (
                                <span className="font-semibold text-green-700 bg-green-100 p-2 rounded-lg">{statuses}</span>
                            ) : (
                                <span className="text-yellow-700 bg-yellow-100 p-2 rounded-lg font-semibold">{statuses}</span>
                            )}
                        </div>
                    )
                },
            },

            { header: 'Distance', accessorKey: 'distance', cell: ({ getValue }) => <span>{getValue()} km</span> },
            {
                header: 'Slot',
                accessorKey: 'delivery_schedule_slot',
                cell: ({ row }) => {
                    return (
                        <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                            <span className="ml-2 ">
                                {scheduleSlots[row?.original.delivery_schedule_slot]
                                    ? `${scheduleSlots[row?.original.delivery_schedule_slot].start} - ${scheduleSlots[row?.original.delivery_schedule_slot].end}`
                                    : '-'}
                            </span>
                        </span>
                    )
                },
            },
            { header: 'Total Items', accessorKey: 'order_items.length' },

            {
                header: 'Last Update',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [],
    )

    useEffect(() => {
        const initialDeliveryTypes: any = {}
        orders.forEach((row: any) => {
            initialDeliveryTypes[row.invoice_id] = row.delivery_type || 'SELECT'
        })
        setDeliveryTypes(initialDeliveryTypes)
    }, [orders])

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

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
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

    console.log(`Table for red ---`, deliveryType?.value)

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-4">
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex justify-end">
                    <button
                        className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200 rounded-lg mb-2 md:mb-0 md:mr-2 flex gap-1 xl:hidden"
                        onClick={handleDownload}
                    >
                        <IoMdDownload className="text-xl md:text-xl" />
                    </button>
                </div>
                <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 xl:items-center gap-3 md:flex-col sm:flex-col">
                    <div className="flex gap-1 xl:gap-2  xl:flex-row  ">
                        <div className="flex justify-start ">
                            <Input
                                type="search"
                                name="search"
                                placeholder="search here"
                                value={searchInput}
                                className="xl:w-[250px] rounded-[10px] w-[130px] dark:bg-gray-900"
                                prefix={<HiSearch className="text-xl items-center flex justify-center" />}
                                onChange={handleSearch}
                            />
                        </div>
                        <div>
                            <div className="bg-gray-100 items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                                <Dropdown
                                    className=" text-xl text-black bg-gray-200 font-bold  "
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
                    </div>
                    {/* From here */}

                    {/* To here */}
                    <div className="flex gap-4">
                        <div className="flex flex-col md:flex-row items-end justify-end ">
                            <button
                                className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200 rounded-lg mb-2 md:mb-0 md:mr-2 hidden xl:flex xl:gap-1 dark:bg-gray-500 dark:text-white"
                                onClick={handleDownload}
                            >
                                <IoMdDownload className="text-xl md:text-xl font-extrabold" />
                                EXPORT
                            </button>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div>
                                <UltimateDatePicker
                                    from={from}
                                    setFrom={setFrom}
                                    to={to}
                                    setTo={setTo}
                                    handleDateChange={handleDateChange}
                                />
                            </div>
                            <div className="xl:mt-7">
                                <Button variant="new" size="sm" onClick={handleShowFilter} className="hidden xl:flex gap-2">
                                    <CiFilter className="text-xl font-extrabold" /> FILTER
                                </Button>

                                <Button variant="default" size="sm" onClick={handleShowFilter} className="flex xl:hidden mt-5">
                                    <FaFilter className="text-xl font-extrabold" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                <div className="border border-gray-300 p-2 rounded-xl">
                    <RedMarkTable
                        mainData={orders}
                        page={page}
                        pageSize={pageSize}
                        columns={columns}
                        selectedDeliveryType={deliveryTypes ?? ''}
                    />
                </div>
            </div>
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
                    {numberClick !== true && orders.length !== 0 && (
                        <Select<Option>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => onSelectChange(option?.value)}
                        />
                    )}
                </div>
            </div>
            {showFilter && (
                <FilterDialogOrder
                    forExchange
                    showFilter={showFilter}
                    handleFilterClose={handleFilterClose}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={handleDropdownSelect}
                    from={from}
                    to={to}
                    deliveryType={deliveryType}
                    handleDeliverySelect={handleDeliverySelect}
                    paymentType={paymentType}
                    handlePaymentSelect={handlePaymentSelect}
                    handleDateChange={handleDateChange}
                    setFrom={setFrom}
                    setTo={setTo}
                />
            )}
        </div>
    )
}

export default Exchangeorders
