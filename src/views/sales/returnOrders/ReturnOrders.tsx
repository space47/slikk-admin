/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import { Button, Dropdown, Input, Tooltip } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { IoMdDownload, IoMdReturnRight } from 'react-icons/io'
import FilterReturnOrder from './filter/FilterReturnOrder'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { HiSearch } from 'react-icons/hi'
import ReturnOrderlistMobile from './ReturnOrderMobile'
import ReturnOrderTabs from './ReturnOrderTabs'
import { useReturnOrderColumns } from './returnOrderUtils/ReturnOrderColumns'
import EasyTable from '@/common/EasyTable'
import { ReturnDropdownStatus, ReturnOrder, SEARCHOPTIONS } from './returnOrderCommon'
import { pageSizeOptions } from '../groupNotification/getGroup/groupComnmon'
import { getStatusFilterReturn } from './returnOrderUtils/ReturnOrderUtils'
import { handleSearch, handleSearchWithIcon, handleSelect, onSelectChange, handleDownload } from './returnOrderUtils/ReturnOrderFunctions'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import ReturnOrderZoneMap from './returnOrderUtils/ReturnOrderZoneMap'
import { CiFilter } from 'react-icons/ci'

const ReturnOrders = () => {
    const location = useLocation()
    const { var1, var2 } = location.state || {}
    const [orders, setOrders] = useState<ReturnOrder[]>([])
    const [pageSize, setPageSize] = useState(10)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [deliveryType, setDeliveryType] = useState<ReturnDropdownStatus>({ value: [], name: [] })
    const [searchInput, setSearchInput] = useState<string>('')
    const [page, setPage] = useState(1)
    const [from, setFrom] = useState(var1 ? var1 : moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(var2 ? var2 : moment().format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState<number>(0)
    const [dropdownStatus, setDropdownStatus] = useState<{ name: string[]; value: string[] }>({ name: [], value: [] })
    const [showFilter, setShowFilter] = useState(false)
    const [tabSelect, setTabSelect] = useState('all')
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const [showMap, setShowMap] = useState(false)
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [isDownloading, setIsDownloading] = useState(false)
    const [showNumberLoading, setShowNumberLoading] = useState(false)
    const [taskProcess, setTaskProcess] = useState(false)

    const handleSelectTab = (value: string) => {
        setShowNumberLoading(true)
        setTabSelect(value)
    }

    const fetchOrders = async () => {
        try {
            const status = dropdownStatus?.value?.length ? `&status=${dropdownStatus.value}` : getStatusFilterReturn(tabSelect)
            const deliveryStatus = deliveryType?.value?.length ? `&return_type=${deliveryType.value}` : ''
            const searchWiseDownload = searchInput ? `&${currentSelectedPage.value}=${searchInput.toUpperCase()}` : ''
            const fromToParams = `&from=${from}&to=${To_Date}`
            const paramsFilter = searchInput ? '' : `p=${page}&page_size=${pageSize}${fromToParams}`
            const response = await axioisInstance.get(
                `merchant/return_orders?${paramsFilter}${status}${searchWiseDownload}${deliveryStatus}`,
            )
            const ordersData = response?.data?.data.results
            const orderCount = response?.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        } finally {
            setShowNumberLoading(false)
        }
    }
    useEffect(() => {
        fetchOrders()
    }, [page, pageSize, from, to, dropdownStatus, searchOnEnter, deliveryType, tabSelect])

    const columns = useReturnOrderColumns()

    const handleDropdownSelect = (selectedValue: string) => {
        setDropdownStatus((prevState) => {
            const currentValue = prevState.value
            if (currentValue.includes(selectedValue)) {
                return {
                    ...prevState,
                    value: currentValue.filter((item) => item !== selectedValue),
                }
            } else {
                return {
                    ...prevState,
                    value: [...currentValue, selectedValue],
                }
            }
        })
    }

    const activateTask = async () => {
        try {
            setTaskProcess(true)
            const res = await axioisInstance.post(`/backend/task/process`, { task_name: 'assign_return_order_to_rider' })
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setTaskProcess(false)
        }
    }

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD') ?? '')
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
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

    const handleShowMap = async () => {
        setShowMap((prev) => !prev)
    }

    const filtersAndSearchUI = () => {
        return (
            <div className="flex flex-col mb-10 gap-6 bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 w-full">
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Search For Return Orders and Other Filters</h2>

                    <div className="flex flex-col xl:flex-row items-center gap-3 w-full">
                        <div className="flex items-center gap-2 flex-1">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search by Return Order ID, Customer phone number, etc..."
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
                                <HiSearch
                                    className="text-white  dark:text-gray-400 text-xl"
                                    onClick={() => handleSearchWithIcon(setSearchOnEnter, searchInput)}
                                />
                            </div>
                        </div>

                        <div className="bg-gray-100 dark:bg-blue-600 dark:text-white font-bold text-sm rounded-md">
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

                <div className="border-t border-gray-200 dark:border-gray-800" />

                <div className="flex flex-col xl:flex-row xl:justify-between gap-4">
                    <div className="flex xl:flex-row flex-col gap-3 items-center">
                        <div>
                            <Tooltip title="Zone Map">
                                <button onClick={handleShowMap}>
                                    {showMap ? (
                                        <FaMapMarkedAlt className="text-4xl text-red-700 " />
                                    ) : (
                                        <FaMapMarkedAlt className="text-4xl text-green-600 " />
                                    )}
                                </button>
                            </Tooltip>
                        </div>
                        <Button
                            variant="new"
                            size="sm"
                            className="mt-1"
                            disabled={taskProcess}
                            loading={taskProcess}
                            onClick={activateTask}
                        >
                            Activate Task To Rider
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
                    </div>

                    {/* Right Section */}
                    <div className="flex gap-3 items-center justify-center">
                        <UltimateDatePicker
                            from={from}
                            setFrom={setFrom}
                            to={to}
                            setTo={setTo}
                            customClass="border w-auto rounded-md h-auto font-bold bg-black text-white flex justify-center"
                            handleDateChange={handleDateChange}
                        />

                        <Button
                            variant="new"
                            size="sm"
                            onClick={() =>
                                handleDownload(
                                    tabSelect,
                                    dropdownStatus,
                                    deliveryType,
                                    currentSelectedPage,
                                    searchInput,
                                    from,
                                    To_Date,
                                    setIsDownloading,
                                )
                            }
                            disabled={isDownloading}
                            loading={isDownloading}
                            icon={<IoMdDownload />}
                        >
                            EXPORT
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
            <div className="mb-1 bg-gray-50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                        <IoMdReturnRight className="xl:text-2xl text-md text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm xl:text-[24px] text-gray-900 dark:text-white">Return Order Management</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-md">View and Manage Slikk Return Orders</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 items-center gap-3"></div>
            {filtersAndSearchUI()}
            <br />
            <ReturnOrderTabs
                handleSelectTab={handleSelectTab}
                tabSelect={tabSelect}
                orderCount={showNumberLoading ? `...` : `${orderCount}`}
            />
            <br />
            <div className="border p-2 border-gray-300 rounded-md hidden xl:block">
                <EasyTable mainData={orders} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <div className="block xl:hidden">
                <ReturnOrderlistMobile orders={orders} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={orderCount} onChange={(page) => setPage(page)} />
                <div className="min-w-[130px] flex gap-5">
                    <Select
                        isSearchable={false}
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        className="w-full"
                        onChange={(option) => onSelectChange(option?.value, setPage, setPageSize)}
                    />
                </div>
            </div>
            <br />
            {showMap && (
                <div className="p-6">
                    <ReturnOrderZoneMap from={from} To_Date={To_Date} />
                </div>
            )}

            {showFilter && (
                <FilterReturnOrder
                    showFilter={showFilter}
                    handleFilterClose={() => setShowFilter(false)}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={handleDropdownSelect}
                    deliveryType={deliveryType}
                    handleDeliveryType={handleDeliverySelect}
                />
            )}
        </div>
    )
}

export default ReturnOrders
