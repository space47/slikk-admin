import React from 'react'
import { Field, Form, Formik } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { WebType } from './PageModal'
import { MdCancel } from 'react-icons/md'

interface IMAGEPROPS {
    label: string

    beforeUpload: any
    name: string
    fileList: any
    // setFieldValue: any
    // className: string
    fieldName: string
}

const PageAddCommonImage = ({
    label,
    beforeUpload,
    name,
    // className,
    fieldName,
    fileList,
    // setFieldValue,
}: IMAGEPROPS) => {
    return (
        <div>
            {' '}
            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                <div className="font-semibold mb-1">{label}</div>

                <FormContainer className=" mt-5 ">
                    <FormItem
                        label=""
                        // }
                        className="grid grid-rows-2"
                    >
                        <Field name={name}>
                            {({ field, form }: FieldProps<WebType>) => (
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

export default PageAddCommonImage
