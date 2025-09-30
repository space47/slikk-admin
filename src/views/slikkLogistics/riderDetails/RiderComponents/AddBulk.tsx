/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { Dialog, FormItem, Upload } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useState } from 'react'

interface props {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddBulk = ({ isOpen, setIsOpen }: props) => {
    const [fileList, setFileList] = useState<any>([])
    const [isSpinning, setIsSpinning] = useState(false)

    const handleSubmit = async () => {
        setIsSpinning
        try {
            const formData = new FormData()
            if (fileList && fileList.length > 0) {
                fileList.forEach((file: any) => {
                    formData.append('rider_details_file', file)
                })
            }
            const res = await axioisInstance.post('/rider/bulk/update', formData)
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
            <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} contentClassName="max-w-lg w-full">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 text-center">Bulk Rider Upload</h2>
                    <p className="text-gray-500 mb-6 text-center">Upload a CSV file to add multiple riders at once.</p>
                    <Formik initialValues={{ fileUpload: [] }} onSubmit={handleSubmit}>
                        {({ values }) => (
                            <Form className="space-y-6">
                                <FormItem label="Rider CSV File" className="w-full">
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

export default AddBulk
