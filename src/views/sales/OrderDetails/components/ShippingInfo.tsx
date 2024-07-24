import Card from '@/components/ui/Card'

import { NumericFormat } from 'react-number-format'
import moment from 'moment'

type ShippingInfoProps = {
    data?: {
        price: number
        create_date: number
        drop_time: number
        shippingLogo: string
        partner: number
        runner_name: string
        runner_phone_number: string
        runner_profile_pic_url: string
        state: string
    }
}

const ShippingInfo = ({ data }: ShippingInfoProps) => {
    return (
        <Card className="mb-4">
            <h5 className="mb-4">Shipping</h5>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-start flex-col gap-4">
                    <h3 className="text-md font-semibold">{data?.partner}</h3>

                    <div className=" flex flex-col">
                        <span>
                            Created :{' '}
                            {moment(data?.create_date).format(
                                'MM/DD/YYYY hh:mm:ss a',
                            )}
                        </span>
                        <span>
                            Drop Date :{' '}
                            {data?.state == 'COMPLETED' && (
                                <>
                                    {moment(data?.drop_time).format(
                                        'MM/DD/YYYY hh:mm:ss a',
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                </div>
                <span className="font-semibold">
                    <NumericFormat
                        displayType="text"
                        value={(
                            Math.round((data?.price || 0) * 100) / 100
                        ).toFixed(2)}
                        prefix={'Rs.'}
                        thousandSeparator={true}
                    />
                </span>
            </div>
            <div className="flex flex-col">
                {data?.runner_name}
                {data?.runner_phone_number}
                {data?.runner_profile_pic_url}
            </div>
        </Card>
    )
}

export default ShippingInfo
