/* eslint-disable @typescript-eslint/no-unused-vars */
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink } from 'react-icons/hi'
import { Link } from 'react-router-dom'

type Creator = {
    name: string
    dp: string
    followers_count: number
    likes_count: number
    comments_count: number
    views_count: number
}

const AcceptCreatorDetails = ({
    name,
    dp,
    followers_count,
    likes_count,
    comments_count,
    views_count,
}: Creator) => {
    return (
        <Card className="w-[240px]">
            <div className="mb-4 text-xl">Creator Info</div>
            <Link
                className="group flex items-center justify-between"
                to="/app/crm/customer-details?id=11"
            >
                <div className="flex items-center">
                    <Avatar shape="circle" src={dp} />
                    <div className="ltr:ml-2 rtl:mr-2">
                        {/* <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {data?.name}
                        </div> */}
                        <span className="text-xl font-bold">{name}</span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </Link>

            {/* <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                <span className="font-semibold">{user.mobile}</span>
            </IconText> */}
            <hr className="my-5" />

            {/* Details............................ */}
            <div className="details">
                <div className="flex gap-5">
                    <div className="mb-4 text-xl">Followers:</div>
                    <address className="not-italic">
                        <div className="text-[18px]">{followers_count}</div>
                    </address>
                </div>

                <div className="flex gap-5">
                    <div className="mb-4 text-xl">Likes:</div>
                    <address className="not-italic">
                        <div className="text-[18px]">{likes_count}</div>
                    </address>
                </div>
                <div className="flex gap-5">
                    <div className="mb-4 text-xl">Total Comments:</div>
                    <address className="not-italic">
                        <div className="text-[18px]">{comments_count}</div>
                    </address>
                </div>
                <div className="flex gap-5">
                    <div className="mb-4 text-xl">Total Views:</div>
                    <address className="not-italic">
                        <div className="text-[18px]">{views_count}</div>
                    </address>
                </div>
            </div>
            <hr className="my-5" />
            {/* <h6 className="mb-4">Billing address</h6>
            <address className="not-italic">
                <div className="mb-1">{billing_address}</div>
            </address> */}
        </Card>
    )
}

export default AcceptCreatorDetails
