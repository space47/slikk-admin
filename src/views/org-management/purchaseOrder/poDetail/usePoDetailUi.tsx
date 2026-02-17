import { Button, Card } from '@/components/ui'
import { PurchaseOrderTable } from '@/store/types/po.types'
import React from 'react'
import { FaCheck, FaRegCommentDots } from 'react-icons/fa'
import { FiClock } from 'react-icons/fi'
import { MdOutlineCancel, MdOutlineCheckCircle } from 'react-icons/md'

interface Props {
    purchaseDetail: PurchaseOrderTable
    handleApprove?: () => void
}

export const usePoDetailUi = ({ purchaseDetail, handleApprove }: Props) => {
    const getStatusStyle = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return {
                    icon: <MdOutlineCheckCircle className="text-green-600" />,
                    style: 'bg-green-50 text-green-700 border-green-200',
                }
            case 'rejected':
                return {
                    icon: <MdOutlineCancel className="text-red-600" />,
                    style: 'bg-red-50 text-red-700 border-red-200',
                }
            case 'pending':
                return {
                    icon: <FiClock className="text-yellow-600" />,
                    style: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                }
            default:
                return {
                    icon: <FiClock className="text-gray-500" />,
                    style: 'bg-gray-50 text-gray-600 border-gray-200',
                }
        }
    }

    const statusConfig = getStatusStyle(purchaseDetail?.status)

    const ButtonUI = () => {
        return (
            <div className="flex xl:flex-row flex-col gap-3 items-center">
                <Button variant="blue" size="sm" icon={<FaCheck />} onClick={handleApprove}>
                    Approve and Send to Vendor
                </Button>
                {/* <Button variant="blue" size="sm" icon={<FaRegCommentDots />}>
                    Add Comments
                </Button> */}
            </div>
        )
    }

    const ActivityBar = () => {
        const ApproverDetail = [
            { label: 'PO Nature', value: purchaseDetail?.po_nature },
            { label: 'Approver Name', value: purchaseDetail?.approver_name },
        ]
        return (
            <Card className="shadow-xl">
                <div className="flex justify-between">
                    <div>
                        <h6>Status Timeline</h6>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        {ApproverDetail?.map((item, key) => (
                            <div key={key} className="flex justify-between items-center py-1 gap-2">
                                <span className="text-blue-500 font-bold">{item?.label}:</span>
                                <span className="text-gray-800 font-semibold">{item?.value || '-'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

    const VendorInformation = () => {
        const VendorDataArray = [
            { label: 'Vendor Name', value: purchaseDetail?.brand_name },
            { label: 'Vendor GST', value: purchaseDetail?.vendor_gst_no },
            { label: 'Vendor Address', value: purchaseDetail?.vendor_address },
        ]

        return (
            <Card className="shadow-xl h-full">
                <div>
                    <h4>Vendor Information</h4>
                    {VendorDataArray?.map((item, key) => (
                        <div key={key} className="flex h-full justify-between items-center py-1 gap-2 mt-5">
                            <span className="text-gray-500 font-bold">{item?.label}:</span>
                            <span className="text-gray-800 font-semibold">{item?.value || '-'}</span>
                        </div>
                    ))}
                </div>
            </Card>
        )
    }
    const OrderInformation = () => {
        const OrderDataArray = [
            { label: 'Order Billing Address', value: purchaseDetail?.order_billing_address },
            { label: 'Order Shipping Address', value: purchaseDetail?.order_shipping_address },
            { label: 'Total Items', value: purchaseDetail?.total_count ?? 0 },
            { label: 'Total Amount', value: purchaseDetail?.total_amount },
        ]

        return (
            <Card className="shadow-xl h-full">
                <div>
                    <h4>Order Summary</h4>
                    {OrderDataArray?.map((item, key) => (
                        <div key={key} className="flex h-full justify-between items-center py-1 gap-2 mt-5">
                            <span className="text-gray-500 font-bold">{item?.label}:</span>
                            <span className="text-gray-800 font-semibold">{item?.value || '-'}</span>
                        </div>
                    ))}
                </div>
            </Card>
        )
    }

    return { ButtonUI, ActivityBar, VendorInformation, OrderInformation, statusConfig }
}
