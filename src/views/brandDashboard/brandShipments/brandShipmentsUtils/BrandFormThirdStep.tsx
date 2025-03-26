import { beforeUpload } from '@/common/beforeUpload'
import { Button, FormContainer, FormItem, Upload } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Field, FieldProps } from 'formik'
import React, { useState } from 'react'

interface props {
    values: any
}

const BrandFormThirdStep = ({ values }: props) => {
    const [showUpload, setShowUlpload] = useState(false)
    const handleUpload = async (id: string, csvFile: any) => {
        const formData = new FormData()
        formData.append('shipment_id', id)
        formData.append('shipment_items_file', csvFile[0])
        try {
            const response = await axioisInstance.post(`/shipment/bulkupload/items`, formData)
            notification.success({
                message: response?.data?.message || 'Successfully uploaded file',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to uploaded file',
            })
            console.log(error)
        }
    }
    return (
        <FormContainer>
            <FormItem label="Box Count" className="col-span-1 w-3/4">
                <Field name="box_count" type="number" placeholder="Enter Box Count" />
            </FormItem>
            <FormItem label="Items Count" className="col-span-1 w-3/4">
                <Field name="items_count" type="number" placeholder="Enter Items Count" />
            </FormItem>
            <FormItem label="Csv To be uploaded">
                <Button variant="new" type="button" onClick={() => setShowUlpload((prev) => !prev)}>
                    {showUpload ? 'Close' : 'Upload CSV'}
                </Button>
            </FormItem>
            {showUpload && (
                <>
                    <FormItem label="" className="grid grid-rows-2 mt-5 w-full bg-blue-100 p-4 rounded-xl ">
                        <Field name="csvArray">
                            {({ form }: FieldProps) => (
                                <>
                                    <Upload
                                        multiple
                                        className="flex justify-center"
                                        beforeUpload={beforeUpload}
                                        fileList={values.csvArray}
                                        onChange={(files) => form.setFieldValue('csvArray', files)}
                                        onFileRemove={(files) => form.setFieldValue('csvArray', files)}
                                    />
                                </>
                            )}
                        </Field>
                    </FormItem>
                    <Button type="button" variant="accept" onClick={() => handleUpload(values?.shipment_id, values?.csvArray)}>
                        Upload
                    </Button>
                </>
            )}
        </FormContainer>
    )
}

export default BrandFormThirdStep
