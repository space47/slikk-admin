/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { notification, Collapse, Empty, Spin } from 'antd'
import { Button, Card, Tooltip } from '@/components/ui'
import { vendorService } from '@/store/services/vendorService'
import { VendorList } from '@/store/types/vendor.type'
import { SellerDetailCommon } from '../sellerUtils/sellerDetailCommon'
import { FaRegCommentAlt } from 'react-icons/fa'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { MdCancel } from 'react-icons/md'
import { IoIosSend } from 'react-icons/io'

const { Panel } = Collapse

const SellerDetails = () => {
    const { id } = useParams()
    const [sellerData, setSellerData] = useState<VendorList>()
    const { data, isSuccess, isError, isLoading, error } = vendorService.useGetSingleVendorListQuery({ id: id as string }, { skip: !id })

    useEffect(() => {
        if (isSuccess) setSellerData(data?.data)
        if (isError) notification.error({ message: (error as any)?.data?.message })
    }, [isSuccess, isError])

    const {
        BasicSellerInformationDetail,
        BusinessDetailsDetail,
        PocDetailsDetail,
        SellerBankDetail,
        SellerCommercialsDetail,
        SellerDeclarationDetail,
        SellerInternalDetail,
        SellerMsMeDetail,
        SellerWarehouseDetail,
    } = SellerDetailCommon({ seller: sellerData })

    const sections = [
        { title: 'Business Details', data: BusinessDetailsDetail },
        { title: 'POC Details', data: PocDetailsDetail },
        { title: 'Bank Details', data: SellerBankDetail },
        { title: 'Commercials', data: SellerCommercialsDetail },
        { title: 'Declaration', data: SellerDeclarationDetail },
        { title: 'Internal Details', data: SellerInternalDetail },
        { title: 'MSME Details', data: SellerMsMeDetail },
        { title: 'Warehouse Details', data: SellerWarehouseDetail },
    ]

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-4">
            {/* Basic Info Card */}
            <h4>{sellerData?.registered_name}</h4>
            <p>
                code:{sellerData?.code} || createdAt: {sellerData?.create_date} || updatedAt: {sellerData?.update_date}
            </p>
            <Card className="shadow-md rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h2>
                {BasicSellerInformationDetail?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {BasicSellerInformationDetail.map((item, idx) => (
                            <div key={idx} className="flex flex-col border-b border-gray-100 pb-2">
                                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                                <span className="text-base text-gray-800">{item.value || 'N/A'}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="No data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </Card>

            {/* Collapsible Sections */}
            <Collapse accordion bordered={false} className="bg-transparent space-y-2">
                {sections.map(
                    (section, index) =>
                        section.data && (
                            <Panel
                                key={index}
                                header={<span className="font-medium text-gray-800">{section.title}</span>}
                                className="border border-gray-200 rounded-xl bg-white shadow-sm"
                            >
                                {section.data.length ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2">
                                        {section.data.map((item, idx) => (
                                            <div key={idx} className="flex flex-col border-b border-gray-100 pb-2">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium text-gray-800"> {item.label}</span>
                                                    <span>
                                                        <Tooltip title="Add Comments ">
                                                            <FaRegCommentAlt className="cursor-pointer" />
                                                        </Tooltip>
                                                    </span>
                                                </div>
                                                <span className="text-base text-gray-800">{item.value || 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Empty description="No data available" image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-4" />
                                )}
                            </Panel>
                        ),
                )}
            </Collapse>
            <div className="flex justify-end items-center gap-2">
                <Button variant="accept" icon={<IoCheckmarkOutline />}>
                    Accept
                </Button>

                <Button variant="reject" icon={<MdCancel />}>
                    Reject
                </Button>

                <Button variant="twoTone" color="yellow" icon={<IoIosSend />}>
                    Send back with comments
                </Button>
            </div>
        </div>
    )
}

export default SellerDetails
