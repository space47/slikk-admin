/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import { Button, Dropdown, Input } from '@/components/ui'
import { IoMdDownload } from 'react-icons/io'
import { FaFilter } from 'react-icons/fa'
import FilterDialogOrder from '@/views/category-management/orderlist/filterDialog/FilterDialog'
import { CiFilter } from 'react-icons/ci'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import RedMarkTable from '@/common/RedMarkTable'
import { HiSearch } from 'react-icons/hi'
import LoadingSpinner from '@/common/LoadingSpinner'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { DropdownStatus, SEARCHOPTIONS_EXCHNAGE } from './ExchangeCommon'
import { Exchange_Columns } from './exchangeOrderUtils/ExchangeColumns'
import { pageSizeOptions } from '../groupNotification/getGroup/groupComnmon'
import { handleDownload, handleNumberClick } from './exchangeOrderUtils/ExchangeApiCalls'
import { handleDateChange, handleDropDownSelect, handleSelect } from './exchangeOrderUtils/ExchangeFunctions'

const Exchangeorders = () => {
    const location = useLocation()
    const { var1, var2 } = location.state || {}
    const [orders, setOrders] = useState<any[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS_EXCHNAGE[0])
    const [deliveryType, setDeliveryType] = useState<DropdownStatus>({ value: [], name: [] })
    const [paymentType, setPaymentType] = useState<DropdownStatus>({ value: [], name: [] })
    const [searchInput, setSearchInput] = useState<string>('')
    const [pageSize, setPageSize] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [from, setFrom] = useState<string>(var1 ? var1 : moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState<string>(var2 ? var2 : moment().format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState()
    const [dropdownStatus, setDropdownStatus] = useState<DropdownStatus>({ value: [], name: [] })
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const [numberClick, setNumberClick] = useState<boolean>(false)
    const [showSpinner, setShowSpinner] = useState<boolean>(false)
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const previousOrders = useRef<any[]>([])
    const [deliveryTypes, setDeliveryTypes] = useState<Record<string, string>>({})
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

    const fetchOrders = async () => {
        try {
            const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`
            const paymentStatus = paymentType?.value.length === 0 ? '' : `&payment_mode=${paymentType?.value}`
            const filterParameters = searchInput
                ? currentSelectedPage.value === 'invoice'
                    ? `&invoice_id=${searchInput}`
                    : currentSelectedPage?.value === 'mobile'
                      ? `&mobile=${searchInput}`
                      : ''
                : `&from=${from}&to=${To_Date}`

            const response = await axiosInstance.get(
                `/merchant/orders?p=${page}&page_size=${pageSize}&delivery_type=EXCHANGE&${filterParameters}${status}${paymentStatus}`,
            )
            setOrders(response.data?.data.results)
            setOrderCount(response.data?.data.count)
        } catch (error) {
            console.error(error)
        } finally {
            setShowSpinner(false)
        }
    }

    useEffect(() => {
        if (!numberClick) {
            fetchOrders()
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
                fetchOrders()
            }, 30000)

            return () => clearInterval(interval)
        }
    }, [page, pageSize, from, to, dropdownStatus, searchOnEnter, paymentType, numberClick, previousOrders])

    useEffect(() => {
        const initialDeliveryTypes: any = {}
        orders.forEach((row: any) => {
            initialDeliveryTypes[row.invoice_id] = row.delivery_type || 'SELECT'
        })
        setDeliveryTypes(initialDeliveryTypes)
    }, [orders])

    const handleSearchWithIcon = () => {
        setSearchOnEnter(searchInput)
    }

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
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
                                        setSearchOnEnter(e.target.value)
                                    }
                                }}
                            />
                            <div className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer">
                                <HiSearch className="text-white  dark:text-gray-400 text-xl" onClick={() => handleSearchWithIcon()} />
                            </div>
                            <div className="flex justify-center xl:justify-normal">
                                <div className="bg-gray-100 flex justify-center font-bold items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                                    <Dropdown
                                        className=" text-xl text-black bg-gray-200 font-bold  "
                                        title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                        onSelect={(e) => handleSelect(e, setCurrentSelectedPage)}
                                    >
                                        {SEARCHOPTIONS_EXCHNAGE?.map((item, key) => {
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
                    <div className="flex gap-4">
                        <div className="flex flex-col md:flex-row items-end justify-end ">
                            <button
                                className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200 rounded-lg mb-2 md:mb-0 md:mr-2 hidden xl:flex xl:gap-1 dark:bg-gray-500 dark:text-white"
                                onClick={() =>
                                    handleDownload(
                                        dropdownStatus,
                                        deliveryType,
                                        paymentType,
                                        searchInput,
                                        from,
                                        To_Date,
                                        page,
                                        pageSize,
                                        currentSelectedPage,
                                    )
                                }
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
                                    handleDateChange={(dates: [Date | null, Date | null] | null) => handleDateChange(dates, setFrom, setTo)}
                                />
                            </div>
                            <div className="xl:mt-7">
                                <Button variant="new" size="sm" className="hidden xl:flex gap-2" onClick={() => setShowFilter(true)}>
                                    <CiFilter className="text-xl font-extrabold" /> FILTER
                                </Button>

                                <Button variant="default" size="sm" className="flex xl:hidden mt-5" onClick={() => setShowFilter(true)}>
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
                        columns={Exchange_Columns((number) => handleNumberClick(number, setOrders, setOrderCount, setNumberClick))}
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
                        className="mb-4 md:mb-0"
                        onChange={(page) => setPageSize(page)}
                    />
                )}
                <div className="min-w-[130px] flex gap-5">
                    {numberClick !== true && orders.length !== 0 && (
                        <Select<Option>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => {
                                if (option) {
                                    setPageSize(option.value)
                                    setPage(1)
                                }
                            }}
                        />
                    )}
                </div>
            </div>
            {showFilter && (
                <FilterDialogOrder
                    forExchange
                    showFilter={showFilter}
                    handleFilterClose={() => setShowFilter(false)}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={(val: string) => handleDropDownSelect(val, dropdownStatus, setDropdownStatus)}
                    from={from}
                    to={to}
                    deliveryType={deliveryType}
                    handleDeliverySelect={(val: string) => handleDropDownSelect(val, deliveryType, setDeliveryType)}
                    paymentType={paymentType}
                    handlePaymentSelect={(val: string) => handleDropDownSelect(val, paymentType, setPaymentType)}
                    handleDateChange={handleDateChange}
                    setFrom={setFrom}
                    setTo={setTo}
                />
            )}
        </div>
    )
}

export default Exchangeorders
