/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import CommonCompanyForm from '@/common/CommonCompanyForm'
import StoreSelectForm from '@/common/StoreSelectForm'
import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import { Field, FieldProps, Form } from 'formik'
import React from 'react'
import { DocumentArrayGDN } from './commonGdn'

interface GDN_FORM_PROPS {
    imagview?: any[]
    values: any
    spinner: boolean
}

const GdnForm = ({ imagview, values, spinner }: GDN_FORM_PROPS) => {
    return (
        <Form className="w-full">
            <FormContainer className="space-y-8">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Document Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DocumentArrayGDN?.map((item, key) => (
                            <FormItem key={key} label={item.label} className="w-full">
                                <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} />
                            </FormItem>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Company & Store</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CommonCompanyForm label="Select Company" name="company" queryVal="id" />
                        <StoreSelectForm isSingle label="Select Store" name="store" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormContainer className="p-5 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
                        <h3 className="font-semibold text-gray-700 mb-4">Upload Supporting Document</h3>

                        <FormItem className="w-full">
                            <Field name="files">
                                {({ form }: FieldProps<any>) => (
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        fileList={values.files}
                                        onChange={(files) => form.setFieldValue('files', files)}
                                        onFileRemove={(files) => form.setFieldValue('files', files)}
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem className="w-full mt-4">
                            <Field type="text" name="document" placeholder="Enter Document URL or Upload File" component={Input} />
                        </FormItem>
                    </FormContainer>
                    <FormContainer className="p-5 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
                        <h3 className="font-semibold text-gray-700 mb-4">Upload Supporting Images</h3>

                        <div className="flex flex-wrap justify-center gap-3 mb-4">
                            {imagview && imagview.length > 0 ? (
                                imagview.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="uploaded"
                                        className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No images uploaded</p>
                            )}
                        </div>

                        <FormItem className="w-full">
                            <Field name="image">
                                {({ form }: FieldProps<any>) => (
                                    <Upload
                                        multiple
                                        beforeUpload={beforeUpload}
                                        fileList={values.image}
                                        onChange={(files) => form.setFieldValue('image', files)}
                                        onFileRemove={(files) => form.setFieldValue('image', files)}
                                    />
                                )}
                            </Field>
                        </FormItem>
                    </FormContainer>
                </div>
                <div className="flex justify-end pt-4">
                    <FormButton isSpinning={spinner} value="Submit" />
                </div>
            </FormContainer>
        </Form>
    )
}

export default GdnForm
