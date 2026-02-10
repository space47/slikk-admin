import Card from '@/components/ui/Card'
// import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink } from 'react-icons/hi'
import { FaAddressCard } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { BiSolidLandmark } from 'react-icons/bi'

type InfoProps = {
    title: string
    name: string[]
    address: string[]
    landmark?: number[]
    latitude: string[]
    longitude: string[]
    contact_number: string[]
    className: string
}

const RiderInfo = ({ name, address, landmark, latitude, longitude, contact_number, title, className }: InfoProps) => {
    return (
        <Card className={className}>
            <h5 className="mb-4">{title} Details</h5>

            <hr className="my-5" />

            <div className="flex flex-col gap-4 items-start">
                <div className="font-bold flex gap-4">Name: {name}</div>

                <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                    <span className="font-semibold">Phone: {contact_number}</span>
                </IconText>
            </div>
            <hr className="my-5" />
            <h6 className="mb-4">Shipping Address</h6>
            <div className="flex flex-col items-start gap-4">
                <IconText icon={<FaAddressCard className="text-xl opacity-70" />}>
                    Address: <span className="font-semibold">{address}</span>
                </IconText>
                <IconText icon={<BiSolidLandmark className="text-xl opacity-70" />}>
                    Landmark : <span className="font-semibold">{landmark}</span>
                </IconText>
            </div>
            <hr className="my-5" />
            <h6 className="mb-4">Location</h6>
            <div className="flex flex-col">
                <address className="not-italic">
                    <div className="mb-1">Latitude: {latitude}</div>
                </address>
                <address className="not-italic">
                    <div className="mb-1">Longitude: {longitude}</div>
                </address>
            </div>
        </Card>
    )
}

export default RiderInfo
