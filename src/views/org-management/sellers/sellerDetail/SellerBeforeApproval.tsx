/* eslint-disable @typescript-eslint/no-explicit-any */
import FormUploadFile from '@/common/FormUploadFile'
import { Button, Card, FormContainer, FormItem, Input, Tooltip } from '@/components/ui'
import { VendorDetails } from '@/store/types/vendor.type'
import { Empty } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { useMemo } from 'react'
import { BiSolidCommentCheck } from 'react-icons/bi'
import { FaRegCommentAlt } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { MdCancel } from 'react-icons/md'

interface Props {
    handleProceed: any
    commentStructure: Record<string, string>
    handleComments: (name: string, label: string) => void
    sellerData: VendorDetails
    setStatusToProceed: React.Dispatch<React.SetStateAction<'' | 'approved' | 'rejected' | 'changes_requested'>>
    setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
}

const SellerBeforeApproval = ({
    handleProceed,
    commentStructure,
    handleComments,
    sellerData,
    setStatusToProceed,
    setConfirmModal,
}: Props) => {
    const initialValues: Record<string, any> = { ...sellerData }

    const isFileValue = (value: string): boolean => {
        if (!value) return false
        const fileExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx']
        return fileExtensions.some((ext) => value.toLowerCase().includes(`.${ext}`))
    }

    const parseFileList = (value: string) => {
        if (!value) return []
        return value.split(',').map((file) => ({
            uid: file.trim(),
            name: file.trim().split('/').pop(),
            url: file.trim(),
            status: 'done',
        }))
    }

    const sellerFields = useMemo(() => {
        if (!sellerData) return []

        const ignoredKeys = ['comments', 'create_date', 'update_date', 'status']

        return Object.keys(sellerData)
            .filter((key) => !ignoredKeys.includes(key))
            .map((key) => {
                const value = (sellerData as any)[key]
                const isFile = typeof value === 'string' && isFileValue(value)
                const isNumber = typeof value === 'number'
                const isBoolean = typeof value === 'boolean'
                const isObject = typeof value === 'object' && value !== null
                const isDate = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)

                let type = 'text'
                if (isFile) type = 'file'
                else if (isNumber) type = 'number'
                else if (isBoolean) type = 'checkbox'
                else if (isDate) type = 'date'
                else if (isObject) type = 'obj'

                const label = key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

                return { label, name: key, value, type }
            })
    }, [sellerData])

    const renderField = (field: any) => {
        const value = (sellerData as any)[field.name]

        if (field.type === 'file') {
            const files = parseFileList(value)
            return <FormUploadFile isEdit label="" fileList={files as any} name={field.name} existingFile={files as any} />
        }

        if (field.type === 'number') {
            return <Field as={Input} type="number" name={field.name} placeholder={field.label} />
        }

        if (field.type === 'checkbox') {
            return (
                <div className="flex items-center gap-2">
                    <Field type="checkbox" name={field.name} />
                    <label>{field.label}</label>
                </div>
            )
        }

        if (field.type === 'date') {
            return <Field as={Input} type="date" name={field.name} placeholder={field.label} />
        }

        if (field.type) return <Field as={Input} name={field.name} placeholder={field.label} />
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValues} onSubmit={() => handleProceed()}>
                {() => (
                    <Form>
                        <FormContainer className="space-y-6">
                            <Card className="shadow-md rounded-2xl border border-gray-200 bg-white p-5">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Seller Information</h2>

                                {sellerFields.length ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {sellerFields.map((field, idx) => (
                                            <FormItem
                                                key={idx}
                                                label={
                                                    <div className="flex items-center gap-6">
                                                        <span>{field.label}</span>
                                                        <Tooltip title={commentStructure[field.name] || 'Add comment'}>
                                                            {commentStructure[field.name] ? (
                                                                <BiSolidCommentCheck
                                                                    className="cursor-pointer text-green-500 text-lg"
                                                                    onClick={() => handleComments(field.name, field.label)}
                                                                />
                                                            ) : (
                                                                <FaRegCommentAlt
                                                                    className="cursor-pointer text-gray-600"
                                                                    onClick={() => handleComments(field.name, field.label)}
                                                                />
                                                            )}
                                                        </Tooltip>
                                                    </div>
                                                }
                                            >
                                                {renderField(field)}
                                            </FormItem>
                                        ))}
                                    </div>
                                ) : (
                                    <Empty description="No data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                )}
                            </Card>
                        </FormContainer>

                        {/* Action Buttons */}
                        <div className="flex justify-end items-center gap-2 mt-6">
                            <Button
                                variant="accept"
                                icon={<IoCheckmarkOutline />}
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
                                onClick={() => {
                                    setStatusToProceed('changes_requested')
                                    setConfirmModal(true)
                                }}
                            >
                                Send back with comments
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SellerBeforeApproval
