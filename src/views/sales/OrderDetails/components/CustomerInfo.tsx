import Card from '@/components/ui/Card'
// import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink } from 'react-icons/hi'
import { Link } from 'react-router-dom'

type CustomerInfoProps = {
    user: {
        name: string
        mobile: string
    }
    store: {
        address: string
        latitude: number
        longitude: number
    }
    billing_address: string
}

const CustomerInfo = ({ user, billing_address, store }: CustomerInfoProps) => {
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
                        <span className="text-xl font-bold">{user.name}</span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </Link>
            <hr className="my-5" />

            <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                <span className="font-semibold">{user.mobile}</span>
            </IconText>
            <hr className="my-5" />
            <h6 className="mb-4">Shipping Address</h6>
            <address className="not-italic">
                <div>{store.address}</div>
            </address>
            <hr className="my-5" />
            <h6 className="mb-4">Billing address</h6>
            <address className="not-italic">
                <div className="mb-1">{billing_address}</div>
            </address>
        </Card>
    )
}

export default CustomerInfo
