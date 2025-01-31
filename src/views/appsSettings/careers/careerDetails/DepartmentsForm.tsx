/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { RichTextEditor } from '@/components/shared'
import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface props {
    values: any
    isEdit?: boolean
}

const DepartmentsForm = ({ values, isEdit }: props) => {
    return (
        <div>
            <FormContainer className="">
                <FormContainer className="grid grid-cols-2 gap-2">
                    {isEdit && (
                        <FormItem label="Acitve" className="mt-5">
                            <Field name="is_active" type="checkbox" component={Input} />
                        </FormItem>
                    )}
                    <FormItem label="Name">
                        <Field name="name" type="text" placeholder="Enter Name" component={Input} />
                    </FormItem>
                </FormContainer>

                <FormContainer className="grid grid-cols-2 gap-2">
                    <FormItem label="Description">
                        <Field name="description">
                            {({ field, form }: FieldProps) => (
                                <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                            )}
                        </Field>
                    </FormItem>

                    <FormItem label="" className="grid grid-rows-2">
                        <Field name="imageList">
                            {({ form }: FieldProps<any>) => (
                                <>
                                    <div className="font-semibold flex justify-center">Image</div>
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        fileList={values.imageList}
                                        className="flex justify-center"
                                        onFileRemove={(files) => form.setFieldValue('imageList', files)}
                                        onChange={(files) => form.setFieldValue('imageList', files)}
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

export default DepartmentsForm
