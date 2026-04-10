import { Button, Card } from '@/components/ui'
import { PurchaseOrderTable } from '@/store/types/po.types'
import React from 'react'
import { BiHash, BiMapPin, BiPhone } from 'react-icons/bi'
import { FaCheck, FaUser, FaWarehouse } from 'react-icons/fa'
import { FiClock } from 'react-icons/fi'
import { MdEmail, MdOutlineCancel, MdOutlineCheckCircle } from 'react-icons/md'

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

    const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => {
        return (
            <div className="flex gap-3">
                <div className="mt-1 text-gray-400">{icon}</div>
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                    <div className="text-sm font-medium text-gray-800 mt-1">{value || '-'}</div>
                </div>
            </div>
        )
    }

    const WarehouseData = () => {
        const warehouseData = purchaseDetail?.gst_details

        if (!warehouseData) return null

        return (
            <Card className="shadow-lg rounded-2xl p-6 bg-white border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-800">Warehouse Details</h2>
                    </div>

                    <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                            warehouseData?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}
                    >
                        {warehouseData?.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Section */}
                    <div className="space-y-4">
                        <DetailItem icon={<FaWarehouse size={16} />} label="Warehouse Name" value={warehouseData?.warehouse_name} />

                        <DetailItem icon={<BiHash size={16} />} label="GSTIN" value={warehouseData?.gstin} />

                        <DetailItem
                            icon={<BiMapPin size={16} />}
                            label="Address"
                            value={
                                <div
                                    className="text-sm text-gray-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: warehouseData?.warehouse_address,
                                    }}
                                />
                            }
                        />
                    </div>

                    {/* Right Section */}
                    <div className="space-y-4">
                        <DetailItem icon={<FaUser size={16} />} label="POC Name" value={warehouseData?.poc_name} />

                        <DetailItem icon={<MdEmail size={16} />} label="POC Email" value={warehouseData?.poc_email} />

                        <DetailItem icon={<BiPhone size={16} />} label="POC Contact" value={warehouseData?.poc_contact_number} />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
                    Last Updated: {new Date(warehouseData?.update_date).toLocaleString()}
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
            { label: 'Order Billing Address', value: purchaseDetail?.order_billing_address || '-' },
            { label: 'Order Shipping Address', value: purchaseDetail?.order_shipping_address || '-' },
            { label: 'Payment Mode', value: purchaseDetail?.payment_mode || '-' },
            { label: 'Payment Summary', value: purchaseDetail?.payment_terms || '-' },
            { label: 'PO Nature', value: purchaseDetail?.po_nature || '-' },
            {
                label: 'Purchase With GST',
                value: purchaseDetail?.with_gst ? 'Yes' : 'NO',
                highlight: true,
                highlightColor: `${purchaseDetail?.with_gst ? 'text-green-500' : 'text-red-500'}`,
            },
            {
                label: 'Calculation on Price Tag',
                value: purchaseDetail?.with_sp ? 'SP' : 'MRP',
                highlight: true,
                highlightColor: `text-blue-500`,
            },
            { label: 'Total Items', value: purchaseDetail?.total_count ?? 0, highlight: true },
            {
                label: 'Total Amount',
                value: purchaseDetail?.total_amount ? `₹ ${Number(purchaseDetail.total_amount).toLocaleString('en-IN')}` : '₹ 0',
                highlight: true,
            },
        ]

        return (
            <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white p-6 h-full">
                <div className="flex flex-col gap-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Summary</h4>
                    </div>
                    <div className="flex flex-col divide-y divide-gray-100">
                        {OrderDataArray.map((item, index) => (
                            <div key={index} className="flex justify-between items-start py-4 gap-6">
                                <span className="text-sm text-gray-500 font-medium">{item.label}</span>

                                <span
                                    className={`text-sm text-right break-words max-w-[60%] ${
                                        item.highlight
                                            ? `font-semibold  ${item.highlightColor ? item.highlightColor : 'text-gray-900'} text-base`
                                            : 'font-medium text-gray-700'
                                    }`}
                                >
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

    return { ButtonUI, ActivityBar, VendorInformation, OrderInformation, statusConfig, WarehouseData }
}
