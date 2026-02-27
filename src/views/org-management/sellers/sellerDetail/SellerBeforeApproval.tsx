/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Tooltip } from '@/components/ui'
import { VendorDetails } from '@/store/types/vendor.type'
import { Badge, Tabs } from 'antd'
import React, { useMemo, useState } from 'react'
import { BiSolidCommentCheck, BiCommentAdd, BiCommentDetail } from 'react-icons/bi'
import { FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaBuilding } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import { IoCheckmarkOutline, IoDocumentTextOutline, IoBusinessOutline, IoReceiptOutline } from 'react-icons/io5'
import { MdCancel, MdOutlineInsertDriveFile, MdOutlinePerson } from 'react-icons/md'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { BsBank, BsCashCoin } from 'react-icons/bs'
import { RiGovernmentLine } from 'react-icons/ri'
import { SellerStatus } from '../sellerCommon'
import { SellerDetailCommon } from '../sellerUtils/sellerDetailCommon'
import CommonAccordion from '@/common/CommonAccordion'

interface Props {
    commentStructure: Record<string, string>
    handleComments: (name: string, label: string) => void
    sellerData: VendorDetails
    setStatusToProceed: React.Dispatch<React.SetStateAction<'' | SellerStatus>>
    setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
}

const SellerBeforeApproval = ({ commentStructure, handleComments, sellerData, setStatusToProceed, setConfirmModal }: Props) => {
    const [activeTab, setActiveTab] = useState('basic')

    const parseFileList = (value: string) => {
        if (!value) return []
        return value?.split(',').map((file) => ({
            uid: file.trim(),
            name: file.trim().split('/').pop() || 'file',
            url: file.trim(),
        }))
    }

    const getFileIcon = (filename: string) => {
        const ext = filename?.split('.').pop()?.toLowerCase()
        if (ext === 'pdf') return <FaFilePdf className="text-red-500 text-xl" />
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <FaFileImage className="text-blue-500 text-xl" />
        if (['doc', 'docx'].includes(ext || '')) return <FaFileWord className="text-blue-700 text-xl" />
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FaFileExcel className="text-green-600 text-xl" />
        return <MdOutlineInsertDriveFile className="text-gray-500 text-xl" />
    }

    const { BasicSellerInformationDetail, documentsList, sections } = useMemo(() => {
        return SellerDetailCommon({ seller: sellerData })
    }, [sellerData])

    const hasComments = Object.keys(commentStructure).length > 0

    const hasFieldComment = (fieldName: string) => {
        return commentStructure[fieldName] !== undefined
    }
    const renderFieldWithComment = (label: string, name: string, value: any, isFile?: boolean, isObject?: boolean) => {
        const hasComment = hasFieldComment(name)

        return (
            <div
                className={`relative group p-4 rounded-lg border transition-all ${
                    hasComment ? 'bg-blue-50/50 border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                }`}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-600 text-sm font-medium truncate">{label}</span>
                            {hasComment && (
                                <Badge count="!" className="shadow-sm flex-shrink-0" style={{ backgroundColor: '#faad14' }} size="small" />
                            )}
                        </div>
                        {isFile ? (
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {parseFileList(value).map((file: any) => (
                                    <a
                                        key={file.uid}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                                    >
                                        {getFileIcon(file.name)}
                                        <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                                        <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                            View
                                        </span>
                                    </a>
                                ))}
                            </div>
                        ) : isObject ? (
                            <pre className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 overflow-auto max-h-32 whitespace-pre-wrap break-words">
                                {JSON.stringify(value, null, 2)}
                            </pre>
                        ) : (
                            <p className="text-sm text-gray-900 font-medium bg-white p-2 rounded-lg border border-gray-200 break-words">
                                {value?.toString() || '—'}
                            </p>
                        )}
                    </div>

                    <Tooltip title={hasComment ? 'Edit comment' : 'Add comment'}>
                        <button
                            onClick={() => handleComments(name, label)}
                            className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                                hasComment
                                    ? 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                                    : 'text-gray-400 bg-white hover:bg-gray-100 hover:text-gray-600'
                            }`}
                        >
                            {hasComment ? <BiSolidCommentCheck className="text-lg" /> : <BiCommentAdd className="text-lg" />}
                        </button>
                    </Tooltip>
                </div>
                {hasComment && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex items-start gap-2">
                            <BiCommentDetail className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-blue-700 mb-1 break-words">
                                    Changes required: {commentStructure[name]}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const renderSection = (title: string, data: any[], key: string) => {
        return (
            <div key={key} className="space-y-4 mt-7">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map((item) => (
                        <div key={item.name}>{renderFieldWithComment(item.label, item.name, item.value, item.isFile, item.isArray)}</div>
                    ))}
                </div>
            </div>
        )
    }

    const renderArraySection = (title: string, data: any[]) => {
        return (
            <div className="space-y-4 mt-10">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {data.map((item: any, index: number) => (
                        <Card key={index} className="border border-gray-200 shadow-sm">
                            <CommonAccordion
                                startClosed
                                header={
                                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                        <FaBuilding className="text-gray-400" />
                                        {title === 'Warehouse Details' ? `Warehouse ${index + 1}` : `Company ${index + 1}`}
                                    </h4>
                                }
                            >
                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-1">
                                        {Object.entries(item).map(([key, val]: [string, any]) => {
                                            if (val === null || val === undefined || val === '') return null

                                            const isGstCertificate = key.includes('gst_certificate')
                                            const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                                            if (isGstCertificate) {
                                                return (
                                                    <div key={key} className="break-words col-span-1 md:col-span-2">
                                                        {renderFieldWithComment('GST Certificate', `gst_certificate_${index}`, val, true)}
                                                    </div>
                                                )
                                            }
                                            return (
                                                <div key={key} className="break-words">
                                                    {renderFieldWithComment(label, `${title}_${index}_${key}`, val)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </CommonAccordion>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }
    const tabItems = [
        {
            key: 'basic',
            label: (
                <span className="flex items-center gap-2 px-2">
                    <IoBusinessOutline className="text-lg" />
                    Basic Information
                    {BasicSellerInformationDetail.some((item) => hasFieldComment(item.name)) && (
                        <Badge count="!" size="small" className="ml-1" />
                    )}
                </span>
            ),
            children: <div className="space-y-6">{renderSection('Basic Information', BasicSellerInformationDetail, 'basic-section')}</div>,
        },
        ...sections.map((section) => ({
            key: section.key,
            label: (
                <span className="flex items-center gap-2 px-2">
                    {section.key === 'Business Details' && <RiGovernmentLine className="text-lg" />}
                    {section.key === 'POC Details' && <MdOutlinePerson className="text-lg" />}
                    {section.key === 'Bank Details' && <BsBank className="text-lg" />}
                    {section.key === 'Commercials' && <BsCashCoin className="text-lg" />}
                    {section.key === 'Internal Details' && <FaBuilding className="text-lg" />}
                    {section.key === 'MSME Details' && <IoReceiptOutline className="text-lg" />}
                    {section.key === 'Declaration' && <IoDocumentTextOutline className="text-lg" />}
                    {![
                        'Business Details',
                        'POC Details',
                        'Bank Details',
                        'Commercials',
                        'Internal Details',
                        'MSME Details',
                        'Declaration',
                    ].includes(section.key) && <HiOutlineDocumentText className="text-lg" />}
                    {section.title}
                    {section.data?.some((item: any) => hasFieldComment(item.name)) && <Badge count="!" size="small" className="ml-1" />}
                </span>
            ),
            children: section.isArraySection
                ? renderArraySection(section.title, section.data[0]?.value || [])
                : renderSection(section.title, section.data, section.key),
        })),
        {
            key: 'documents',
            label: (
                <span className="flex items-center gap-2 px-2">
                    <FaFilePdf className="text-lg" />
                    Documents
                    {documentsList.some((doc) => hasFieldComment(doc.name)) && <Badge count="!" size="small" className="ml-1" />}
                </span>
            ),
            children: (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-gray-800">Vendor Documents</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto p-1">
                        {documentsList.map((doc) => (
                            <div key={doc.key} className="break-words">
                                {renderFieldWithComment(doc.label, doc.name, doc.file, true)}
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <Card className="shadow-sm rounded-xl border-0 bg-gradient-to-r bg-blue-50  overflow-hidden">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <IoDocumentTextOutline className="text-3xl" />

                        <div>
                            <h2 className="text-2xl font-bold mb-1">Vendor Review</h2>
                            <p className="text-blue-900">Review and validate vendor information before approval</p>
                        </div>
                    </div>
                    {hasComments && (
                        <Badge.Ribbon
                            text={`${Object.keys(commentStructure).length} Comment(s)`}
                            color="gold"
                            className="shadow-lg bg-green-600"
                        >
                            <div className="w-16 h-16"></div>
                        </Badge.Ribbon>
                    )}
                </div>
            </Card>

            <Card className="shadow-sm rounded-xl border border-gray-100 bg-white overflow-hidden">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    tabBarStyle={{
                        marginBottom: '0',
                        background: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb',
                    }}
                    tabBarGutter={8}
                    size="small"
                />
            </Card>
            <Card className="shadow-sm rounded-xl border border-gray-100 bg-white">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                        <Button
                            variant="accept"
                            size="lg"
                            icon={<IoCheckmarkOutline className="text-lg" />}
                            className="w-full sm:w-auto min-w-[140px] shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 text-white"
                            onClick={() => {
                                setStatusToProceed(SellerStatus.APPROVED)
                                setConfirmModal(true)
                            }}
                        >
                            Accept Vendor
                        </Button>

                        <Button
                            variant="reject"
                            size="lg"
                            icon={<MdCancel className="text-lg" />}
                            className="w-full sm:w-auto min-w-[140px] shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 text-white"
                            onClick={() => {
                                setStatusToProceed(SellerStatus.REJECTED)
                                setConfirmModal(true)
                            }}
                        >
                            Reject Vendor
                        </Button>

                        <Button
                            variant="twoTone"
                            color="blue-600"
                            size="lg"
                            icon={<IoIosSend className="text-lg" />}
                            className="w-full sm:w-auto min-w-[140px] shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0 text-white"
                            onClick={() => {
                                setStatusToProceed(SellerStatus.CHANGES_REQUESTED)
                                setConfirmModal(true)
                            }}
                        >
                            Request Changes
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default SellerBeforeApproval
