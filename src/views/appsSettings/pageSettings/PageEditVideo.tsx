import React from 'react'
import { Field, Form, Formik } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { WebType } from './PageModal'
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
}: VIDEOPROPS) => {
    console.log('rowName', rowName)
    return (
        <div>
            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                <div className="font-semibold mb-1">{label}</div>
                {noVideo && rowName && (
                    <div className="flex flex-col items-center justify-center min-w-[100px]">
                        {isLottie ? (
                            <BsFiletypeJson className="text-3xl" />
                        ) : (
                            <video src={rowName} controls className="w-[200px] h-[120px] flex object-contain" />
                        )}
                        <button type="button" className="text-red-500 text-md " onClick={() => handleRemoveVideo(removeName)}>
                            <MdCancel className="text-red-500 bg-none text-lg" />
                        </button>
                    </div>
                )}
                <FormContainer className="mt-5">
                    <FormItem className="grid grid-rows-2">
                        <Field name={name}>
                            {({ field, form }: FieldProps<WebType>) => (
                                <>
                                    <Upload
                                        beforeUpload={beforeVideoUpload}
                                        fileList={fileList}
                                        onChange={(files) => {
                                            form.setFieldValue(fieldName, files)
                                        }}
                                        className="flex justify-center"
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
