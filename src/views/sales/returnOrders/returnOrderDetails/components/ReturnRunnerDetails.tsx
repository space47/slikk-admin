import Card from '@/components/ui/Card'
// import Avatar from '@/components/ui/Avatar'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { Avatar, Dropdown } from '@/components/ui'
import { LOGISTIC_PARTNER } from '@/views/sales/OrderDetails/components/activityCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useState } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { FaUserAlt } from 'react-icons/fa'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

const ReturnRunnerDetails = () => {
    const navigate = useNavigate()
    const [partnerChange, setPartnerChange] = useState<string>('')
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnProducts = returnOrder?.returnOrders?.return_order_delivery
    const return_Partner = returnProducts?.find((item) => item?.state !== 'CANCELLED')?.partner

    const handleDeliveryChange = async (value: string) => {
        console.log('value for it', value)
        const body = {
            action: 'create_reverse_pickup',
            re_create: 'yes',
            logistic_partner: value,
        }
        try {
            const response = await axioisInstance.patch(`merchant/return_order/${returnOrder?.returnOrders?.return_order_id}`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Created Task Successfully',
            })
            setPartnerChange(value)
            navigate(0)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card className="card">
            <h5 className="mb-4">Runner Details</h5>
            <div className="group flex flex-col gap-2">
                <div className="flex gap-5  flex-col">
                    <div className="ltr:ml-2 rtl:mr-2 flex  justify-center items-center">
                        <span className="text-xl font-bold flex gap-1">{returnProducts?.at(-1)?.partner}</span>
                    </div>
                    <div className="flex flex-col gap-3 ">
                        <div className="flex flex-col gap-3">
                            <Avatar shape="circle" src={returnProducts?.at(-1)?.runner_profile_pic_url} size="lg" />
                            <div className="mx-3">
                                <div className="items-start flex flex-col gap-1">
                                    <div className="flex gap-2 items-center">
                                        <FaUserAlt /> <span>{returnProducts?.at(-1)?.runner_name}</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <HiPhone className="font-bold" /> <span>{returnProducts?.at(-1)?.runner_phone_number}</span>
                                    </div>

                                    <div className="url">
                                        <a href={returnProducts?.at(-1)?.tracking_url} className="flex items-center cursor-pointer">
                                            <HiLocationMarker className="text-xl" />
                                            <p className="text-blue-600 hover:underline">Track location</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="time">
                    <span className="font-bold">
                        {returnProducts?.at(-1)?.awb_code ? (
                            <span>AWB :{returnProducts?.at(-1)?.awb_code}</span>
                        ) : (
                            <span>Task_id:{returnProducts?.at(-1)?.task_id}</span>
                        )}
                    </span>
                </div>
                <div className="flex gap-2 items-center">
                    <div> Change Partner: </div>
                    <div className="w-auto bg-slate-200 rounded-lg">
                        <Dropdown
                            className="w-full px-1 py-1 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm font-bold"
                            title={partnerChange !== '' ? partnerChange : (return_Partner ?? 'SELECT')}
                            onSelect={(value) => handleDeliveryChange(value)}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {LOGISTIC_PARTNER.map((item, key) => (
                                    <DropdownItem
                                        key={key}
                                        eventKey={item.value}
                                        className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                    >
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ReturnRunnerDetails
