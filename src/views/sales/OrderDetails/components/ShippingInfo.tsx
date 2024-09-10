/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'

type ShippingInfoProps = {
    data?: {
        price: number
        create_date: number
        drop_time: number
        shippingLogo: string

        runner_name: string
        runner_phone_number: string
        runner_profile_pic_url: string
        state: string
        tracking_url: string
        awb_code: any
    }
    logistic_partner: any
    delivery_type: string
}

const ShippingInfo = ({
    data,
    logistic_partner,
    delivery_type,
}: ShippingInfoProps) => {
    return (
        <Card className="mb-4">
            <h5 className="mb-4">Shipping</h5>
            <div className="flex flex-col mb-6 gap-5">
                <span className="font-bold"> RIDER DETAILS:</span>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        {' '}
                        <Avatar
                            shape="circle"
                            src={data?.runner_profile_pic_url}
                        />
                        <div className="items-start">
                            <div className="flex gap-2">
                                <span>{data?.runner_name}-</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <HiPhone />{' '}
                                <span>{data?.runner_phone_number}</span>
                            </div>
                            <div className="flex gap-2">
                                <span>AWB :{data?.awb_code}</span>
                            </div>
                            <div className="url">
                                <a
                                    href={data?.tracking_url}
                                    className="flex items-center cursor-pointer"
                                >
                                    <HiLocationMarker className="text-xl" />{' '}
                                    <p>Click to track location</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col">
                    <div className="flex gap-3">
                        Logistic Partner : <span>{logistic_partner}</span>
                    </div>
                    <div className="flex gap-3">
                        Delivery Type : <span>{delivery_type}</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ShippingInfo
