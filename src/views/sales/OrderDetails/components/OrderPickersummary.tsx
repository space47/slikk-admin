/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import { FaUserAlt } from 'react-icons/fa'

import { Button, Dropdown, Select } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useEffect, useState } from 'react'
import { LOGISTIC_PARTNER } from './activityCommon'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams } from 'react-router-dom'

interface OrderPickerSummaryProps {
    data: any
}

// const options = [
//     { label: 'new', value: 'new' },
//     { label: 'pending', value: 'pending' },
//     { label: 'packed', value: 'packed' },
// ]

const OrderPickerSummary = ({ data }: OrderPickerSummaryProps) => {
    const [pickerChange, setPickerChange] = useState<string | undefined>('')
    const [pickerData, setPickerData] = useState<any[] | undefined>([])
    const { invoice_id } = useParams()

    const fetchPickerData = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/group/users?group=picker`)
            const data = response?.data?.data
            setPickerData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPickerData()
    }, [])

    const options = pickerData?.map((item) => ({ label: item.name, value: item.mobile }))

    console.log('picker data', pickerData)

    const handlePickerChange = async () => {
        const body = {
            action: 'ASSIGN_PICKER',
            picker: pickerChange,
        }
        try {
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({
                message: response?.data?.message || 'Successfully changed picker',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to change picker',
            })
            console.error(error)
        }
    }

    return (
        <Card className="mb-4">
            <h5 className="mb-4 text-lg font-semibold">PICKER</h5>
            <div className="flex flex-col gap-6">
                <span className="font-bold text-sm sm:text-base">PICKER DETAILS:</span>
                <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start">
                    <Avatar shape="circle" src={data?.picker?.image} size="lg" />
                    <div className="sm:ml-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                                <FaUserAlt /> <span className="text-sm sm:text-base">{data?.picker?.name}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <HiPhone className="font-bold" /> <span className="text-sm sm:text-base">{data?.picker?.mobile}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="border-t" />
                <div className="font-bold">
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex gap-2 text-sm sm:text-base">Change Picker:</div>
                            <div className="w-full max-w-md">
                                <Select
                                    isClearable
                                    className="w-full sm:w-1/2"
                                    options={options}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    onChange={(newVal) => {
                                        setPickerChange(newVal?.value)
                                    }}
                                />
                            </div>
                            <div>
                                <Button
                                    variant="accept"
                                    size="sm"
                                    onClick={handlePickerChange}
                                    disabled={!pickerChange}
                                    className="w-full sm:w-auto"
                                >
                                    Change
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default OrderPickerSummary
