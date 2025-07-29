/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Button from '@/components/ui/Button'
import { Pagination, Select, Input } from '@/components/ui'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { ReturnOrder } from '../returnOrders/returnOrderCommon'
import FilterReturnOrder from '../returnOrders/filter/FilterReturnOrder'
import { CiFilter } from 'react-icons/ci'
import { FaFilter } from 'react-icons/fa'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import EasyTable from '@/common/EasyTable'
import { ReverseDeliveryColumns } from './reverseDeliveryUtils/ReverseDeliveryColumns'
import { HiSearch } from 'react-icons/hi'
import CommonDropdown from '@/common/commonDropdown'
import { LOGISTIC_PARTNER } from '../DeliveryOrders/DeliveryCommon'

interface ReturnDropdownStatus {
    value: string[]
    name: string[]
}

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const SEARCHOPTIONS = [
    { label: 'RETURN ID', value: 'return_order_id' },
    { label: 'INVOICE', value: 'invoice_id' },
    { label: 'AWB', value: 'awb' },
]

const ReverseDelivery = () => {
    const [orders, setOrders] = useState<ReturnOrder[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [deliveryType, setDeliveryType] = useState<ReturnDropdownStatus>({ value: [], name: [] })
    const [searchInput, setSearchInput] = useState<string>('')
    const [pageSize, setPageSize] = useState<number | undefined>(10)
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState()
    const [dropdownStatus, setDropdownStatus] = useState<ReturnDropdownStatus>({ value: [], name: [] })
    const [partner, setPartner] = useState<{ [key: string]: { value: string; label: string } }>({})
    const [showFilter, setShowFilter] = useState(false)
    const [searchOnEnter, setSearchOnEnter] = useState('')

    const fetchOrders = async () => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus?.value}`
            const deliveryStatus = deliveryType?.value && deliveryType?.value.length > 0 ? `&return_type=${deliveryType?.value}` : ''

            const filterParams = searchInput
                ? currentSelectedPage.value === 'return_order_id'
                    ? `&return_order_id=${searchInput.toUpperCase()}`
                    : currentSelectedPage.value === 'invoice_id'
                      ? `&invoice_id=${searchInput.toUpperCase()}`
                      : currentSelectedPage.value === 'awb'
                        ? `&awb=${searchInput}`
                        : ''
                : `&from=${from}&to=${To_Date}`

            const response = await axioisInstance.get(
                `/merchant/return_orders?p=${page}&page_size=${pageSize}${filterParams}${status}${deliveryStatus}`,
            )
            const ordersData = response?.data?.data.results
            const orderCount = response?.data?.data.count
            setOrders(ordersData || [])
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [page, pageSize, from, to, dropdownStatus, searchOnEnter, deliveryType])

    const handleCancelTask = async (return_order_id: any) => {
        try {
            const body = {
                action: 'cancel',
            }
            await axioisInstance.patch(`/merchant/logistic/returnorder/${return_order_id}`, body)
            notification.success({
                message: 'success',
                description: 'Return Order successfully cancelled',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to cancel order',
            })
        }
    }

    const handleInvoiceClick = (invoiceId: string) => {
        navigate(`/app/returnOrders/${invoiceId}`)
    }

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const handlePartnerSelect = (selectedValue: any, row: any) => {
        const selectedLabel = LOGISTIC_PARTNER?.find((item) => item.value === selectedValue)?.label || ''

        setPartner((prev) => ({
            ...prev,
            [row.id]: { value: selectedValue, label: selectedLabel },
        }))
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

    const handleCreateTask = async (partner: any, logistic_partner: any, return_order_id: any) => {
        try {
            const body = {
                action: 'create_reverse_pickup',
                re_create: 'yes',
                logistic_partner: partner?.value ? partner?.value : logistic_partner,
            }

            console.log('BODY', body)

            const response = await axioisInstance.patch(`merchant/return_order/${return_order_id}`, body)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Updated successfully.',
            })
        } catch (error: any) {
            console.error(error)
            const errorMessage = error.response?.data?.message || 'There was an error updating the return order status. Please try again.'
            notification.error({
                message: 'Error',
                description: errorMessage,
            })
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

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    const columns = ReverseDeliveryColumns(handleInvoiceClick, partner, handlePartnerSelect, handleCreateTask, handleCancelTask)

    return (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
            <div className="flex flex-col xl:flex-row justify-between lg:flex-row lg:justify-between mb-10 items-center gap-4">
                <div className="flex gap-2">
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
                            <HiSearch className="text-white  dark:text-gray-400 text-xl" onClick={() => setSearchOnEnter(searchInput)} />
                        </div>
                        <div>
                            <div className="bg-gray-100 xl:mt-1 dark:bg-blue-600 dark:text-white  xl:text-md text-sm w-auto rounded-md">
                                <CommonDropdown
                                    isNoClear
                                    SEARCHOPTIONS={SEARCHOPTIONS}
                                    currentSelectedPage={currentSelectedPage}
                                    handleSelect={handleSelect}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    <div>
                        <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
                    </div>

                    <div className="mt-7">
                        <Button variant="new" className="hidden xl:flex gap-2" size="sm" onClick={() => setShowFilter(true)}>
                            <CiFilter className="text-xl font-extrabold" /> Filter
                        </Button>

                        <Button variant="default" size="sm" className="flex xl:hidden" onClick={() => setShowFilter(true)}>
                            <FaFilter className="text-xl font-extrabold" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="border p-2 border-gray-200 rounded-lg">
                <EasyTable columns={columns} page={page} pageSize={pageSize} mainData={orders || []} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={orderCount} onChange={onPaginationChange} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        className="w-full flex justify-end"
                        onChange={(option) => setPageSize(option?.value)}
                    />
                </div>
            </div>
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

export default ReverseDelivery
