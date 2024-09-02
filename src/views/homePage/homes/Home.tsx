import React, { useEffect, useState } from 'react'
import { SalesData } from './homes.common'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import Card from '@/components/ui/Card'
import { RiFileList3Fill } from 'react-icons/ri'
import { IoMdReturnLeft } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import { GrCompliance } from 'react-icons/gr'
import { HiOutlineCalendar } from 'react-icons/hi'
import DatePicker from '@/components/ui/DatePicker'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { TbCalendarStats } from 'react-icons/tb'
import { HiMiniBanknotes } from 'react-icons/hi2'
import BrandDataChart from '../homeChart/BubbleChart'

const Home = () => {
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
            const response = await axiosInstance.get(
                `/merchant/analytics/order?from=${from}&to=${To_Date}`,
            )
            const data: SalesData = response.data.data
            setHomeData(data)
        } catch (error) {
            console.log('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchHome()
    }, [from, to])

    const netSales =
        (homeData?.received?.total_amount || 0) -
        (homeData?.returned?.total_amount || 0)

    const handleFromChange = (date: Date | null) => {
        if (date) {
            setFrom(moment(date).format('YYYY-MM-DD'))
        } else {
            setFrom(moment().format('YYYY-MM-DD'))
        }
    }

    const handleToChange = (date: Date | null) => {
        if (date) {
            setTo(moment(date).format('YYYY-MM-DD'))
        } else {
            setTo(moment().format('YYYY-MM-DD'))
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleCustomerFunction = (inputName: string) => {
        console.log('CUSTOMER', inputName)
        navigate(`/app/customerAnalytics/${inputName}`)
    }

    const handleInvoiceFunction = (inputName: string) => {
        console.log('INVOICE', inputName)
        navigate(`/app/orders/${inputName}`)
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-wrap gap-5 justify-end">
                <div className="w-full sm:w-auto">
                    <div className="mb-1 font-semibold text-sm">FROM DATE:</div>
                    <DatePicker
                        inputPrefix={<HiOutlineCalendar className="text-lg" />}
                        defaultValue={new Date()}
                        value={new Date(from)}
                        onChange={handleFromChange}
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <div className="mb-1 font-semibold text-sm">TO DATE:</div>
                    <DatePicker
                        inputSuffix={<TbCalendarStats className="text-xl" />}
                        defaultValue={new Date()}
                        value={moment(to).toDate()}
                        onChange={handleToChange}
                        minDate={moment(from).add(1, 'day').toDate()}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:mx-10">
                <Card className="shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <RiFileList3Fill className="text-4xl mx-4 text-blue-700" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                Received Orders
                            </h2>
                            <p>Count: {homeData?.received.count}</p>
                            <p>
                                Total Amount: Rs.
                                {homeData?.received.total_amount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <GrCompliance className="text-4xl mx-4 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                Completed Orders
                            </h2>
                            <p>Count: {homeData?.completed.count}</p>
                            <p>
                                Total Amount: Rs.
                                {homeData?.completed.total_amount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <IoMdReturnLeft className="text-4xl mx-4 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                Returned Orders
                            </h2>
                            <p>Count: {homeData?.returned.count}</p>
                            <p>
                                Total Amount: Rs.
                                {homeData?.returned.total_amount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <HiMiniBanknotes className="text-4xl mx-4 text-yellow-400 " />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Net Sales</h2>
                            <p>Amount: Rs.{netSales.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* CHART */}

            <div className="mt-5 w-[350px] xl:w-full">
                {homeData?.brand_wise_sale && (
                    <BrandDataChart brandData={homeData?.brand_wise_sale} />
                )}
            </div>

            <div>
                <h5>Search By</h5>
                <div className="flex flex-col xl:flex-row gap-4 mt-5 xl:justify-center">
                    <div className="flex items-center gap-1 p-2 rounded-md w-full lg:w-[400px] bg-white shadow-md">
                        <input
                            type="text"
                            name="customer"
                            value={inputValues.customer}
                            onChange={handleInputChange}
                            placeholder="Customer Number"
                            className="flex-1 p-2 rounded-md focus:outline-none focus:ring-2"
                        />
                        <button
                            onClick={() =>
                                handleCustomerFunction(inputValues.customer)
                            }
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
                        />
                        <button
                            onClick={() =>
                                handleInvoiceFunction(inputValues.invoice_id)
                            }
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
