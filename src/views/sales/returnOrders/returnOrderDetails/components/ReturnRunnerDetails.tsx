import Card from '@/components/ui/Card'
// import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink } from 'react-icons/hi'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { Avatar } from '@/components/ui'

const ReturnRunnerDetails = () => {
    const returnOrder = useAppSelector<ReturnOrderState>(
        (state) => state.returnOrders,
    )
    const returnProducts = returnOrder?.returnOrders?.logistic

    return (
        <Card>
            <h5 className="mb-4">Runner Details</h5>
            <div className="group flex items-center justify-between">
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        src={returnProducts?.runner_profile_pic_url}
                    />
                    <div className="ltr:ml-2 rtl:mr-2">
                        <span className="text-xl font-bold flex gap-1">
                            {returnProducts?.runner_name}
                        </span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </div>
            <hr className="my-5" />

            <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                <span className="font-semibold">
                    {returnProducts?.runner_phone_number}
                </span>
            </IconText>

            <hr className="my-5" />

            {/* .......................................... */}
            <div className="time">
                <span>Total time : {returnProducts?.total_time}</span>
            </div>
            <div className="time">
                <span>Distance : {returnProducts?.distance}</span>
            </div>
            <div className="time">
                <span>Pickup : {returnProducts?.eta_pickup}</span>
            </div>
            <div className="time">
                <span>Drop : {returnProducts?.eta_dropoff}</span>
            </div>

            {/* <hr className="my-5" />
            <h6 className="mb-4">Shipping Address</h6>
            <address className="not-italic">
                
            </address>
            <hr className="my-5" />
            <h6 className="mb-4">Billing address</h6>
            <address className="not-italic">
              
            </address> */}
        </Card>
    )
}

export default ReturnRunnerDetails
