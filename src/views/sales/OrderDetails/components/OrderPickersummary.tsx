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
            <h5 className="mb-4">PICKER</h5>
            <div className="flex flex-col mb-6 gap-5">
                <span className="font-bold"> PICKER DETAILS:</span>
                <div className="flex flex-col gap-3 ">
                    <div className="flex flex-col gap-3">
                        <Avatar shape="circle" src={data?.picker?.image} size="lg" />
                        <div className="mx-3">
                            <div className="items-start flex flex-col gap-1">
                                <div className="flex gap-2 items-center">
                                    <FaUserAlt /> <span>{data?.picker?.name}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <HiPhone className="font-bold" /> <span>{data?.picker?.mobile}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className=" font-bold ">
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">Change Picker:</div>
                            <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                <Select
                                    isClearable
                                    className="w-1/2"
                                    options={options}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    onChange={(newVal) => {
                                        setPickerChange(newVal?.value)
                                    }}
                                />
                            </div>

                            {/* button for api */}
                            <div>
                                <Button variant="accept" size="sm" onClick={handlePickerChange} disabled={!pickerChange}>
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
