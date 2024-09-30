import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import DatePicker from '@/components/ui/DatePicker'
import { useAppDispatch, useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Button, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const Remitance = () => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    // const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>({
    //     value: '',
    //     name: '',
    // })
    const [brandValue, setBrandValue] = useState({})

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [])

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

    const handleDownload = async () => {
        try {
            const response = await axioisInstance.get(
                `/merchant/product/sales?brand=${brandValue?.name}&from=${from}&to=${to}&download=true`,
                {
                    responseType: 'blob',
                },
            )

            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${brandValue.name}-${from}to${to}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.log(error)
        }
    }

    const handleMultiSelect = (newVal) => {
        setBrandValue(newVal)
    }
    console.log(brandValue.name)

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-around">
                {/* Date Pickers Section */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-sm text-gray-700">From Date:</label>
                        <DatePicker
                            inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600" />}
                            defaultValue={new Date()}
                            value={new Date(from)}
                            onChange={handleFromChange}
                            className="w-56 rounded-md border-gray-300 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-sm text-gray-700">To Date:</label>
                        <DatePicker
                            inputPrefix={<HiOutlineCalendar className="text-lg text-gray-600" />}
                            defaultValue={new Date()}
                            value={moment(to).toDate()}
                            onChange={handleToChange}
                            minDate={moment(from).toDate()}
                            className="w-56 rounded-md border-gray-300 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Brands Dropdown Section */}
                <div className="flex flex-col items-start">
                    <label className="mb-2 font-semibold text-sm text-gray-700">Brands:</label>

                    <div className="flex flex-col w-[200px] scrollbar-hide">
                        <Select
                            // isMulti
                            // defaultValue={bannerForm[index]['brand'] || []}
                            options={brands.brands}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id.toString()}
                            onChange={(newVal) => {
                                handleMultiSelect(newVal)
                            }}
                        />
                    </div>
                </div>

                {/* Download Button */}
                <div className="flex justify-center items-center">
                    <Button onClick={handleDownload} variant="new">
                        Download
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Remitance
