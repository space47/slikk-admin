/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

import Upload from '@/components/ui/Upload'
import { Field, Form, Formik } from 'formik'
// import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useState } from 'react'
import { notification } from 'antd'

interface Submission {
    image: string | null
    image_upload_array: File[]
    name: string
    value: string
}

const MAX_UPLOAD = 8

// const validationSchema = Yup.object().shape({
//     document_number: Yup.string().required('Document Number is required'),
//     document_date: Yup.date().required('Document Date is required').nullable(),
//     origin_address: Yup.string()
//         .required('Supplier Address is required')
//         .transform((value) => value.trim()),
//     received_address: Yup.string()
//         .required('Receiver Address is required')
//         .transform((value) => value.trim()),
//     received_by: Yup.string()
//         .required('Received By is required')
//         .matches(/^[6-9]\d{9}$/, 'Mobile Number is not valid'),
//     total_sku: Yup.number()
//         .required('Total SKUs is required')
//         .integer('Must be an integer'),
//     total_quantity: Yup.number()
//         .required('Total Quantity is required')
//         .integer('Must be an integer'),
//     singleCheckbox: Yup.boolean(),
//     // images: Yup.string().nullable(),
//     // document: Yup.string().nullable(),
// })

const UploadBanner = () => {
    const [bannerInputData, setBannerInputData] = useState<Submission[]>([])
    const [imagview, setImageView] = useState<string[]>([])

    const initialValue: Submission = {
        image: null,
        name: '',
        value: '',
        image_upload_array: [],
    }

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]
        const MAX_FILE_SIZE = 5000000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a valid file format'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }

    const handleFileupload = async (files: File[]): Promise<string> => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'banners')
        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const newData = response.data.url
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: 'Upload Failed',
                description:
                    error?.response?.data?.message || 'Image upload failed',
            })
            return 'Error'
        }
    }

    const handleSubmit = async (values: Submission) => {
        console.log(values)
        const formData = {
            ...values,
            image: values.image_upload_array.join(','),
        }

        setBannerInputData((prev: any) => [...prev, formData])
    }

    console.log('sssswwwswswsw', bannerInputData)

    return (
        <div>
            <div className="text-xl mb-10">Add SubCategory</div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-2/3 flex flex-col ">
                        <FormContainer>
                            {/* Image upload.................................................................. */}

                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <div className=" image w-[10%] h-[20%] mt-5  ">
                                    {imagview && imagview.length > 0 ? (
                                        imagview.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt="img"
                                                className="rounded-xl"
                                            />
                                        ))
                                    ) : (
                                        <p>No image</p>
                                    )}
                                </div>
                                <FormContainer className="mt-5">
                                    <FormItem
                                        label="ADD NEW IMAGE"
                                        invalid={Boolean(
                                            errors.image && touched.image,
                                        )}
                                        errorMessage={errors.image as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="image_upload_array">
                                            {({
                                                form,
                                            }: FieldProps<Submission>) => (
                                                <>
                                                    <Upload
                                                        beforeUpload={
                                                            beforeUpload
                                                        }
                                                        fileList={
                                                            values.image_upload_array
                                                        }
                                                        onChange={async (
                                                            files,
                                                        ) => {
                                                            const uploadedImage =
                                                                await handleFileupload(
                                                                    files,
                                                                )
                                                            form.setFieldValue(
                                                                'image_upload_array',
                                                                [uploadedImage],
                                                            )
                                                            setImageView([
                                                                uploadedImage,
                                                            ])
                                                        }}
                                                        onFileRemove={(files) =>
                                                            form.setFieldValue(
                                                                'image_upload_array',
                                                                files,
                                                            )
                                                        }
                                                        showList={false}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                    <br />
                                </FormContainer>
                            </FormContainer>

                            <FormItem label="Name">
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Enter Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem label="Value">
                                <Field
                                    type="text"
                                    name="value"
                                    placeholder="Enter value"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem>
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit">
                                    Submit
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>

            <div className="flex flex-col gap-6 rounded  justify-center items-center mt-10 ">
                {bannerInputData.map((item, key) => (
                    <div key={key} className="flex">
                        <div className="flex flex-row gap-10  bg-gray-100   min-w-[400px] items-center justify-center py-2 rounded-xl ">
                            <div className="flex flex-col justify-center">
                                <img
                                    src={item.image as string}
                                    alt=""
                                    className="w-[70px] h-[60px]"
                                />
                            </div>

                            <div className="flex flex-col">
                                <span>Name:</span>
                                <span>{item.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span>Value:</span>
                                <span>{item.value}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UploadBanner
