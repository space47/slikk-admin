import Card from '@/components/ui/Card'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink, HiMail } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { ReturnOrder } from '@/store/types/returnOrderData.types'

interface Props {
    returnOrder: ReturnOrder
}

const ReturnUserInfo: React.FC<Props> = ({ returnOrder }) => {
    return (
        <div className="flex flex-col gap-4">
            <Card>
                <h5 className="mb-4">Customer Details</h5>
                <Link className="group flex items-center justify-between" to={`/app/customerAnalytics/${returnOrder?.user?.mobile}`}>
                    <div className="flex items-center">
                        <div className="ltr:ml-2 rtl:mr-2">
                            <span className="text-xl font-bold flex gap-1">
                                {returnOrder?.user?.first_name}
                                {returnOrder?.user?.last_name}
                            </span>
                        </div>
                    </div>
                    <HiExternalLink className="text-xl hidden group-hover:block" />
                </Link>
                <hr className="my-5" />

                <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                    <span className="font-semibold">{returnOrder?.user?.mobile}</span>
                </IconText>
                <IconText icon={<HiMail className="text-xl opacity-70" />}>
                    <span className="font-semibold">{returnOrder?.user?.email}</span>
                </IconText>
            </Card>
        </div>
    )
}

export default ReturnUserInfo
