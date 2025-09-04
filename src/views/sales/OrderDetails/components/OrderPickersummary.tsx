/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { HiPhone } from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import { FaUserAlt } from 'react-icons/fa'
import { Button, Select } from '@/components/ui'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams } from 'react-router-dom'
import StoreSelectComponent from '@/common/StoreSelectComponent'

interface OrderPickerSummaryProps {
    data: any
}

const OrderPickerSummary = ({ data }: OrderPickerSummaryProps) => {
    const [pickerChange, setPickerChange] = useState<string | undefined>('')
    const [pickerData, setPickerData] = useState<any[] | undefined>([])
    const [storeId, setStoreId] = useState<any>(null)
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

    const handlePickerChange = async () => {
        const body = {
            action: 'ASSIGN_PICKER',
            picker: pickerChange,
            store_id: storeId?.id,
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
        <Card className="mb-6 rounded-2xl shadow-md border border-gray-200 bg-white">
            <h5 className="mb-6 text-lg font-semibold text-gray-800 border-b pb-3">Order Picker</h5>

            <div className="flex flex-col gap-6">
                {/* Picker Details */}
                <span className="font-semibold text-sm text-gray-600">Current Picker</span>
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                    <Avatar shape="circle" src={data?.picker?.image} size="lg" />
                    <div className="sm:ml-3 text-center sm:text-left">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-700">
                                <FaUserAlt className="text-gray-500" />
                                <span className="font-medium">{data?.picker?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <HiPhone className="text-gray-500" />
                                <span className="font-medium">{data?.picker?.mobile || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Change Picker Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col gap-3 w-full sm:w-2/3">
                        <Select
                            isClearable
                            className="w-full"
                            options={options}
                            placeholder="Select a new picker..."
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            onChange={(newVal) => {
                                setPickerChange(newVal?.value)
                            }}
                        />
                        <StoreSelectComponent isSingle label="Select Store" store={storeId} setStore={setStoreId} />
                    </div>

                    <div className="w-full sm:w-auto">
                        <Button
                            variant="accept"
                            size="sm"
                            disabled={!pickerChange}
                            className="w-full sm:w-auto px-6 py-2 rounded-xl shadow-sm font-medium transition-all duration-200 
                                       disabled:opacity-50 disabled:cursor-not-allowed 
                                       hover:shadow-md hover:scale-[1.02]"
                            onClick={handlePickerChange}
                        >
                            Change Picker
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default OrderPickerSummary
