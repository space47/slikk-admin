import { beforeUpload } from '@/common/beforeUpload'
import { Button, FormItem, Upload } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useState } from 'react'

const ScrapData = () => {
    const [csvFile, setCsvFile] = useState<any>()

    const initialValue: any = {}

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append('file', csvFile[0])

        try {
            const response = await axioisInstance.post(`https://ugd6a4zyw6.execute-api.ap-south-1.amazonaws.com/api/upload`, formData)
            const data = response?.data

            console.log('Data is : ', data)
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to scrapp',
            })
            console.error(error)
        }
    }

    return (
        <div>
            <div>Upload CSV to scrap the data:</div>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={initialValue}
                    // validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Form className="w-3/4">
                            <FormItem label="" className="grid mt-8 w-1/3 bg-gray-100 p-2">
                                <Field name="csvList">
                                    {({ form }: FieldProps<any>) => (
                                        <>
                                            <div className="font-semibold flex justify-start ">Upload Csv</div>
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.csvList} // uploadedd the file
                                                className="flex justify-center mt-6"
                                                onFileRemove={(files) => {
                                                    form.setFieldValue('csvList', files)
                                                }}
                                                onChange={(files) => {
                                                    form.setFieldValue('csvList', files)
                                                    setCsvFile(files)
                                                }}
                                            />
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                            <Button variant="accept" type="submit">
                                Scrapp
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default ScrapData
