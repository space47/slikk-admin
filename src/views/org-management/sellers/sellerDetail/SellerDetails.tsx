/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { notification, Empty, Spin } from 'antd'
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
import { FaDownload } from 'react-icons/fa'
import SellerDetailWarehouse from '../sellerUtils/SellerDetailWarehouse'
import { commonPresignedDownload } from '@/common/commonDownload'
import moment from 'moment'
import { SellerStatus } from '../sellerCommon'

const SellerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [sellerData, setSellerData] = useState<VendorDetails>()
    const [isCommentModal, setIsCommentModal] = useState(false)
    const [dataForComment, setDataForComment] = useState<{ name: string; label: string }>({ name: '', label: '' })
    const [commentStructure, setCommentStructure] = useState<Record<string, string>>({})
    const [statusToProceed, setStatusToProceed] = useState<SellerStatus | ''>('')
    const [confirmModal, setConfirmModal] = useState(false)

    const [vendorApprove, approveResponse] = vendorService.useVendorApprovalMutation()
    const { data, isSuccess, isError, isLoading, error, refetch } = vendorService.useGetSingleVendorListQuery(
        { id: id as string },
        { skip: !id },
    )

    useEffect(() => {
        if (isSuccess) setSellerData(data?.data as any)
        if (isError) notification.error({ message: (error as any)?.data?.message })
    }, [isSuccess, isError, data?.data])

    useEffect(() => {
        if (approveResponse?.isSuccess) {
            notification.success({ message: approveResponse?.data?.message || 'Successfully sent for approval' })
            setConfirmModal(false)
            refetch()
        }
        if (approveResponse?.isError) {
            notification.error({ message: getApiErrorMessage(approveResponse?.error) || 'Failed to send for approval' })
        }
    }, [approveResponse?.isSuccess, approveResponse?.isError])

    const { BasicSellerInformationDetail, sections, documentsList } = useMemo(() => {
        return SellerDetailCommon({ seller: sellerData })
    }, [sellerData])

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

    const StatusVariant = (status: string) => {
        if (!status) return SellerStatus.PENDING
        const lower = status.toLowerCase()
        if (lower === SellerStatus.APPROVED) return 'accept'
        if (lower === SellerStatus.REJECTED || lower === 'reject') return 'reject'
        return SellerStatus.PENDING
    }

    const IconSelector = (status: string) => {
        if (!status) return null
        const lower = status.toLowerCase()
        if (lower === SellerStatus.APPROVED) return <IoCheckmarkOutline />
        if (lower === SellerStatus.REJECTED || lower === 'reject') return <MdCancel />
        return null
    }

    const handleDownload = async (fileUrl: string, fileName: string) => {
        await commonPresignedDownload(fileUrl, fileName)
    }

    return (
        <Spin className="min-h-screen bg-gray-50 p-6" spinning={isLoading}>
            <div className="mb-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            {sellerData?.registered_name || '--'}
                        </h1>
                        <p className="text-sm text-gray-500">Seller Profile Overview</p>
                    </div>
                    <Button
                        variant={StatusVariant(sellerData ? sellerData?.status : '') as 'accept' | 'reject' | 'pending'}
                        size="lg"
                        className="rounded-full px-6 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        icon={sellerData ? IconSelector(sellerData?.status) : null}
                    >
                        {sellerData?.status}
                    </Button>
                </div>

                {/* Metadata Pills with Gradient Backgrounds */}
                <div className="mt-4 flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r  bg-gray-100 px-4 py-2 border border-amber-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Code</span>
                        <span className="text-sm font-medium text-gray-900">{sellerData?.code || '--'}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r bg-gray-100 px-4 py-2 border border-amber-100 ">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 ">Created</span>
                        <span className="text-sm font-medium text-gray-900">
                            {moment(sellerData?.create_date).format('YYYY_MM_DD HH:mm:ss a') || '--'}
                        </span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r bg-gray-100 px-4 py-2 border border-amber-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 ">Updated</span>
                        <span className="text-sm font-medium text-gray-900">
                            {moment(sellerData?.update_date).format('YYYY_MM_DD HH:mm:ss a') || '--'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <Button variant="twoTone" onClick={() => navigate(`/app/sellers/${id}`)}>
                    Edit Details
                </Button>
            </div>

            {sellerData?.status?.toLowerCase() === SellerStatus.APPROVED ? (
                <div className="space-y-6">
                    <Card className="group overflow-hidden rounded-2xl border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="relative p-6">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                            <h2 className="mb-6 text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </span>
                                Basic Information
                            </h2>

                            {BasicSellerInformationDetail?.length ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {BasicSellerInformationDetail.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200"
                                        >
                                            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{item.label}</span>
                                            <p className="mt-1 text-base font-medium text-gray-900">{item.value || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Empty
                                    description={<span className="text-gray-500">No data available</span>}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    className="py-12"
                                />
                            )}
                        </div>
                    </Card>

                    {sections.map(
                        (section, index) =>
                            section.data && (
                                <Card
                                    key={index}
                                    className="group overflow-hidden rounded-2xl border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative p-6">
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

                                        <h2 className="mb-6 text-lg font-semibold text-gray-800">{section.title}</h2>

                                        {section.isArraySection ? (
                                            <div className="space-y-4">
                                                {section.data[0]?.value?.map((company: any, companyIdx: number) => (
                                                    <div
                                                        key={companyIdx}
                                                        className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <div>
                                                                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                    Company Name
                                                                </span>
                                                                <p className="mt-1 text-base font-medium text-gray-900">
                                                                    {company.company_name || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                    Legal Name
                                                                </span>
                                                                <p className="mt-1 text-base font-medium text-gray-900">
                                                                    {company.company_legal_name || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                    GSTIN
                                                                </span>
                                                                <p className="mt-1 text-base font-medium text-gray-900">
                                                                    {company.gstin || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                    Code
                                                                </span>
                                                                <p className="mt-1 text-base font-medium text-gray-900">
                                                                    {company.code || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                    Registered Address
                                                                </span>
                                                                <p className="mt-1 text-base font-medium text-gray-900">
                                                                    {company.registered_address || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                    Bill To
                                                                </span>
                                                                <p className="mt-1 text-base font-medium text-gray-900">
                                                                    {company.bill_to || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                    Ship To
                                                                </span>
                                                                <p className="mt-1 text-base font-medium text-gray-900">
                                                                    {company.ship_to || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                {section.data.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200"
                                                    >
                                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                            {item.label}
                                                        </span>
                                                        <p className="mt-1 text-base font-medium text-gray-900">{item.value || 'N/A'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ),
                    )}

                    <SellerDetailWarehouse sellerData={sellerData} />
                    <Card className="rounded-2xl border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="relative p-6">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>

                            <h2 className="mb-6 text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </span>
                                Documents & Verifications
                            </h2>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {documentsList.map((doc) => (
                                    <div
                                        key={doc.key}
                                        className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4 hover:border-gray-200 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${doc.file ? 'bg-green-100' : 'bg-gray-100'}`}
                                            >
                                                {doc.file ? (
                                                    <svg
                                                        className="h-5 w-5 text-green-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className="h-5 w-5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{doc.label}</p>
                                                <p className={`text-xs ${doc.file ? 'text-green-600' : 'text-red-500'}`}>
                                                    {doc.file ? 'Uploaded & Verified' : 'Pending Upload'}
                                                </p>
                                            </div>
                                        </div>

                                        {doc.file ? (
                                            <Button
                                                variant="twoTone"
                                                color="green"
                                                size="md"
                                                icon={<FaDownload />}
                                                onClick={() => handleDownload(`${doc.file}`, doc.label)}
                                                className="rounded-full border-0 bg-green-50 px-4 hover:bg-green-100 transition-all duration-200"
                                            >
                                                Download
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="twoTone"
                                                color="gray"
                                                size="md"
                                                disabled
                                                className="rounded-full border-0 bg-gray-100 text-gray-400 cursor-not-allowed"
                                            >
                                                Unavailable
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="rounded-2xl bg-white shadow-md p-6">
                    <SellerBeforeApproval
                        sellerData={sellerData as VendorDetails}
                        commentStructure={commentStructure}
                        handleComments={handleComments}
                        setConfirmModal={setConfirmModal}
                        setStatusToProceed={setStatusToProceed}
                    />
                </div>
            )}
            {/* Modals */}
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
                IsConfirm={statusToProceed !== SellerStatus.REJECTED}
                IsDelete={statusToProceed === SellerStatus.REJECTED}
                headingName="Confirmation to proceed Further"
                onDialogOk={handleProceed}
            />
        </Spin>
    )
}

export default SellerDetails
