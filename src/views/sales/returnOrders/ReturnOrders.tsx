/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import moment from 'moment'
import { Button, Dropdown, Input } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { IoMdDownload } from 'react-icons/io'
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
import { LocationReturnType } from '@/store/types/returnOrderData.types'
import ReturnOrderMap from './returnOrderUtils/ReturnOrderMap'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'

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
    const [locationDetails, setLocationDetails] = useState<LocationReturnType[]>([])
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

    const fetchLocationData = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/return_orders?location_data=true&from=${from}&to=${To_Date}`)
            const data = response.data?.data
            setLocationDetails(data)
        } catch (error) {
            console.error
        }
    }

    useEffect(() => {
        fetchLocationData()
    }, [from, To_Date])

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

    return (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
            <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 items-center gap-3">
                <div className="flex  xl:gap-2  xl:flex-row  flex-col gap-3 order-2 xl:order-none md:order-none ">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md">
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search here..."
                            value={searchInput}
                            className="w-[160px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
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
                            <div className="bg-gray-100 xl:mt-1  items-center flex justify-center font-bold  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
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

                <div className="flex gap-4">
                    <div className="flex flex-col md:flex-row items-center  xl:gap-6 justify-center  ">
                        <div>
                            <button onClick={handleShowMap}>
                                {showMap ? (
                                    <FaMapMarkedAlt className="text-4xl text-red-700 " />
                                ) : (
                                    <FaMapMarkedAlt className="text-4xl text-green-600 " />
                                )}
                            </button>
                        </div>
                        <div>
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
                    <Button variant="new" size="sm" className="mt-1" disabled={taskProcess} loading={taskProcess} onClick={activateTask}>
                        Activate Task To Rider
                    </Button>

                    <UltimateDatePicker
                        customClass="border w-auto rounded-md h-auto font-bold  bg-black text-white flex justify-center"
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        handleDateChange={handleDateChange}
                    />

                    <div className="">
                        <Button variant="new" size="sm" className=" xl:mt-1 xl:flex gap-2" onClick={() => setShowFilter(true)}>
                            FILTER
                        </Button>
                    </div>
                </div>
            </div>

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
                <>
                    <div className="mt-10 flex flex-col gap-4">
                        <span className="text-xl font-bold">Return Orders Map:</span>
                        <ReturnOrderMap locationDetails={locationDetails} />
                    </div>
                </>
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
