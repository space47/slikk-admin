/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { notification, Collapse, Empty, Spin } from 'antd'
import { Button, Card } from '@/components/ui'
import { vendorService } from '@/store/services/vendorService'
import { VendorDetails } from '@/store/types/vendor.type'
import { SellerDetailCommon } from '../sellerUtils/sellerDetailCommon'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { MdCancel } from 'react-icons/md'
import SellerCommentsModal from './SellerCommentsModal'
import DialogConfirm from '@/common/DialogConfirm'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import SellerBeforeApproval from './SellerBeforeApproval'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import { Formik } from 'formik'
import { FaDownload } from 'react-icons/fa'

const { Panel } = Collapse

const SellerDetails = () => {
    const { id } = useParams()
    const [sellerData, setSellerData] = useState<VendorDetails>()
    const [isCommentModal, setIsCommentModal] = useState(false)
    const [dataForComment, setDataForComment] = useState<{ name: string; label: string }>({
        name: '',
        label: '',
    })
    const [commentStructure, setCommentStructure] = useState<Record<string, string>>({})
    const [statusToProceed, setStatusToProceed] = useState<'approved' | 'rejected' | 'changes_requested' | ''>('')
    const [confirmModal, setConfirmModal] = useState(false)
    const [editingSection, setEditingSection] = useState<string | null>(null)

    const [vendorApprove, approveResponse] = vendorService.useVendorApprovalMutation()
    const { data, isSuccess, isError, isLoading, error } = vendorService.useGetSingleVendorListQuery({ id: id as string }, { skip: !id })

    useEffect(() => {
        if (isSuccess) setSellerData(data?.data as any)
        if (isError) notification.error({ message: (error as any)?.data?.message })
    }, [isSuccess, isError])

    useEffect(() => {
        if (approveResponse?.isSuccess) {
            notification.success({ message: approveResponse?.data?.message || 'Successfully sent for approval' })
        }
        if (approveResponse?.isError) {
            const errorMessage = getApiErrorMessage(approveResponse?.error)
            notification.error({ message: errorMessage || 'Failed to send for approval' })
        }
    }, [approveResponse?.isSuccess, approveResponse?.isError])

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
    } = useMemo(() => {
        return SellerDetailCommon({ seller: sellerData })
    }, [sellerData])

    const sections = [
        { key: 'Business Details', title: 'Business Details', data: BusinessDetailsDetail },
        { key: 'POC Details', title: 'POC Details', data: PocDetailsDetail },
        { key: 'Bank Details', title: 'Bank Details', data: SellerBankDetail },
        { key: 'Commercials', title: 'Commercials', data: SellerCommercialsDetail },
        { key: 'Declaration', title: 'Declaration', data: SellerDeclarationDetail },
        { key: 'Internal Details', title: 'Internal Details', data: SellerInternalDetail },
        { key: 'MSME Details', title: 'MSME Details', data: SellerMsMeDetail },
        { key: 'Warehouse Details', title: 'Warehouse Details', data: SellerWarehouseDetail },
    ]

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spin size="large" />
            </div>
        )
    }

    const handleComments = (name: string, label: string) => {
        setIsCommentModal(true)
        setDataForComment({ name: name, label: label })
    }

    const handleProceed = async () => {
        vendorApprove({
            company_id: id as string,
            comments: commentStructure,
            status: statusToProceed,
        })
    }

    const handleSectionUpdate = async (values: Record<string, any>) => {
        const body = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            body.append(key, value as string)
        })

        try {
            const res = await axiosInstance.patch(`/merchant/company/${id}`, body)
            notification.success({ message: res?.data?.message || 'Details updated successfully' })
            setEditingSection(null)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error.message })
            }
        }
    }

    const StatusVariant = (status: string) => {
        if (!status) return 'pending'
        const lower = status.toLowerCase()
        if (lower === 'approved') return 'accept'
        if (lower === 'rejected' || lower === 'reject') return 'reject'
        return 'pending'
    }

    const IconSelector = (status: string) => {
        if (!status) return null
        const lower = status.toLowerCase()
        if (lower === 'approved') return <IoCheckmarkOutline />
        if (lower === 'rejected' || lower === 'reject') return <MdCancel />
        return null
    }

    const handleDownload = (fileUrl: string, fileName: string) => {
        try {
            const link = document.createElement('a')
            link.href = fileUrl
            link.download = fileName || 'document'
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.click()
        } catch (error) {
            console.error('File download failed:', error)
        }
    }

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between">
                <h4>{sellerData?.registered_name}</h4>
                <Button
                    variant={StatusVariant(sellerData ? sellerData?.status : '') as 'accept' | 'reject' | 'pending'}
                    size="sm"
                    className="rounded-[100px]"
                    icon={sellerData ? IconSelector(sellerData?.status) : null}
                >
                    {sellerData?.status}
                </Button>
            </div>
            <p>
                code: {sellerData?.code} || createdAt: {sellerData?.create_date} || updatedAt: {sellerData?.update_date}
            </p>

            {sellerData?.status?.toLowerCase() === 'approved' ? (
                <>
                    <Card className="shadow-md rounded-2xl border border-gray-200 bg-white p-5">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h2>
                        {BasicSellerInformationDetail?.length ? (
                            editingSection === 'basic' ? (
                                <Formik
                                    initialValues={Object.fromEntries(BasicSellerInformationDetail.map((item) => [item.name, item.value]))}
                                    onSubmit={handleSectionUpdate}
                                >
                                    {({ handleChange, handleSubmit, values }) => (
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {BasicSellerInformationDetail.map((item, idx) => (
                                                    <div key={idx} className="flex flex-col border-b border-gray-100 pb-2">
                                                        <label className="text-sm font-medium text-gray-600">{item.label}</label>
                                                        <input
                                                            name={item.name}
                                                            value={values[item.name] || ''}
                                                            onChange={handleChange}
                                                            className="border border-gray-300 rounded-md p-1 text-gray-800"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    variant="twoTone"
                                                    color="gray"
                                                    type="button"
                                                    onClick={() => setEditingSection(null)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button variant="accept" type="submit">
                                                    Confirm
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {BasicSellerInformationDetail.map((item, idx) => (
                                            <div key={idx} className="flex flex-col border-b border-gray-100 pb-2">
                                                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                                                <span className="text-base text-gray-800">{item.value || 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="reject" size="sm" onClick={() => setEditingSection('basic')}>
                                        Update
                                    </Button>
                                </>
                            )
                        ) : (
                            <Empty description="No data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </Card>

                    <Collapse accordion bordered={false} className="bg-transparent space-y-2">
                        {sections.map(
                            (section, index) =>
                                section.data && (
                                    <Panel
                                        key={index}
                                        header={<span className="font-medium text-gray-800">{section.title}</span>}
                                        className="border border-gray-200 rounded-xl bg-white shadow-sm"
                                    >
                                        {editingSection === section.key ? (
                                            <Formik
                                                initialValues={Object.fromEntries(section.data.map((item) => [item.name, item.value]))}
                                                onSubmit={handleSectionUpdate}
                                            >
                                                {({ handleChange, handleSubmit, values }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {section.data.map((item, idx) => (
                                                                <div key={idx} className="flex flex-col border-b border-gray-100 pb-2">
                                                                    <label className="text-sm font-medium text-gray-600">
                                                                        {item.label}
                                                                    </label>
                                                                    <input
                                                                        name={item.name}
                                                                        value={values[item.name] || ''}
                                                                        onChange={handleChange}
                                                                        className="border border-gray-300 rounded-md p-1 text-gray-800"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <Button
                                                                variant="twoTone"
                                                                color="gray"
                                                                type="button"
                                                                onClick={() => setEditingSection(null)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button variant="accept" type="submit">
                                                                Confirm
                                                            </Button>
                                                        </div>
                                                    </form>
                                                )}
                                            </Formik>
                                        ) : (
                                            <>
                                                {section.data.length ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2">
                                                        {section.data.map((item, idx) => (
                                                            <div key={idx} className="flex flex-col border-b border-gray-100 pb-2">
                                                                <span className="font-bold text-gray-800"> {item.label}</span>
                                                                <span className="text-base text-gray-800">{item.value || 'N/A'}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Empty
                                                        description="No data available"
                                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                        className="py-4"
                                                    />
                                                )}
                                                <Button variant="reject" size="sm" onClick={() => setEditingSection(section.key)}>
                                                    Update
                                                </Button>
                                            </>
                                        )}
                                    </Panel>
                                ),
                        )}
                        <div className="mt-6">
                            <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white p-5">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Documents & Verifications</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                    {[
                                        { label: 'PAN Card', file: sellerData?.pan_copy, key: 'pan' },
                                        { label: 'GST Certificate', file: sellerData?.gst_certificate, key: 'gst' },
                                        { label: 'Cancelled Cheque', file: sellerData?.cancelled_cheque, key: 'cheque' },
                                        { label: 'MSME Certificate', file: sellerData?.msme_certificate, key: 'msme' },
                                    ].map((doc) => (
                                        <div
                                            key={doc.key}
                                            className="flex justify-between items-center border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all rounded-lg p-3 shadow-sm"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                                                <span className={`text-xs ${doc.file ? 'text-green-600' : 'text-red-500'}`}>
                                                    {doc.file ? 'Uploaded' : 'Not Uploaded'}
                                                </span>
                                            </div>

                                            {doc.file ? (
                                                <Button
                                                    variant="twoTone"
                                                    color="green"
                                                    size="sm"
                                                    icon={<FaDownload />}
                                                    onClick={() => handleDownload(`${doc.file}`, doc.label)}
                                                    className="rounded-full"
                                                >
                                                    Download
                                                </Button>
                                            ) : (
                                                <Button variant="twoTone" color="gray" size="sm" disabled className="rounded-full">
                                                    N/A
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </Collapse>
                </>
            ) : (
                <>
                    <SellerBeforeApproval
                        sellerData={sellerData as VendorDetails}
                        commentStructure={commentStructure}
                        handleComments={handleComments}
                        handleProceed={handleProceed}
                        setConfirmModal={setConfirmModal}
                        setStatusToProceed={setStatusToProceed}
                    />
                </>
            )}

            <SellerCommentsModal
                isOpen={isCommentModal}
                setIsOPen={setIsCommentModal}
                dataForComment={dataForComment}
                setCommentsStructure={setCommentStructure}
                commentsStructure={commentStructure}
            />

            <DialogConfirm
                IsOpen={confirmModal}
                setIsOpen={setConfirmModal}
                IsConfirm={statusToProceed !== 'rejected'}
                IsDelete={statusToProceed === 'rejected'}
                headingName="Confirmation to proceed Further"
                onDialogOk={handleProceed}
            />
        </div>
    )
}

export default SellerDetails
