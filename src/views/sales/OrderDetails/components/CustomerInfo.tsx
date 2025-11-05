import { useRef } from 'react'
import Card from '@/components/ui/Card'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink } from 'react-icons/hi'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { BsFillPrinterFill } from 'react-icons/bs'

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
    location_url: string
    delivery_type: string
    distance?: number
    alternate_number?: string
}

const CustomerInfo = ({ user, billing_address, store, location_url, delivery_type, distance, alternate_number }: CustomerInfoProps) => {
    const printRef = useRef<HTMLDivElement>(null)

    const generatePrint = () => {
        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                <div style="margin-bottom: 40px;">
                    <h3>To:</h3>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <p>${user.name}</p>
                        <p>${billing_address.replace(/\n/g, '<br>')}</p>
                        <p>Mob no.-${user.mobile}</p>
                    </div>
                </div>
    
                <div>
                    <h3>From:</h3>
                    <div>
                        <p>${store.address.replace(/\n/g, '<br>')}</p>
                        <p>Bhupesh Saran</p>
                        <p>9351037494</p>
                    </div>
                </div>
            </div>
        `

        const printWindow = window.open('', '_blank', 'width=800,height=600')
        if (printWindow) {
            printWindow.document.open()
            printWindow.document.write(`
                <html>
                    <head>
                        <title>''</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                            }
                            h3 {
                                margin-bottom: 10px;
                            }
                            p {
                                margin: 0;
                                word-wrap: break-word;
                            }
                            .to-section,
                            .from-section {
                                margin-bottom: 40px;
                            }
                            .to-section > div {
                                display: flex;
                                flex-direction: column;
                                gap: 10px;
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `)
            printWindow.document.close()
            printWindow.print()
        }
    }

    return (
        <Card>
            <div ref={printRef}>
                <h5 className="mb-4">Customer Details</h5>
                <Link className="group flex items-center justify-between" to={`/app/customerAnalytics/${user.mobile}`}>
                    <div className="flex items-center">
                        <div className="ltr:ml-2 rtl:mr-2">
                            <span className="text-xl font-bold">{user.name}</span>
                        </div>
                    </div>
                    <HiExternalLink className="text-xl hidden group-hover:block" />
                </Link>
                <hr className="my-5" />

                <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                    <span className="font-semibold">
                        <a href={`tel:${user.mobile}`} className="hover:text-blue-600">
                            {user.mobile}
                        </a>
                    </span>
                </IconText>
                <hr className="my-5" />
                <h6 className="mb-4">Shipping Address</h6>
                <address className="not-italic">
                    <div>{store.address}</div>
                </address>
                <hr className="my-5" />
                <h6 className="mb-4">
                    <a href={location_url} target="_blank" rel="noreferrer" className="flex gap-2 items-center">
                        Billing address <FaMapMarkedAlt className="text-lg" />
                    </a>
                </h6>
                <address className="not-italic">
                    <div className="mb-1">{billing_address}</div>
                    {alternate_number && (
                        <div className="font-bold">
                            Alternate Number:{' '}
                            <span className="text-green-500">
                                {' '}
                                <a href={`tel:${alternate_number}`} className="hover:text-blue-600">
                                    {alternate_number}
                                </a>
                            </span>
                        </div>
                    )}
                </address>
                <hr className="my-5" />
            </div>
            <div className="flex gap-3 font-bold text-md items-center mb-4">
                <span>Distance</span>
                <span className="font-semibold">{distance ?? 0} km</span>
            </div>
            <div className="mt-4 flex gap-4">
                {delivery_type === 'STANDARD' && (
                    <button className="px-4 py-2 bg-none text-gray-500 rounded hover:text-blue-600 " onClick={generatePrint}>
                        <BsFillPrinterFill className="text-2xl " />
                    </button>
                )}
            </div>
        </Card>
    )
}

export default CustomerInfo
