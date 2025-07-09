import React from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, FieldProps } from 'formik'
import Upload from '@/components/ui/Upload'

interface UPLOADER_PROPS {
    label: string
    name: string
    fieldname: string
    fileList: File[]
    beforeFileUpload: (file: FileList | null, fileList: File[]) => string | true
}

const UploaderComponent = ({ label, name, fileList, beforeFileUpload, fieldname }: UPLOADER_PROPS) => {
    return (
        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-hidden ">
            {label}
            <FormContainer className=" mt-5 w-full ">
                <FormItem label="" className="grid grid-rows-2">
                    <Field name={name}>
                        {({ form }: FieldProps) => (
                            <>
                                <Upload
                                    draggable
                                    multiple
                                    className="flex justify-center"
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
