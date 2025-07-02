/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Field } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { MdCancel } from 'react-icons/md'
import { BsFiletypeJson } from 'react-icons/bs'

interface VIDEOPROPS {
    label: string
    rowName?: any
    removeName?: string
    handleRemoveVideo?: any
    beforeVideoUpload: any
    name: string
    fileList: any
    fieldName: string
    noVideo?: boolean
    isLottie?: boolean
    isImage?: boolean
}

const PageEditVideo = ({
    label,
    rowName,
    removeName,
    handleRemoveVideo,
    beforeVideoUpload,
    name,
    fieldName,
    fileList,
    noVideo = true,
    isLottie,
    isImage = false,
}: VIDEOPROPS) => {
    console.log('rowName', rowName)
    return (
        <div>
            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col  items-center rounded-xl mb-2 overflow-scroll scrollbar-hide">
                <div className="font-semibold mb-1">{label}</div>
                {noVideo && rowName && (
                    <div className="flex flex-col items-center justify-center min-w-[100px]">
                        {isLottie ? (
                            <BsFiletypeJson className="text-3xl" />
                        ) : isImage ? (
                            <img src={rowName} alt={`Image `} className="w-[100px] h-[40px] flex object-contain " />
                        ) : (
                            <video controls src={rowName} className="w-[100px] h-[100px]" />
                        )}
                        <button type="button" className="text-red-500 text-md " onClick={() => handleRemoveVideo(removeName)}>
                            <MdCancel className="text-red-500 bg-none text-lg" />
                        </button>
                    </div>
                )}
                <FormContainer className="mt-5">
                    <FormItem className="m-0 p-0">
                        <Field name={name}>
                            {({ form }: FieldProps) => (
                                <>
                                    <Upload
                                        className="flex justify-center"
                                        beforeUpload={beforeVideoUpload}
                                        fileList={fileList}
                                        onChange={(files) => {
                                            form.setFieldValue(fieldName, files)
                                        }}
                                        onFileRemove={(files) => form.setFieldValue(fieldName, files)}
                                    />
                                </>
                            )}
                        </Field>
                    </FormItem>
                </FormContainer>
            </FormContainer>
        </div>
    )
}

export default PageEditVideo
