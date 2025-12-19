/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SalesData } from './homes.common'
import Card from '@/components/ui/Card'
import { RiFileList3Fill } from 'react-icons/ri'
import { IoMdReturnLeft } from 'react-icons/io'
import { FaMapMarkerAlt, FaSearch, FaShoppingCart } from 'react-icons/fa'
import { HiCurrencyRupee, HiUserGroup } from 'react-icons/hi'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import BrandDataChart from '../homeChart/BubbleChart'
import { MdDeliveryDining, MdOutlinePendingActions } from 'react-icons/md'
import { PiDevicesFill } from 'react-icons/pi'
import { FaMoneyBillTrendUp } from 'react-icons/fa6'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import AccessDenied from '@/views/pages/AccessDenied'
import ActiveUserTable from './componentsHomes/ActiveUserTable'
import { IoBagCheck } from 'react-icons/io5'
import { Spinner, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import HomepageMaps from './componentsHomes/HomepageMaps'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { HomeCalculations } from './homesUtils/homeFunctions'

const Home = () => {
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('YYYY-MM-DD'))
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
    const [accessDenied, setAccessDenied] = useState(false)
    const [isPageActive, setIsPageActive] = useState(true)
    const [activeTab, setActiveTab] = useState('orders')
    const [viewMap, setViewMap] = useState(false)
    const navigate = useNavigate()

    const [showReportData, setShowReportData] = useState('')

    const To_Date = useMemo(() => {
        return moment(to).add(1, 'days').format('YYYY-MM-DD')
    }, [to])

    const shouldFetch = Boolean(from && To_Date)

    const {
        data: homeData,
        refetch,
        loading,
    } = useFetchSingleData<SalesData>({
        url: `/merchant/analytics/order?from=${from}&to=${To_Date}`,
        onErrorStatus: (status) => {
            if (status === 403) {
                setAccessDenied(true)
            }
        },
        skip: !shouldFetch,
    })

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsPageActive(false)
            } else {
                setIsPageActive(true)
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPageActive) {
            refetch()
            interval = setInterval(refetch, 60000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isPageActive, from, to])

    const { netSales, averageOrderValue, basketSize, netReturn, netReturnSales, receiverOrderValue } = HomeCalculations(homeData || null)

    const handleCustomerFunction = (inputName: string) => {
        navigate(`/app/customerAnalytics/${inputName}`)
    }

    const handleInvoiceFunction = (inputName: string) => {
        navigate(`/app/orders/${inputName}`)
    }
    const handleReceived = (from: string, to: string) => {
        navigate(`/app/orders`, { state: { var1: from, var2: to } })
    }
    const handleReturned = (from: string, to: string) => {
        navigate(`/app/returnOrders`, { state: { var1: from, var2: to } })
    }

    const handleCompleted = (from: string, to: string) => {
        navigate('/app/orders/completed', { state: { var1: from, var2: to } })
    }
    const handleDateChange = useCallback(() => {
        return (dates: [Date | null, Date | null] | null) => {
            if (dates && dates[0]) {
                setFrom(moment(dates[0]).format('YYYY-MM-DD'))
                setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
            }
        }
    }, [])

    const CARDDATA = [
        {
            handleClick: () => handleReceived(from, To_Date),
            img: <RiFileList3Fill className="text-4xl mx-4 text-blue-700" />,
            label: 'Received Orders',
            p1Data: receiverOrderValue ?? 0,
            p2Data: homeData?.received.total_amount?.toFixed(2),
        },
        {
            handleClick: () => handleCompleted(from, To_Date),
            img: <IoBagCheck className="text-4xl mx-4 text-green-600" />,
            label: 'Completed Orders',
            p1Data: homeData?.completed.count,
            p2Data: homeData?.completed.total_amount?.toFixed(2),
        },
        {
            handleClick: () => handleReturned(from, To_Date),
            img: <IoMdReturnLeft className="text-4xl mx-4 text-red-500" />,
            label: 'Returned Orders',
            p1Data: netReturn,
            p2Data: netReturnSales?.toFixed(2),
        },
    ]

    const CARDDATA2nd = [
        {
            label: 'Net Sales',
            img: <HiCurrencyRupee className="text-5xl mx-4 text-green-500 " />,
            p1Tag: 'Amount: Rs.',
            p1Data: netSales?.toFixed(2),
        },
        {
            label: 'Average Order Value',
            img: <FaMoneyBillTrendUp className="text-4xl mx-4 text-yellow-400 " />,
            p1Tag: 'Value:',
            p1Data: averageOrderValue ? averageOrderValue?.toFixed(2) : 0,
        },
        {
            label: 'Average Basket Size',
            img: <FaShoppingCart className="text-4xl mx-4 text-amber-500 " />,
            p1Tag: 'Value:',
            p1Data: basketSize ? basketSize.toFixed(2) : 0,
        },
    ]

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="flex flex-col gap-6  p-2 shadow-xl rounded-xl">
            {loading && (
                <div className="flex items-center justify-center ">
                    <span className="shadow-xl p-2 rounded-[50px]">
                        {' '}
                        <Spinner size={30} />
                    </span>
                </div>
            )}
            <div className="flex flex-col xl:flex-row  mb-4 gap-5 ">
                <div className="w-full xl:mt-6 items-start flex justify-start">
                    <div className="flex flex-col xl:flex-row gap-4 xl:justify-center ">
                        <div className="flex items-center gap-1 p-2 rounded-md w-full  lg:w-[300px] bg-white shadow-md dark:bg-gray-900">
                            <input
                                ref={(el) => (inputRefs.current['customerNumber'] = el)}
                                type="text"
                                name="customer"
                                placeholder="Search by Customer Number"
                                className="flex-1 p-2 rounded-md focus:outline-none focus:ring-2 dark:bg-gray-900"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && inputRefs.current['customerNumber']?.value) {
                                        handleCustomerFunction(inputRefs.current['customerNumber']?.value)
                                    }
                                }}
                            />
                            <button
                                className="p-2 py-3 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                onClick={() => handleCustomerFunction(inputRefs.current['customerNumber']?.value || '')}
                            >
                                <FaSearch />
                            </button>
                        </div>
                        <div className="flex items-center gap-1 p-2 rounded-md w-full lg:w-[300px] bg-white shadow-md dark:bg-gray-900">
                            <input
                                ref={(el) => (inputRefs.current['customerInvoice'] = el)}
                                type="text"
                                name="invoice_id"
                                placeholder="Search by Invoice ID"
                                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-900"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && inputRefs.current['customerInvoice']) {
                                        handleInvoiceFunction(inputRefs.current['customerInvoice']?.value)
                                    }
                                }}
                            />
                            <button
                                className="p-2 py-3 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                onClick={() => handleInvoiceFunction(inputRefs.current['customerInvoice']?.value || '')}
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </div>

                <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:mx-10">
                {CARDDATA.map((item, index) => (
                    <Card
                        key={index}
                        onClick={item.handleClick}
                        className="group cursor-pointer rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        <div className="flex items-start gap-4 ">
                            {/* Icon */}
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-3xl">
                                {item.img}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-1">
                                <h2 className="text-base font-semibold text-gray-800">{item.label}</h2>

                                <p className="text-sm text-gray-500">
                                    Count: <span className="font-medium text-gray-700">{item.p1Data}</span>
                                </p>

                                <p className="text-sm text-gray-500">
                                    Total Amount: <span className="font-semibold text-gray-800">₹{item.p2Data}</span>
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}

                {CARDDATA2nd.map((item, index) => (
                    <Card
                        key={index}
                        className="group cursor-pointer rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        <div className="flex items-start gap-4 ">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 text-purple-600 text-3xl">
                                {item.img}
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-gray-800">{item.label}</h2>
                                <p className="text-sm text-gray-500">
                                    {item.p1Tag} <span className="font-medium text-gray-700">{item.p1Data}</span>
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Delivery Type */}
                <Card className="rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start gap-4 ">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-600 text-3xl">
                            <MdDeliveryDining />
                        </div>

                        <div className="text-sm text-gray-600 space-y-1 ">
                            <h2 className="text-base font-semibold text-gray-800">Delivery Type</h2>

                            <p>
                                Express: <span className="font-medium">{homeData?.delivery_type.EXPRESS ?? 0}</span>
                            </p>
                            <p>
                                Standard: <span className="font-medium">{homeData?.delivery_type.STANDARD ?? 0}</span>
                            </p>
                            <p>
                                Try & Buy: <span className="font-medium">{homeData?.delivery_type.TRY_AND_BUY ?? 0}</span>
                            </p>
                            <p>
                                Exchange: <span className="font-medium">{homeData?.delivery_type.EXCHANGE ?? 0}</span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Device Type */}
                <Card className="rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start gap-4 ">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-600 text-3xl">
                            <PiDevicesFill />
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <h2 className="text-base font-semibold text-gray-800">Device Type</h2>
                            <p>
                                Android: <span className="font-medium">{homeData?.device_type.ANDROID ?? 0}</span>
                            </p>
                            <p>
                                Web: <span className="font-medium">{homeData?.device_type.WEB ?? 0}</span>
                            </p>
                            <p>
                                iOS: <span className="font-medium">{homeData?.device_type.IOS ?? 0}</span>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex items-center border-b border-gray-300 gap-2 mt-3">
                <button
                    className={`px-4 py-2  transition-all duration-200 text-xl font-bold ${
                        showReportData === 'sessions' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-green-600'
                    }`}
                    onClick={() => setShowReportData((prev) => (prev === 'sessions' ? '' : 'sessions'))}
                >
                    Sessions
                </button>
                <button
                    className={`px-4 py-2 text-xl font-bold transition-all duration-200 ${
                        showReportData === 'split_orders'
                            ? 'border-b-2 border-green-500 text-green-600'
                            : 'text-gray-500 hover:text-green-600'
                    }`}
                    onClick={() => setShowReportData((prev) => (prev === 'split_orders' ? '' : 'split_orders'))}
                >
                    Split Orders
                </button>
            </div>

            {showReportData === 'sessions' && (
                <div className="mt-4">
                    <ActiveUserTable
                        from={from}
                        to={to}
                        reportName="Daily_user_stats"
                        queryName="Overall_stats"
                        label="Active User Stats"
                    />
                </div>
            )}
            {showReportData === 'split_orders' && (
                <div className="mt-4">
                    <ActiveUserTable
                        isTable
                        from={from}
                        to={to}
                        reportName="Split Orders"
                        queryName="Bangalore Orders Overall"
                        label="Split orders"
                    />
                </div>
            )}

            <div className="mt-5 w-[320px] xl:w-full">
                {homeData?.brand_wise_sale && <BrandDataChart brandData={homeData?.brand_wise_sale} from={from} to={to} />}
            </div>
            <br />
            <div
                className={`flex items-center gap-3 px-5 py-3 text-white rounded-full cursor-pointer transition-all hover:scale-105 hover:shadow-xl active:scale-95 w-fit ${
                    viewMap ? 'bg-gradient-to-r from-red-500 to-red-700' : 'bg-gradient-to-r from-green-500 to-green-700'
                }`}
                onClick={() => setViewMap((prev) => !prev)}
            >
                {viewMap ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                <span className="font-semibold text-sm tracking-wider">{viewMap ? 'Hide Map' : 'View On Map'}</span>
                <FaMapMarkerAlt className="w-5 h-5" />
            </div>
            {viewMap && (
                <div className="mt-8">
                    <Tabs defaultValue="orders" onChange={(tab) => setActiveTab(tab)}>
                        <TabList>
                            <TabNav
                                value="orders"
                                className="text-xl"
                                icon={<MdOutlinePendingActions className="text-blue-600 text-2xl" />}
                            >
                                Order Location
                            </TabNav>
                            <TabNav value="users" className="text-xl" icon={<HiUserGroup className="text-green-500 text-2xl" />}>
                                User Location
                            </TabNav>
                        </TabList>
                    </Tabs>

                    <HomepageMaps activeTab={activeTab} from={from} to={to} setAccessDenied={setAccessDenied} />
                </div>
            )}
        </div>
    )
}

export default Home
