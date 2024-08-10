import Card from '@/components/ui/Card'
// import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink, HiMail } from 'react-icons/hi'
import { Link } from 'react-router-dom'

type CustomerInfoProps = {
    last_updated_by: {
        name: string
        email: string
        mobile: string
    }

    total_sku: number
    total_quantity: number
}

const CustomerInfo = ({
    total_sku,
    last_updated_by,
    total_quantity,
}: CustomerInfoProps) => {
    return (
        <Card>
            <h5 className="mb-4">Updated By</h5>
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
                        <span className="text-xl font-bold">
                            {last_updated_by.name}
                        </span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </Link>
            <hr className="my-5" />

            <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                <span className="font-semibold">{last_updated_by.mobile}</span>
            </IconText>
            <IconText icon={<HiMail className="text-xl opacity-70" />}>
                <span className="font-semibold">{last_updated_by.email}</span>
            </IconText>
            <hr className="my-5" />

            <address className="not-italic flex gap-4 items-start">
                <h6 className="mb-4 ">Total SKU:</h6>{' '}
                <div className="font-bold text-[16px]">{total_sku}</div>
            </address>
            <address className="not-italic flex gap-4 items-start">
                <h6 className="mb-4 ">Total Quantity:</h6>{' '}
                <div className="font-bold text-[16px]">{total_quantity}</div>
            </address>

            {/* <h6 className="mb-4">Billing address</h6>
            <address className="not-italic">
                <div className="mb-1">{billing_address}</div>
            </address> */}
        </Card>
    )
}

export default CustomerInfo
