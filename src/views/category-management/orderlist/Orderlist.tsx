/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import { CHANGE_DELIVERY_OPTIONS, pageSizeOptions, SEARCHOPTIONS, type DropdownStatus, type Order } from './commontypes'
import { Button, Dropdown, Input, Spinner } from '@/components/ui'
import { IoMdDownload } from 'react-icons/io'
import { FaFilter } from 'react-icons/fa'
import FilterDialogOrder from './filterDialog/FilterDialog'
import { CiFilter } from 'react-icons/ci'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import NotificationSound from '@/common/orderNotification'
import PendingNotification from '@/common/pendingNotification'
import { notification } from 'antd'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import RedMarkTable from '@/common/RedMarkTable'
import { HiSearch } from 'react-icons/hi'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import TabSelectOrder from './filter'
import OrderlistMobile from './OrderlistMobile'
import { generatePrintingData } from './orderListFunctions'
import { useOrderListColumns } from './orderListUtils/OrderListColumns'
import {
    handleDateChange,
    handleDownload,
    handleSearch,
    handleSearchWithIcon,
    handleSelect,
    onPaginationChange,
    onSelectChange,
} from './orderListUtils/OrderListFunctions'
import { getStatusFilter } from './orderListUtils/OrderListUtils'

const OrderList = () => {
    const location = useLocation()
    const { var1, var2 } = location.state || {}
    const [orders, setOrders] = useState<Order[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [deliveryType, setDeliveryType] = useState<DropdownStatus>({ value: [], name: [] })
    const [paymentType, setPaymentType] = useState<DropdownStatus>({ value: [], name: [] })
    const [searchInput, setSearchInput] = useState<string>('')
    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [from, setFrom] = useState(var1 ? var1 : moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(var2 ? var2 : moment().format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState(0)
    const [dropdownStatus, setDropdownStatus] = useState<DropdownStatus>({ value: [], name: [] })
    const [showFilter, setShowFilter] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(false)
    const [pendingSound, setPendingSound] = useState(false)
    const [numberClick, setNumberClick] = useState(false)
    const [deliveryChangeType, setDeliveryChangeType] = useState<{ [key: string]: { value: string; label: string } }>({})
    const previousOrders = useRef<any[]>([])
    const [deliveryTypes, setDeliveryTypes] = useState<Record<string, string>>({})
    const [showNoData, setShowNoData] = useState(false)
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const [tabSelect, setTabSelect] = useState('all')
    const [isDownloading, setIsDownloading] = useState(false)
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }

    const extraFilters = () => {
        const status = dropdownStatus?.value?.length > 0 ? `&status=${dropdownStatus.value}` : getStatusFilter(tabSelect)
        const deliveryStatus =
            tabSelect === 'exchange' ? `&delivery_type=EXCHANGE` : deliveryType?.value?.length ? `&delivery_type=${deliveryType.value}` : ''

        const paymentStatus = paymentType?.value?.length ? `&payment_mode=${paymentType.value}` : ''

        const filterParams = searchInput
            ? currentSelectedPage.value === 'invoice'
                ? `&invoice_id=${searchInput}`
                : currentSelectedPage.value === 'mobile'
                  ? `&mobile=${searchInput}`
                  : ''
            : `p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}`

        return { status, deliveryStatus, paymentStatus, filterParams }
    }

    const fetchApiCall = async (): Promise<{ ordersData: any[]; orderCount: number }> => {
        try {
            const { status, deliveryStatus, paymentStatus, filterParams } = extraFilters()
            const response = await axiosInstance.get(`/merchant/orders?${filterParams}${status}${deliveryStatus}${paymentStatus}`)
            const ordersData = response.data?.data.results
            const orderCount = response.data?.data.count
            return { ordersData, orderCount }
        } catch (error) {
            console.error(error)
            return { ordersData: [], orderCount: 0 }
        }
    }

    const fetchOrders = async () => {
        try {
            const { ordersData, orderCount } = await fetchApiCall()
            setOrders(ordersData)
            setOrderCount(orderCount)
            if (ordersData?.length === 0) {
                setShowNoData(true)
            } else {
                setShowNoData(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const checkingNewOrders = async () => {
        try {
            const { ordersData, orderCount } = await fetchApiCall()
            if (previousOrders.current.length > 0) {
                const latestPreviousOrderDate = new Date(
                    Math.max(...previousOrders.current.map((order) => new Date(order.create_date)?.getTime())),
                )

                const newOrderExists = ordersData.some((newOrder: any) => new Date(newOrder.create_date) > latestPreviousOrderDate)

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

    const noFilterFunc = (isCheck: boolean) => {
        const noFilters = isCheck
            ? page !== 1
            : page === 1 &&
              !dropdownStatus.value.length &&
              !searchInput &&
              !deliveryType.value.length &&
              !paymentType.value.length &&
              numberClick === false
        return noFilters
    }

    useEffect(() => {
        if (!numberClick) {
            fetchOrders()
        }
        const noFilters = noFilterFunc(false)

        if (noFilters && (tabSelect === 'all' || tabSelect === 'pending')) {
            const interval = setInterval(() => {
                fetchOrders()
                checkingNewOrders()
            }, 30000)

            return () => clearInterval(interval)
        }
    }, [page, pageSize, from, to, dropdownStatus, searchOnEnter, deliveryType, paymentType, numberClick, previousOrders, tabSelect])

    useEffect(() => {
        checkingNewOrders()
        const noFilters = noFilterFunc(true)

        if (noFilters && (tabSelect === 'all' || tabSelect === 'pending')) {
            const interval = setInterval(() => {
                checkingNewOrders()
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

    const handleNumberClick = async (number: number) => {
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

    useEffect(() => {
        const initialDeliveryTypes: any = {}
        orders.forEach((row: any) => {
            initialDeliveryTypes[row.invoice_id] = row.delivery_type || 'SELECT'
        })
        setDeliveryTypes(initialDeliveryTypes)
    }, [orders])

    const handleDeliveryChange = (selectedValue: any, row: any) => {
        const selectedLabel = CHANGE_DELIVERY_OPTIONS.find((item) => item.value === selectedValue)?.label || ''
        setDeliveryChangeType((prev) => ({
            ...prev,
            [row]: { value: selectedValue, label: selectedLabel },
        }))
        deliveryChangeAPI(selectedValue, row)
    }

    const deliveryChangeAPI = async (selectedValue: string, id: any) => {
        try {
            const body = {
                action: 'CHANGE_DELIVERY_TYPE',
                delivery_type: selectedValue,
            }
            const response = await axiosInstance.patch(`/merchant/order/${id}`, body)
            notification.success({
                message: response.data.message || 'DELIVERY TYPE UPDATED',
            })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSelectFilters = (
        values: DropdownStatus,
        setValues: (value: SetStateAction<DropdownStatus>) => void,
        selectedValue: string,
    ) => {
        if (values.value.includes(selectedValue)) {
            setValues((prevState) => ({
                ...prevState,
                value: prevState.value.filter((item) => item !== selectedValue),
            }))
        } else {
            setValues((prevState) => ({
                ...prevState,
                value: [...prevState.value, selectedValue],
            }))
        }
    }

    const columns = useOrderListColumns({
        generatePrintingData,
        setPendingSound,
        handleNumberClick,
        handleDeliveryChange,
        deliveryChangeType,
        CHANGE_DELIVERY_OPTIONS,
    })

    return (
        <div className="p-4 bg-gray-50 rounded-xl">
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 xl:items-center gap-3 md:flex-col sm:flex-col">
                    <div className="flex  xl:gap-2  flex-row   gap-3  ">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search here..."
                                value={searchInput}
                                className="w-[150px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleSearch(e, setSearchOnEnter)
                                    }
                                }}
                            />
                            <div className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer">
                                <HiSearch
                                    className="text-white  dark:text-gray-400 text-xl"
                                    onClick={() => handleSearchWithIcon(setSearchOnEnter, searchInput)}
                                />
                            </div>
                            <div className="flex justify-center xl:justify-normal">
                                <div className="bg-gray-100 flex justify-center font-bold items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                                    <Dropdown
                                        className=" text-xl text-black bg-gray-200 font-bold  "
                                        title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                        onSelect={(e) => handleSelect(e, setCurrentSelectedPage)}
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
                    </div>

                    <div className="xl:flex gap-4 ">
                        <div className="flex gap-2 items-center justify-center xl:justify-normal">
                            <div>
                                <UltimateDatePicker
                                    from={from}
                                    setFrom={setFrom}
                                    to={to}
                                    setTo={setTo}
                                    handleDateChange={(e: [Date | null, Date | null] | null) => handleDateChange(e, setFrom, setTo)}
                                />
                            </div>

                            <div className="xl:mt-7">
                                <Button variant="new" size="sm" className="hidden xl:flex gap-2" onClick={() => setShowFilter(true)}>
                                    <CiFilter className="text-xl font-extrabold" /> FILTER
                                </Button>

                                <Button variant="default" size="sm" className="flex xl:hidden mt-8" onClick={() => setShowFilter(true)}>
                                    <FaFilter className="text-xl font-extrabold" />
                                </Button>
                            </div>
                            <div className="flex  md:flex-row items-end justify-end ">
                                <div className="mt-10 xl:mt-7">
                                    <button
                                        disabled={isDownloading}
                                        className="bg-gray-700 text-white px-4 py-2 hover:bg-gray-600 rounded-lg mb-2 md:mb-0 md:mr-2  xl:flex xl:gap-1 dark:bg-gray-500 dark:text-white"
                                        onClick={() =>
                                            handleDownload(
                                                from,
                                                to,
                                                dropdownStatus,
                                                deliveryType,
                                                paymentType,
                                                currentSelectedPage,
                                                searchInput,
                                                setIsDownloading,
                                            )
                                        }
                                    >
                                        <IoMdDownload className="text-xl md:text-xl font-extrabold hidden xl:flex" />
                                        <span className="flex gap-1 items-center">
                                            EXPORT {isDownloading && <Spinner size={20} color="white" />}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TabSelectOrder handleSelectTab={handleSelectTab} tabSelect={tabSelect} orderCount={orderCount || 0} />
                {showNoData ? (
                    <NotFoundData />
                ) : (
                    <div className="border border-gray-300 p-2 rounded-xl hidden xl:block mt-6">
                        <RedMarkTable
                            mainData={orders}
                            page={page}
                            pageSize={pageSize}
                            columns={columns}
                            selectedDeliveryType={deliveryTypes ?? ''}
                        />
                    </div>
                )}

                <div className="xl:hidden">
                    <OrderlistMobile orders={orders} handleNumberClick={handleNumberClick} />
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                {numberClick !== true && (
                    <Pagination
                        pageSize={pageSize}
                        currentPage={page}
                        total={orderCount}
                        className="mb-4 md:mb-0"
                        onChange={(e) => onPaginationChange(e, setPage)}
                    />
                )}
                <div className="min-w-[130px] flex gap-5">
                    {numberClick !== true && orders.length !== 0 && (
                        <Select<Option>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => onSelectChange(option?.value, setPageSize, setPage)}
                        />
                    )}
                </div>
            </div>
            {showFilter && (
                <FilterDialogOrder
                    showFilter={showFilter}
                    handleFilterClose={() => setShowFilter(false)}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={(val: any) => handleSelectFilters(dropdownStatus, setDropdownStatus, val)}
                    deliveryType={deliveryType}
                    handleDeliverySelect={(val: any) => handleSelectFilters(deliveryType, setDeliveryType, val)}
                    paymentType={paymentType}
                    handlePaymentSelect={(val: any) => handleSelectFilters(paymentType, setPaymentType, val)}
                    handleDateChange={handleDateChange}
                />
            )}
            {soundEnabled && <NotificationSound shouldPlay={soundEnabled} />}
            {pendingSound && <PendingNotification shouldPlay={pendingSound} />}
        </div>
    )
}

export default OrderList
