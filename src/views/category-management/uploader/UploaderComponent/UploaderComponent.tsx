import React from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, FieldProps } from 'formik'
import Upload from '@/components/ui/Upload'
import Product from '@/views/category-management/catalog/CommonType'

interface UPLOADERPROPS {
    label: string
    name: string
    fieldname: string
    fileList: any
    beforeFileUpload: any
}

const UploaderComponent = ({ label, name, fileList, beforeFileUpload, fieldname }: UPLOADERPROPS) => {
    return (
        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-hidden ">
            {label}
            <FormContainer className=" mt-5 w-full ">
                {/* DIV */}

                <FormItem label="" className="grid grid-rows-2">
                    <Field name={name}>
                        {({ form }: FieldProps) => (
                            <>
                                <Upload
                                    className="flex justify-center"
                                    multiple
                                    beforeUpload={beforeFileUpload}
                                    fileList={fileList}
                                    onChange={(files) => form.setFieldValue(fieldname, files)}
                                    onFileRemove={(files) => form.setFieldValue(fieldname, files)}
                                />
                            </>
                        )}
                    </Field>
                </FormItem>

                <br />
                <br />
            </FormContainer>
        </FormContainer>
    )
}

export default UploaderComponent
