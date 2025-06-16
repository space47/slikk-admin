import React from 'react'
import { Field } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'

interface IMAGEPROPS {
    label: string
    beforeUpload: (file: FileList | null, fileList: File[]) => string | true
    name: string
    fileList: File[]
    fieldName: string
}

const PageAddVideo = ({ label, beforeUpload, name, fieldName, fileList }: IMAGEPROPS) => {
    return (
        <div>
            {' '}
            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col  items-center  rounded-xl mb-2 overflow-scroll scrollbar-hide">
                <div className="font-semibold mb-1">{label}</div>

                <FormContainer className=" mt-5 ">
                    <FormItem
                        label=""
                        // }
                        className="m-0 p-0"
                    >
                        <Field name={name}>
                            {({ form }: FieldProps) => (
                                <>
                                    <Upload
                                        beforeUpload={beforeUpload}
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

export default PageAddVideo
