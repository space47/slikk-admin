/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Tooltip } from '@/components/ui'
import { VendorDetails } from '@/store/types/vendor.type'
import { Empty, Badge } from 'antd'
import React, { useMemo } from 'react'
import { BiSolidCommentCheck, BiCommentAdd } from 'react-icons/bi'
import { FaFilePdf, FaFileImage, FaFileWord, FaFileExcel } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import { IoCheckmarkOutline, IoDocumentTextOutline } from 'react-icons/io5'
import { MdCancel, MdOutlineInsertDriveFile } from 'react-icons/md'

interface Props {
    commentStructure: Record<string, string>
    handleComments: (name: string, label: string) => void
    sellerData: VendorDetails
    setStatusToProceed: React.Dispatch<React.SetStateAction<'' | 'approved' | 'rejected' | 'changes_requested'>>
    setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
}

const SellerBeforeApproval = ({ commentStructure, handleComments, sellerData, setStatusToProceed, setConfirmModal }: Props) => {
    const isFileValue = (value: string): boolean => {
        if (!value) return false
        const fileExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx']
        return fileExtensions.some((ext) => value.toLowerCase().includes(`.${ext}`))
    }

    const isFileKey = (key: string): boolean => {
        const keywords = ['copy', 'certificate', 'doc', 'image', 'photo', 'file', 'upload']
        return keywords.some((word) => key.toLowerCase().includes(word))
    }

    const parseFileList = (value: string) => {
        if (!value) return []
        return value.split(',').map((file) => ({
            uid: file.trim(),
            name: file.trim().split('/').pop() || 'file',
            url: file.trim(),
        }))
    }

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase()
        if (ext === 'pdf') return <FaFilePdf className="text-red-500 text-xl" />
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <FaFileImage className="text-blue-500 text-xl" />
        if (['doc', 'docx'].includes(ext || '')) return <FaFileWord className="text-blue-700 text-xl" />
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FaFileExcel className="text-green-600 text-xl" />
        return <MdOutlineInsertDriveFile className="text-gray-500 text-xl" />
    }

    const sellerFields = useMemo(() => {
        if (!sellerData) return []
        const ignoredKeys = ['comments', 'create_date', 'update_date', 'status', 'id']

        return Object.keys(sellerData)
            .filter((key) => !ignoredKeys.includes(key))
            .map((key) => {
                const value = (sellerData as any)[key]
                const isFile = typeof value === 'string' && (isFileValue(value) || isFileKey(key))
                const isObject = typeof value === 'object' && value !== null
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

                return { label, name: key, value, isFile, isObject }
            })
    }, [sellerData])

    const renderValue = (field: any) => {
        const { value, isFile, isObject } = field

        if (Array.isArray(value)) {
            return (
                <div className="space-y-4">
                    {value.map((item, idx) => {
                        const exclude = ['company', 'create_date', 'update_date']
                        return (
                            <Card key={idx} className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <IoDocumentTextOutline className="text-blue-500" />
                                        GST Detail {idx + 1}
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.keys(item)
                                            .filter((key) => !exclude.includes(key))
                                            .map((key) => {
                                                const subValue = item[key]
                                                const subLabel = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                                                const isSubFile = isFileKey(key) || (typeof subValue === 'string' && isFileValue(subValue))

                                                return (
                                                    <div key={key} className="bg-white rounded-lg p-3 border border-gray-100">
                                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            {subLabel}
                                                        </span>
                                                        {isSubFile ? (
                                                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                                                                {getFileIcon(subValue)}
                                                                <a
                                                                    href={subValue}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[200px]"
                                                                >
                                                                    {subValue?.split('/')?.pop()}
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <p className="mt-1 text-gray-800 font-medium">{subValue ?? '-'}</p>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )
        }

        if (isFile) {
            const files = parseFileList(value)
            return (
                <div className="flex flex-col gap-2">
                    {files.map((f, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100 hover:border-blue-200 transition-colors"
                        >
                            {getFileIcon(f.name || '')}
                            <a
                                href={f.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm truncate flex-1"
                            >
                                {f.name}
                            </a>
                            <Badge count="DOC" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }} />
                        </div>
                    ))}
                </div>
            )
        }

        if (isObject) {
            return (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-auto max-h-32">
                        {JSON.stringify(value, null, 2)}
                    </pre>
                </div>
            )
        }

        return <p className="text-gray-800 font-medium">{value ?? '-'}</p>
    }

    const hasComments = Object.keys(commentStructure).length > 0

    return (
        <div className="space-y-6">
            <Card className="shadow-sm rounded-xl border border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <IoDocumentTextOutline className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Vendor Review</h3>
                            <p className="text-sm text-gray-600">Review and validate vendor information before approval</p>
                        </div>
                    </div>
                    {hasComments && (
                        <Badge count={`${Object.keys(commentStructure).length} comment(s)`} style={{ backgroundColor: '#faad14' }} />
                    )}
                </div>
            </Card>

            {/* Main Content */}
            <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Seller Information
                    </h2>
                </div>

                <div className="p-6">
                    {sellerFields.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sellerFields.map((field, idx) => {
                                const hasComment = commentStructure[field.name]
                                return (
                                    <div
                                        key={idx}
                                        className={`
                                            group relative bg-white rounded-xl border transition-all duration-200
                                            ${
                                                hasComment
                                                    ? 'border-blue-200 bg-blue-50/30 shadow-sm'
                                                    : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
                                            }
                                        `}
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800 text-sm">{field.label}</span>
                                                {hasComment && <Badge status="warning" />}
                                            </div>
                                            <Tooltip title={hasComment ? 'Edit comment' : 'Add comment'}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleComments(field.name, field.label)}
                                                    className={`
                                                        p-1.5 rounded-full transition-all duration-200
                                                        ${
                                                            hasComment
                                                                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                                        }
                                                    `}
                                                >
                                                    {hasComment ? (
                                                        <BiSolidCommentCheck className="text-lg" />
                                                    ) : (
                                                        <BiCommentAdd className="text-lg" />
                                                    )}
                                                </button>
                                            </Tooltip>
                                        </div>
                                        <div className="p-4">{renderValue(field)}</div>
                                        {hasComment && (
                                            <div className="mx-4 mb-4 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                                <p className="text-xs text-blue-700 line-clamp-2">
                                                    <span className="font-semibold">Comment: </span>
                                                    {commentStructure[field.name]}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-12">
                            <Empty description="No vendor information available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                    )}
                </div>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-sm rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                    <Button
                        variant="accept"
                        size="lg"
                        icon={<IoCheckmarkOutline className="text-lg" />}
                        className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                        onClick={() => {
                            setStatusToProceed('approved')
                            setConfirmModal(true)
                        }}
                    >
                        Accept Vendor
                    </Button>

                    <Button
                        variant="reject"
                        size="lg"
                        icon={<MdCancel className="text-lg" />}
                        className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                        onClick={() => {
                            setStatusToProceed('rejected')
                            setConfirmModal(true)
                        }}
                    >
                        Reject Vendor
                    </Button>

                    <Button
                        variant="twoTone"
                        color="blue"
                        size="lg"
                        icon={<IoIosSend className="text-lg" />}
                        className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                        onClick={() => {
                            setStatusToProceed('changes_requested')
                            setConfirmModal(true)
                        }}
                    >
                        Request Changes
                    </Button>
                </div>

                {/* Helper text */}
                {hasComments && (
                    <div className="mt-3 text-xs text-gray-500 text-center border-t border-gray-100 pt-3">
                        <span className="inline-flex items-center gap-1">
                            <BiSolidCommentCheck className="text-blue-500" />
                            Fields with comments will be highlighted
                        </span>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default SellerBeforeApproval
