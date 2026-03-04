/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import { CHANGE_DELIVERY_OPTIONS, pageSizeOptions, SEARCHOPTIONS, type DropdownStatus } from './commontypes'
import { Button, Dropdown, Input } from '@/components/ui'
import { IoMdDownload } from 'react-icons/io'
import FilterDialogOrder from './filterDialog/FilterDialog'
import { CiFilter } from 'react-icons/ci'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import PendingNotification from '@/common/pendingNotification'
import { notification, Spin } from 'antd'
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
import OrderReAssignModal from './orderListUtils/OrderReAssignModal'
import { newOrderService } from '@/store/services/newOrderaService'
import { Order } from '@/store/types/newOrderTypes'
import CompleteCouponOrder from './orderListUtils/CompleteCouponOrder'
import { FiCheckCircle, FiClipboard } from 'react-icons/fi'
import { MdAssignmentAdd } from 'react-icons/md'
import OrderColumnFilter from './orderListUtils/OrderColumnFilter'

const OrderList = () => {
    const location = useLocation()
    const { var1, var2 } = location.state || {}
    const [orders, setOrders] = useState<Order[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [deliveryType, setDeliveryType] = useState<DropdownStatus>({ value: [], name: [] })
    const [paymentType, setPaymentType] = useState<DropdownStatus>({ value: [], name: [] })
    const [paymentStatus, setPaymentStatus] = useState<DropdownStatus>({ value: [], name: [] })
    const [searchInput, setSearchInput] = useState<string>('')
    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [from, setFrom] = useState(var1 ? var1 : moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(var2 ? var2 : moment().format('YYYY-MM-DD'))
    const [totalData, setTotalData] = useState(0)
    const [dropdownStatus, setDropdownStatus] = useState<DropdownStatus>({ value: [], name: [] })
    const [showFilter, setShowFilter] = useState(false)
    const [pendingSound, setPendingSound] = useState(false)
    const [numberClick, setNumberClick] = useState(false)
    const [deliveryChangeType, setDeliveryChangeType] = useState<{ [key: string]: { value: string; label: string } }>({})
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const [tabSelect, setTabSelect] = useState('all')
    const [isDownloading, setIsDownloading] = useState(false)
    const [numberStore, setNumberStore] = useState('')
    const [isReAssign, setIsReAssign] = useState(false)
    const [currentSelectedTable, setCurrentSelectedTable] = useState<string[]>([])
    const [columnFilter, setColumnFilter] = useState(false)
    const [isCompleteOrder, setIsCompleteOrder] = useState(false)
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }

    const noFilterFunc = () => {
        const noFilters =
            page === 1 &&
            !dropdownStatus.value.length &&
            !searchInput &&
            !deliveryType.value.length &&
            !paymentType.value.length &&
            numberClick === false
        return noFilters
    }
    const buildFilterParams = () => {
        const params: Record<string, string | number | string[]> = { p: page, page_size: numberStore ? 100 : pageSize }
        const resolvedStatus =
            dropdownStatus?.value?.length > 0 ? dropdownStatus.value : tabSelect !== 'all' ? getStatusFilter(tabSelect) : undefined
        if (resolvedStatus) params.status = resolvedStatus
        if (tabSelect === 'exchange') {
            params.delivery_type = 'EXCHANGE'
        } else if (deliveryType?.value?.length) {
            params.delivery_type = deliveryType.value
        }
        if (paymentType?.value?.length) {
            params.payment_mode = paymentType.value
        }
        if (paymentStatus?.value?.length) {
            params.payment_status = paymentStatus.value
        }
        if (searchOnEnter) {
            if (currentSelectedPage.value === 'invoice') {
                params.invoice_id = searchOnEnter
            } else if (currentSelectedPage.value === 'mobile') {
                params.mobile = searchOnEnter
            } else if (numberStore) {
                params.mobile = numberStore
            }
        } else {
            params.from = from
            params.to = To_Date
        }
        return params
    }

    const ordersApiResponse = newOrderService.useGetNewOrdersQuery(buildFilterParams(), {
        pollingInterval: noFilterFunc() && (tabSelect === 'all' || tabSelect === 'pending') ? 120000 : undefined,
    })

    useEffect(() => {
        if (ordersApiResponse.isSuccess) {
            setOrders(ordersApiResponse.data?.data?.results || [])
            setTotalData(ordersApiResponse.data?.data?.count ?? 0)
        }
        if (ordersApiResponse.isError) {
            notification.error({ message: 'Failed to load orders Data' })
        }
    }, [ordersApiResponse.data, ordersApiResponse.isSuccess, ordersApiResponse.isError])

    useEffect(() => {
        if (pendingSound) {
            setTimeout(() => setPendingSound(false), 5000)
        }
    }, [pendingSound])

    const handleNumberClick = async (number: number) => {
        setNumberClick(true)
        setNumberStore(number?.toString())
    }

    const isDelayedStatus = useMemo(() => {
        const map: Record<string, boolean> = {}
        orders.forEach((row) => {
            map[row.invoice_id] = row.logistic?.is_delayed ?? false
        })
        return map
    }, [orders])

    const handleDeliveryChange = (selectedValue: any, row: any) => {
        const selectedLabel = CHANGE_DELIVERY_OPTIONS.find((item) => item.value === selectedValue)?.label || ''
        setDeliveryChangeType((prev) => ({ ...prev, [row]: { value: selectedValue, label: selectedLabel } }))
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
            setValues((prevState) => ({ ...prevState, value: prevState.value.filter((item) => item !== selectedValue) }))
        } else {
            setValues((prevState) => ({ ...prevState, value: [...prevState.value, selectedValue] }))
        }
    }

    const handleSyncDistance = async (invoice_id: string | number) => {
        try {
            const response = await axiosInstance.post(`backend/task/create`, {
                task_name: 'update_order_distances_and_time',
                orders: invoice_id,
            })
            notification.success({ message: response.data.message || 'DISTANCE SYNCED' })
        } catch (error) {
            console.log(error)
        }
    }

    const columns = useOrderListColumns({
        generatePrintingData,
        setPendingSound,
        handleNumberClick,
        handleDeliveryChange,
        deliveryChangeType,
        CHANGE_DELIVERY_OPTIONS,
        handleSyncDistance,
        currentSelectedTable,
    })

    return (
        <Spin spinning={ordersApiResponse.isLoading || ordersApiResponse.isFetching}>
            <div className="mb-1 bg-gray-50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                        <FiClipboard className="xl:text-2xl text-md text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm xl:text-[24px] text-gray-900 dark:text-white">Order Management</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-md">View and Manage Slikk Forward Orders</p>
                    </div>
                </div>
            </div>
            <div className="p-4 shadow-lg dark:bg-slate-800 rounded-xl">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex flex-col mb-10 gap-6 bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 w-full">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Search For Orders and Other Filters</h2>

                            <div className="flex flex-col xl:flex-row items-center gap-3 w-full">
                                <div className="flex items-center gap-2 flex-1">
                                    <Input
                                        type="search"
                                        name="search"
                                        placeholder="Search by Order ID, Customer phone number, etc..."
                                        value={searchInput}
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 
                               bg-gray-50 dark:bg-gray-800 
                               px-4 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 
                               transition-all duration-200"
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e: any) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleSearch(e, setSearchOnEnter)
                                            }
                                        }}
                                    />
                                    <div
                                        className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer"
                                        onClick={() => handleSearchWithIcon(setSearchOnEnter, searchInput)}
                                    >
                                        <HiSearch className="text-white text-xl" />
                                    </div>
                                </div>

                                <div className="bg-gray-100 dark:bg-blue-600 dark:text-white font-bold text-sm rounded-md">
                                    <Dropdown
                                        className="text-black bg-gray-200 font-bold"
                                        title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                        onSelect={(e) => handleSelect(e, setCurrentSelectedPage)}
                                    >
                                        {SEARCHOPTIONS?.map((item, key) => (
                                            <DropdownItem key={key} eventKey={item.value}>
                                                <span>{item.label}</span>
                                            </DropdownItem>
                                        ))}
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800" />

                        <div className="flex flex-col xl:flex-row xl:justify-between gap-4">
                            <div className="flex xl:flex-row flex-col gap-3 items-center">
                                <Button variant="new" size="sm" icon={<FiCheckCircle />} onClick={() => setIsCompleteOrder(true)}>
                                    Complete Coupon Order
                                </Button>

                                <Button variant="new" size="sm" icon={<MdAssignmentAdd />} onClick={() => setIsReAssign(true)}>
                                    Reassign
                                </Button>

                                <Button
                                    variant="new"
                                    size="sm"
                                    className="flex gap-2 items-center"
                                    icon={<CiFilter />}
                                    onClick={() => setShowFilter(true)}
                                >
                                    Filters
                                </Button>
                                <Button
                                    variant="new"
                                    size="sm"
                                    className="flex gap-2 items-center"
                                    icon={<CiFilter />}
                                    onClick={() => setColumnFilter(true)}
                                >
                                    Column FILTER
                                </Button>
                            </div>

                            {/* Right Section */}
                            <div className="flex gap-3 items-center justify-center">
                                <UltimateDatePicker
                                    from={from}
                                    setFrom={setFrom}
                                    to={to}
                                    setTo={setTo}
                                    customClass="border w-auto rounded-md h-auto font-bold bg-black text-white flex justify-center"
                                    handleDateChange={(e: [Date | null, Date | null] | null) => handleDateChange(e, setFrom, setTo)}
                                />

                                <Button
                                    disabled={isDownloading}
                                    variant="new"
                                    size="sm"
                                    icon={<IoMdDownload />}
                                    loading={isDownloading}
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
                                    EXPORT
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* to */}
                    <TabSelectOrder
                        handleSelectTab={handleSelectTab}
                        tabSelect={tabSelect}
                        orderCount={ordersApiResponse.isLoading || ordersApiResponse.isFetching ? `...` : `${totalData}`}
                    />
                    {ordersApiResponse.error || !ordersApiResponse.data?.data.results.length ? (
                        <NotFoundData />
                    ) : (
                        <div className="border border-gray-300 p-2 rounded-xl hidden xl:block mt-6">
                            <RedMarkTable
                                mainData={orders}
                                page={page}
                                pageSize={pageSize}
                                columns={columns}
                                isDelayedStatus={isDelayedStatus}
                            />
                        </div>
                    )}

                    <div className="xl:hidden">
                        <OrderlistMobile orders={orders} handleNumberClick={handleNumberClick} handleSyncDistance={handleSyncDistance} />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                    {numberClick !== true && (
                        <Pagination
                            pageSize={pageSize}
                            currentPage={page}
                            total={totalData}
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
                        paymentStatus={paymentStatus}
                        handlePaymentStatusSelect={(val: any) => handleSelectFilters(paymentStatus, setPaymentStatus, val)}
                        handleDateChange={handleDateChange}
                    />
                )}
                {pendingSound && <PendingNotification shouldPlay={pendingSound} />}
                {isReAssign && <OrderReAssignModal isReAssign={isReAssign} setIsReAssign={setIsReAssign} />}
                <CompleteCouponOrder isOpen={isCompleteOrder} setIsOpen={setIsCompleteOrder} refetch={ordersApiResponse.refetch} />
                <OrderColumnFilter
                    setShowDrawer={setColumnFilter}
                    showDrawer={columnFilter}
                    currentTableSelected={currentSelectedTable}
                    setCurrentSelectedTable={setCurrentSelectedTable}
                />
            </div>
        </Spin>
    )
}

export default OrderList
