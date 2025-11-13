/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Tooltip } from '@/components/ui'
import { VendorDetails } from '@/store/types/vendor.type'
import { Empty } from 'antd'
import React, { useMemo } from 'react'
import { BiSolidCommentCheck } from 'react-icons/bi'
import { FaRegCommentAlt, FaFilePdf } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { MdCancel } from 'react-icons/md'

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
        const keywords = ['copy', 'certificate', 'doc']
        return keywords.some((word) => key.toLowerCase().includes(word))
    }

    const parseFileList = (value: string) => {
        if (!value) return []
        return value.split(',').map((file) => ({
            uid: file.trim(),
            name: file.trim().split('/').pop(),
            url: file.trim(),
        }))
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
                <div className="space-y-5">
                    {value.map((item, idx) => {
                        const exclude = ['id', 'company', 'create_date', 'update_date']
                        return (
                            <Card key={idx} className="border border-gray-200 p-5 rounded-2xl bg-gray-50">
                                <h3 className="font-semibold mb-3 text-gray-800">GST Detail {idx + 1}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.keys(item)
                                        .filter((key) => !exclude.includes(key))
                                        .map((key) => {
                                            const subValue = item[key]
                                            const subLabel = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                                            const isSubFile = isFileKey(key) || (typeof subValue === 'string' && isFileValue(subValue))

                                            return (
                                                <div key={key}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-gray-800">{subLabel}</span>
                                                    </div>
                                                    {isSubFile ? (
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <FaFilePdf className="text-red-500 text-lg" />
                                                            <a
                                                                href={subValue}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 underline"
                                                            >
                                                                {subValue.split('/').pop()}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-700">{subValue ?? '-'}</p>
                                                    )}
                                                </div>
                                            )
                                        })}
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
                    {files.map((f) => (
                        <div key={f.uid} className="flex items-center gap-2">
                            <FaFilePdf className="text-red-500 text-lg" />
                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                                {f.name}
                            </a>
                        </div>
                    ))}
                </div>
            )
        }

        if (isObject) {
            return (
                <div className="text-gray-700 bg-gray-100 rounded-xl p-3 text-sm whitespace-pre-wrap font-mono">
                    {JSON.stringify(value, null, 2)}
                </div>
            )
        }

        return <p className="text-gray-700">{value ?? '-'}</p>
    }

    return (
        <div className="space-y-8">
            <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-2">Seller Information</h2>

                {sellerFields.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {sellerFields.map((field, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">{field.label}</span>
                                    <Tooltip title={commentStructure[field.name] || 'Add comment'}>
                                        {commentStructure[field.name] ? (
                                            <BiSolidCommentCheck
                                                className="cursor-pointer text-green-500 text-lg hover:scale-110 transition-transform"
                                                onClick={() => handleComments(field.name, field.label)}
                                            />
                                        ) : (
                                            <FaRegCommentAlt
                                                className="cursor-pointer text-gray-500 hover:text-gray-700 text-lg hover:scale-110 transition-transform"
                                                onClick={() => handleComments(field.name, field.label)}
                                            />
                                        )}
                                    </Tooltip>
                                </div>
                                <div className="pl-1">{renderValue(field)}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="No data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </Card>

            <div className="flex justify-end items-center gap-3">
                <Button
                    variant="accept"
                    icon={<IoCheckmarkOutline />}
                    className="shadow-sm hover:shadow-md transition-all"
                    onClick={() => {
                        setStatusToProceed('approved')
                        setConfirmModal(true)
                    }}
                >
                    Accept
                </Button>

                <Button
                    variant="reject"
                    icon={<MdCancel />}
                    className="shadow-sm hover:shadow-md transition-all"
                    onClick={() => {
                        setStatusToProceed('rejected')
                        setConfirmModal(true)
                    }}
                >
                    Reject
                </Button>

                <Button
                    variant="twoTone"
                    color="yellow"
                    icon={<IoIosSend />}
                    className="shadow-sm hover:shadow-md transition-all"
                    onClick={() => {
                        setStatusToProceed('changes_requested')
                        setConfirmModal(true)
                    }}
                >
                    Send Back with Comments
                </Button>
            </div>
        </div>
    )
}

export default SellerBeforeApproval
