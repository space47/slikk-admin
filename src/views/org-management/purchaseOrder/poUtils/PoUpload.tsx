/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { Dialog, FormItem, Switcher, Upload } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useState } from 'react'

interface props {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    purchase_id: string | number
}

const PoUpload = ({ isOpen, setIsOpen, purchase_id }: props) => {
    const [fileList, setFileList] = useState<any>([])
    const [isSpinning, setIsSpinning] = useState(false)

    const handleSubmit = async (values: any) => {
        setIsSpinning
        try {
            const formData = new FormData()
            formData.append('purchase_order_id', purchase_id as string)
            if (fileList && fileList.length > 0) {
                fileList.forEach((file: any) => {
                    formData.append('purchase_order_file', file)
                })
            }
            if (values?.is_catalog_available) {
                formData.append('is_catalog_available', 'true')
            }
            const res = await axioisInstance.post('/merchant/purchase/bulkupload/orderitem', formData)
            notification.success({
                message: res?.data?.data?.message || 'File uploaded successfully',
            })
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.response?.data?.message || 'File Not uploaded',
                })
            }
        } finally {
            setIsSpinning(false)
        }
    }
    return (
        <div>
            <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800}>
                <div className="p-3 mx-auto bg-white shadow-md rounded-2xl">
                    <h2 className="text-xl font-semibold mb-2 text-center">Purchase Order Upload</h2>
                    <p className="text-gray-500 mb-6 text-center">Upload a CSV file to add Purchase Orders.</p>
                    <div className="flex flex-col items-center justify-center space-y-4 mb-10">
                        <a
                            download
                            href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/SampleFiles-Dashboard/RiderBulkUploadSample.csv"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                                />
                            </svg>
                            Download Sample File
                        </a>
                    </div>
                    <Formik initialValues={{ fileUpload: [] }} onSubmit={handleSubmit}>
                        {({ values }) => (
                            <Form className="space-y-6">
                                <FormItem label="Is Catalog available">
                                    <Field type="checkbox" component={Switcher} name="is_catalog_available" />
                                </FormItem>
                                <FormItem label="Purchase Order File" className="w-full">
                                    <Field name="fileUpload">
                                        {({ form }: FieldProps<any>) => (
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.fileUpload || []}
                                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-primary-500 transition-colors min-h-[120px]"
                                                onFileRemove={(files) => form.setFieldValue('fileUpload', files)}
                                                onChange={(files) => {
                                                    form.setFieldValue('fileUpload', files)
                                                    setFileList(files)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <div className="flex justify-end">
                                    <FormButton value="Upload" isSpinning={isSpinning} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Dialog>
        </div>
    )
}

export default PoUpload
