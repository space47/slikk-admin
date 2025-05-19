import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface props {
    fileList: File[] | undefined
    name: string
    label: string
    fieldNames: string
    name2?: string
    beforeUpload: (file: FileList | null, fileList: File[]) => string | true
}

const AddProductImages = ({ fieldNames, fileList, name, label, beforeUpload, name2 }: props) => {
    return (
        <div>
            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-hidden">
                {label}
                <FormContainer className=" mt-5 w-full ">
                    <FormItem label="" className="grid grid-rows-2">
                        <Field name={name}>
                            {({ form }: FieldProps) => (
                                <>
                                    <Upload
                                        multiple
                                        className="flex justify-center"
                                        beforeUpload={beforeUpload}
                                        fileList={fileList}
                                        onChange={(files) => form.setFieldValue(fieldNames, files)}
                                        onFileRemove={(files) => form.setFieldValue(fieldNames, files)}
                                    />
                                </>
                            )}
                        </Field>
                    </FormItem>

                    <br />
                    <br />
                </FormContainer>
                <FormItem label="" className="col-span-1 w-[80%]">
                    <Field type="text" name={name2} placeholder="Enter ImageUrl or Upload Image file" component={Input} />
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default AddProductImages
