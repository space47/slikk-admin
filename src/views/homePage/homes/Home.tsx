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
import { MdDeliveryDining, MdOutlineFullscreen } from 'react-icons/md'
import { PiDevicesFill } from 'react-icons/pi'
import { FaMoneyBillTrendUp } from 'react-icons/fa6'
import UltimateDatePicker from '@/common/UltimateDateFilter'

const Home = () => {
    const [orders, setOrders] = useState<any[]>([])
    const [homeData, setHomeData] = useState<SalesData | null>(null)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [inputValues, setInputValues] = useState({
        customer: '',
        invoice_id: '',
    })
    const navigate = useNavigate()

    const fetchHome = async () => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/merchant/analytics/order?from=${from}&to=${To_Date}`)
            const data: SalesData = response.data.data
            setHomeData(data)
        } catch (error) {
            console.log('Error fetching data:', error)
        }
    }

    const fetchOrderForLocation = async () => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const response = await axiosInstance.get(`/merchant/orders?location_data=true&from=${from}&to=${To_Date}`)

            const ordersData = response.data?.data
            setOrders(ordersData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchOrderForLocation()
    }, [from, to])

    useEffect(() => {
        fetchHome()

        const interval = setInterval(fetchHome, 60000)

        return () => clearInterval(interval)
    }, [from, to])

    const handleShowFullScreen = () => {
        navigate(`/app/homePage/fullMap`, {
            state: {
                var1: from,
                var2: to,
            },
        })
    }

    const netSales =
        (homeData?.received?.total_amount || 0) -
        (homeData?.returned?.total_amount || 0) -
        (homeData?.cancelled?.total_amount || 0) -
        (homeData?.declined?.total_amount || 0)

    const netReturn = (homeData?.returned?.count || 0) + (homeData?.cancelled?.count || 0) + (homeData?.declined?.count || 0)
    const netReturnSales =
        (homeData?.returned?.total_amount || 0) + (homeData?.cancelled?.total_amount || 0) + (homeData?.declined?.total_amount || 0)

    const averageOrderValue = homeData ? homeData?.received?.total_amount / homeData?.received?.count : 0

    const dataValues = Object.values(homeData?.brand_wise_sale ?? {})

    const sum = dataValues.reduce((acc, value) => acc + value, 0)

    const basketSize = homeData ? sum / homeData?.received?.count : 0

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
    const handleReceived = (from, to) => {
        navigate(`/app/orders`, {
            state: {
                var1: from,
                var2: to,
            },
        })
    }
    const handleReturned = (from, to) => {
        navigate(`/app/returnOrders`, {
            state: {
                var1: from,
                var2: to,
            },
        })
    }

    const handleCompleted = (from, to) => {
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
            handleClick: () => handleReceived(from, to),
            img: <RiFileList3Fill className="text-4xl mx-4 text-blue-700" />,
            label: 'Received Orders',
            p1Data: homeData?.received.count,
            p2Data: homeData?.received.total_amount?.toFixed(2),
        },
        {
            handleClick: () => handleCompleted(from, to),
            img: <RiFileList3Fill className="text-4xl mx-4 text-blue-700" />,
            label: 'Completed Orders',
            p1Data: homeData?.completed.count,
            p2Data: homeData?.completed.total_amount?.toFixed(2),
        },
        {
            handleClick: () => handleReturned(from, to),
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

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Upar ka dabba */}

            <div className="flex flex-col xl:flex-row  xl:justify-between  mb-4 gap-5 ">
                <div className="w-full xl:w-[50%]">
                    <h5 className="font-sans">Search By</h5>
                    <div className="flex flex-col xl:flex-row gap-4 xl:justify-center ">
                        <div className="flex items-center gap-1 p-2 rounded-md w-full  lg:w-[400px] bg-white shadow-md">
                            <input
                                type="text"
                                name="customer"
                                value={inputValues.customer}
                                onChange={handleInputChange}
                                placeholder="Customer Number"
                                className="flex-1 p-2 rounded-md focus:outline-none focus:ring-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleCustomerFunction(inputValues.customer)
                                    }
                                }}
                            />
                            <button
                                onClick={() => handleCustomerFunction(inputValues.customer)}
                                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <FaSearch />
                            </button>
                        </div>
                        <div className="flex items-center gap-1 p-2 rounded-md w-full lg:w-[400px] bg-white shadow-md">
                            <input
                                type="text"
                                name="invoice_id"
                                value={inputValues.invoice_id}
                                onChange={handleInputChange}
                                placeholder="Invoice ID"
                                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleInvoiceFunction(inputValues.invoice_id)
                                    }
                                }}
                            />
                            <button
                                onClick={() => handleInvoiceFunction(inputValues.invoice_id)}
                                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
                    <Card className="shadow-lg cursor-pointer" onClick={() => item.handleClick()} key={key}>
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
                    <Card className="shadow-lg" key={key}>
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

                <Card className="shadow-lg">
                    <div className="flex gap-10 items-center">
                        <div>
                            <MdDeliveryDining className="text-5xl mx-4 text-blue-500 " />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Delivery Type</h2>
                            <p>Express: {homeData?.delivery_type.EXPRESS ? homeData?.delivery_type.EXPRESS : 0}</p>
                            <p>Standard: {homeData?.delivery_type.STANDARD ? homeData?.delivery_type.STANDARD : 0}</p>
                            <p>Try&Buy: {homeData?.delivery_type.TRY_AND_BUY ? homeData?.delivery_type.TRY_AND_BUY : 0}</p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow-lg">
                    <div className="flex gap-10 items-center">
                        <div>
                            <PiDevicesFill className="text-5xl mx-4  " />
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

            <div className="mt-5 w-[350px] xl:w-full">
                {homeData?.brand_wise_sale && <BrandDataChart brandData={homeData?.brand_wise_sale} />}
            </div>

            <div className="flex justify-center items-start my-10 z-10">
                <div className="w-full xl:w-3/4">
                    <MultipleMap
                        latitudes={orders.map((item) => item.latitude || [])}
                        longitudes={orders?.map((item) => item?.longitude || [])}
                        amount={orders?.map((item) => item?.amount || [])}
                    />
                    <div className="flex justify-start items-start cursor-pointer" onClick={handleShowFullScreen}>
                        <MdOutlineFullscreen className="text-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
