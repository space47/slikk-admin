/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { SalesData } from './homes.common'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import Card from '@/components/ui/Card'
import { RiFileList3Fill } from 'react-icons/ri'
import { IoMdReturnLeft } from 'react-icons/io'
import { FaSearch, FaShoppingCart } from 'react-icons/fa'
import { HiCurrencyRupee } from 'react-icons/hi'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import BrandDataChart from '../homeChart/BubbleChart'
import MultipleMap from '@/common/multipleMap'
import { MdDeliveryDining } from 'react-icons/md'
import { PiDevicesFill } from 'react-icons/pi'
import { FaMoneyBillTrendUp } from 'react-icons/fa6'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import AccessDenied from '@/views/pages/AccessDenied'
import ActiveUserTable from './componentsHomes/ActiveUserTable'
import { IoBagCheck } from 'react-icons/io5'

const Home = () => {
    const [orders, setOrders] = useState<any[]>([])
    const [homeData, setHomeData] = useState<SalesData | null>(null)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('YYYY-MM-DD'))
    const [inputValues, setInputValues] = useState({
        customer: '',
        invoice_id: '',
    })
    const [accessDenied, setAccessDenied] = useState(false)
    const [isPageActive, setIsPageActive] = useState(true)
    const navigate = useNavigate()

    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

    const fetchHome = async () => {
        try {
            // const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/merchant/analytics/order?from=${from}&to=${To_Date}`)
            const data: SalesData = response.data.data
            setHomeData(data)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.log('Error fetching data:', error)
        }
    }

    const fetchOrderForLocation = async () => {
        try {
            // const to = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/merchant/orders?location_data=true&from=${from}&to=${To_Date}`)

            const ordersData = response.data?.data
            setOrders(ordersData)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchOrderForLocation()
    }, [from, to])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsPageActive(false)
                console.log('Page is inactive')
            } else {
                setIsPageActive(true)
                console.log('Page is active')
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
            fetchHome()
            interval = setInterval(fetchHome, 60000)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
                console.log('Interval cleared')
            }
        }
    }, [isPageActive, from, to])

    const netSales =
        (homeData?.received?.total_amount || 0) -
        (homeData?.returned?.total_amount || 0) -
        (homeData?.cancelled?.total_amount || 0) -
        (homeData?.declined?.total_amount || 0)

    const netReturn = (homeData?.returned?.count || 0) + (homeData?.cancelled?.count || 0) + (homeData?.declined?.count || 0)
    const netReturnSales =
        (homeData?.returned?.total_amount || 0) + (homeData?.cancelled?.total_amount || 0) + (homeData?.declined?.total_amount || 0)

    const averageOrderValue = homeData
        ? homeData?.received?.total_amount /
          (homeData?.received?.count - (homeData?.delivery_type?.EXCHANGE ? homeData?.delivery_type?.EXCHANGE : 0))
        : 0

    const dataValues = Object.values(homeData?.brand_wise_sale ?? {})

    const sum = dataValues.reduce((acc, value) => acc + value, 0)

    const basketSize = homeData
        ? sum / (homeData?.received?.count - (homeData?.delivery_type?.EXCHANGE ? homeData?.delivery_type?.EXCHANGE : 0))
        : 0

    const receiverOrderValue = homeData
        ? homeData?.received.count - (homeData?.delivery_type?.EXCHANGE ? homeData?.delivery_type?.EXCHANGE : 0)
        : 0

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleCustomerFunction = (inputName: string) => {
        navigate(`/app/customerAnalytics/${inputName}`)
    }

    const handleInvoiceFunction = (inputName: string) => {
        navigate(`/app/orders/${inputName}`)
    }
    const handleReceived = (from: string, to: string) => {
        navigate(`/app/orders`, {
            state: {
                var1: from,
                var2: to,
            },
        })
    }
    const handleReturned = (from: string, to: string) => {
        navigate(`/app/returnOrders`, {
            state: {
                var1: from,
                var2: to,
            },
        })
    }

    const handleCompleted = (from: string, to: string) => {
        navigate('/app/orders/completed', {
            state: {
                var1: from,
                var2: to,
            },
        })
    }
    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

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

    console.log(
        'item sddsdsaadqdqw',
        orders.map((item) => item.latitude || []),
    )

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Upar ka dabba */}

            <div className="flex flex-col xl:flex-row  xl:justify-between  mb-4 gap-5 ">
                <div className="w-full xl:w-[50%]">
                    <div className="font-bold text-2xl text-blue-900">Search By</div>
                    <div className="flex flex-col xl:flex-row gap-4 xl:justify-center ">
                        <div className="flex items-center gap-1 p-2 rounded-md w-full  lg:w-[400px] bg-white shadow-md dark:bg-gray-900">
                            <input
                                type="text"
                                name="customer"
                                value={inputValues.customer}
                                onChange={handleInputChange}
                                placeholder="Customer Number"
                                className="flex-1 p-2 rounded-md focus:outline-none focus:ring-2 dark:bg-gray-900"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleCustomerFunction(inputValues.customer)
                                    }
                                }}
                            />
                            <button
                                onClick={() => handleCustomerFunction(inputValues.customer)}
                                className="p-2 py-3 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <FaSearch />
                            </button>
                        </div>
                        <div className="flex items-center gap-1 p-2 rounded-md w-full lg:w-[400px] bg-white shadow-md dark:bg-gray-900">
                            <input
                                type="text"
                                name="invoice_id"
                                value={inputValues.invoice_id}
                                onChange={handleInputChange}
                                placeholder="Invoice ID"
                                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-900"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleInvoiceFunction(inputValues.invoice_id)
                                    }
                                }}
                            />
                            <button
                                onClick={() => handleInvoiceFunction(inputValues.invoice_id)}
                                className="p-2 py-3 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </div>

                <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 xl:mx-10">
                {CARDDATA.map((item, key) => (
                    <Card
                        className="shadow-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                        onClick={() => item.handleClick()}
                        key={key}
                    >
                        <div className="flex gap-10 items-center">
                            <div>{item.img}</div>
                            <div>
                                <h2 className="text-xl font-semibold">{item.label}</h2>
                                <p>Count: {item.p1Data}</p>
                                <p>
                                    Total Amount: Rs.
                                    {item.p2Data}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}

                {CARDDATA2nd.map((item, key) => (
                    <Card
                        key={key}
                        className="shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                    >
                        <div className="flex gap-10 items-center">
                            <div className="mt-2">{item.img}</div>
                            <div>
                                <h2 className="text-xl font-semibold">{item.label}</h2>
                                <p>
                                    {item.p1Tag} {item.p1Data}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}

                <Card className="shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                    <div className="flex gap-10 items-center">
                        <div>
                            <MdDeliveryDining className="text-5xl mx-4 text-blue-500 " />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Delivery Type</h2>
                            <p>Express: {homeData?.delivery_type.EXPRESS ? homeData?.delivery_type.EXPRESS : 0}</p>
                            <p>Standard: {homeData?.delivery_type.STANDARD ? homeData?.delivery_type.STANDARD : 0}</p>
                            <p>Try&Buy: {homeData?.delivery_type.TRY_AND_BUY ? homeData?.delivery_type.TRY_AND_BUY : 0}</p>
                            <p>Exchange: {homeData?.delivery_type.EXCHANGE ? homeData?.delivery_type.EXCHANGE : 0}</p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                    <div className="flex gap-10 items-center">
                        <div>
                            <PiDevicesFill className="text-5xl mx-4 " />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Device Type</h2>
                            <p>Android: {homeData?.device_type.ANDROID ? homeData?.device_type.ANDROID : 0}</p>
                            <p>Web: {homeData?.device_type.WEB ? homeData?.device_type.WEB : 0}</p>
                            <p>IOS: {homeData?.device_type.IOS ? homeData?.device_type.IOS : 0}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* CHART */}
            <div className="mt-4">
                <ActiveUserTable from={from} to={to} />
            </div>

            <div className="mt-5 w-[350px] xl:w-full">
                {homeData?.brand_wise_sale && <BrandDataChart brandData={homeData?.brand_wise_sale} from={from} to={to} />}
            </div>
            <br />
            <div className="text-2xl text-blue-900  font-bold">Location Wise Orders</div>
            <div className="flex justify-center items-start my-10 z-10">
                <div className="w-full xl:w-3/4">
                    <MultipleMap
                        latitudes={orders.map((item) => item.latitude || [])}
                        longitudes={orders?.map((item) => item?.longitude || [])}
                        amount={orders?.map((item) => item?.amount || [])}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home
