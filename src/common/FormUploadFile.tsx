import { Button, FormContainer, FormItem, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useEffect } from 'react'
import { MdCancel } from 'react-icons/md'
import { beforeUpload } from './beforeUpload'
import { BsFileEarmarkPdf } from 'react-icons/bs'
import { IoCloudUploadOutline } from 'react-icons/io5'

interface Props {
    label: string
    name: string
    fileList: File[]
    isEdit?: boolean
    existingFile?: string | File | File[] | null
    asterisk?: boolean
}

const FormUploadFile = ({ label, name, fileList, isEdit, existingFile, asterisk }: Props) => {
    const getFileUrl = (file: string | File): string | null => {
        if (typeof file === 'string') return file
        if (file instanceof File) return URL.createObjectURL(file)
        return null
    }

    const renderPreview = (file: string | File) => {
        const fileUrl = getFileUrl(file)
        if (!fileUrl) return null

        const fileName = typeof file === 'string' ? file.split('/').pop() : file.name
        const extension = fileName?.split('.').pop()?.toLowerCase() || ''

        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)
        const isVideo = ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension)
        const isPdf = ['pdf', 'csv', 'zip', 'json'].includes(extension)

        if (isImage) {
            return (
                <div className="flex flex-col items-center space-y-1">
                    <img src={fileUrl} alt="Preview" className="w-[100px] h-[80px] object-contain rounded-md" />
                    <span className="text-xs text-gray-700">{fileName}</span>
                </div>
            )
        } else if (isVideo) {
            return (
                <div className="flex flex-col items-center space-y-1">
                    <video src={fileUrl} controls className="w-[150px] h-[100px] object-contain rounded-md" />
                    <span className="text-xs text-gray-700">{fileName}</span>
                </div>
            )
        } else if (isPdf) {
            return (
                <div className="flex flex-col items-center space-y-1">
                    <BsFileEarmarkPdf className="text-2xl" />
                    <span className="text-xs text-gray-700">{fileName}</span>
                </div>
            )
        } else {
            return (
                <div className="flex flex-col items-center space-y-1">
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm break-all">
                        {fileName || 'View File'}
                    </a>
                </div>
            )
        }
    }

    useEffect(() => {
        return () => {
            if (Array.isArray(existingFile)) {
                existingFile.forEach((f) => {
                    if (f instanceof File) URL.revokeObjectURL(URL.createObjectURL(f))
                })
            } else if (existingFile instanceof File) {
                URL.revokeObjectURL(URL.createObjectURL(existingFile))
            }
        }
    }, [existingFile])

    return (
        <FormContainer
            className="border border-dotted border-blue-800 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
               transition-all duration-200 bg-opacity-40 flex flex-col items-center rounded-xl mb-2 p-4 overflow-auto scrollbar-hide"
        >
            <div className="font-semibold mb-2">
                {label} {asterisk && <span className="text-red-600">*</span>}
            </div>

            <Field name={name}>
                {({ form }: FieldProps) => {
                    const value = form.values[name]
                    const fileValue =
                        Array.isArray(value) && value.length > 0 ? value[0] : value instanceof File ? value : existingFile || null

                    return (
                        <>
                            {isEdit && fileValue && (
                                <div className="flex flex-col items-center justify-center space-y-1">
                                    {renderPreview(fileValue)}
                                    <button
                                        type="button"
                                        className="flex items-center text-red-500 text-sm mt-1 hover:text-red-600"
                                        onClick={() => form.setFieldValue(name, null)}
                                    >
                                        <MdCancel className="text-lg mr-1" /> Remove
                                    </button>
                                </div>
                            )}

                            <FormContainer className="mt-4 w-full flex justify-center">
                                <FormItem label="">
                                    {/* <Upload
                                       
                                    /> */}
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        fileList={fileList}
                                        onChange={(files) => form.setFieldValue(name, files)}
                                        onFileRemove={(files) => form.setFieldValue(name, files)}
                                    >
                                        <div className=" text-center space-y-3">
                                            <div className="text-6xl mb-4 flex justify-center">
                                                <IoCloudUploadOutline />
                                            </div>
                                            <p className="font-semibold">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your catalog file here or click to browse
                                                </span>
                                            </p>
                                            <Button type="button" variant="blue" size="sm">
                                                Choose File
                                            </Button>
                                        </div>
                                    </Upload>
                                </FormItem>
                            </FormContainer>
                        </>
                    )
                }}
            </Field>
        </FormContainer>
    )
}

export default FormUploadFile
