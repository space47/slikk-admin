/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import { FaUserAlt } from 'react-icons/fa'
import { ShippingInfoProps } from '../orderList.common'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useState } from 'react'
import { LOGISTIC_PARTNER } from './activityCommon'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate, useParams } from 'react-router-dom'

const ShippingInfo = ({ data, logistic_partner, delivery_type, setShowRiderModal }: ShippingInfoProps) => {
    const [partnerChange, setPartnerChange] = useState<string>('')
    const { invoice_id } = useParams()
    const navigate = useNavigate()

    const handleDeliveryChange = async (value: string) => {
        setPartnerChange(value)
        try {
            const body = {
                action: 'CREATE_DELIVERY',
                delivery_partner: value ?? logistic_partner,
            }
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Created Task Successfully',
            })
            navigate(0)
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to create Task',
            })
        }
    }

    return (
        <Card className="mb-4">
            <h5 className="mb-4">Shipping</h5>
            <div className="flex flex-col mb-6 gap-5">
                <span className="font-bold"> RIDER DETAILS:</span>
                <div className="flex flex-col gap-3 ">
                    <div className="flex flex-col gap-3">
                        <Avatar shape="circle" src={data?.runner_profile_pic_url} size="lg" />
                        <div className="mx-3">
                            <div className="items-start flex flex-col gap-1">
                                <div className="flex gap-2 items-center">
                                    <FaUserAlt /> <span>{data?.runner_name}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <HiPhone className="font-bold" /> <span>{data?.runner_phone_number}</span>
                                </div>
                                <div className="flex gap-2">
                                    {data?.awb_code ? <span>AWB :{data?.awb_code}</span> : <span>Task_id:{data?.task_id}</span>}
                                </div>
                                <div className="url">
                                    <a href={data?.tracking_url} className="flex items-center cursor-pointer">
                                        <HiLocationMarker className="text-xl" />
                                        <p className="text-blue-600 hover:underline">Track location</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col gap-2 font-bold">
                    <div className="flex gap-3">
                        Logistic Partner : <span>{logistic_partner}</span>
                    </div>
                    <div className="flex gap-3">
                        Delivery Type : <span>{delivery_type}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div> Change Partner: </div>
                        <div className="w-auto bg-slate-200 rounded-lg">
                            <Dropdown
                                className="w-full px-1 py-1 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm font-bold"
                                title={partnerChange !== '' ? partnerChange : (logistic_partner ?? 'SELECT')}
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
                    {logistic_partner === 'Slikk' && (
                        <div className="mt-5">
                            <Button variant="new" size="sm" onClick={() => setShowRiderModal(true)}>
                                Assign Rider
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default ShippingInfo
