import Card from '@/components/ui/Card'
// import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink, HiMail } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'

const ReturnUserInfo = () => {
    const returnOrder = useAppSelector<ReturnOrderState>(
        (state) => state.returnOrders,
    )
    const returnProducts = returnOrder?.returnOrders?.user

    return (
        <Card>
            <h5 className="mb-4">Customer Details</h5>
            <Link
                className="group flex items-center justify-between"
                to="/app/crm/customer-details?id=11"
            >
                <div className="flex items-center">
                    {/* <Avatar shape="circle" src={data?.img} /> */}
                    <div className="ltr:ml-2 rtl:mr-2">
                        {/* <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {data?.name}
                        </div> */}
                        <span className="text-xl font-bold flex gap-1">
                            {returnProducts?.first_name}
                            {returnProducts?.last_name}
                        </span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </Link>
            <hr className="my-5" />

            <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                <span className="font-semibold">{returnProducts?.mobile}</span>
            </IconText>
            <IconText icon={<HiMail className="text-xl opacity-70" />}>
                <span className="font-semibold">{returnProducts?.email}</span>
            </IconText>
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

export default ReturnUserInfo
