/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

import Upload from '@/components/ui/Upload'
import Product from '@/views/category-management/catalog/CommonType'
import { Checkbox } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import {
    PRODUCT_EDIT_COMMON,
    PRODUCT_EDIT_COMMON_DOWN,
    INITIALVALUES,
} from './ProductCommon'

const AddProduct = () => {
    const [datas, setDatas] = useState()
    const [imagview, setImageView] = useState<string>('')
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const navigate = useNavigate()

    const MAX_UPLOAD = 100

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
            'image/JPEG',
            'image/JPG',
            'image/WEBP',
            'image/PNG',
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
    const beforeVideoUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'video/mp4',
            'video/mov',
            'video/flv',
            'video/avi',
            'video/wmv',
            'video/webm',
            'video/avchd',
        ]
        const MAX_FILE_SIZE = 9000000000000000

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

    const handleimage = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url
            setImageView(newData)
            console.log(newData)
            setShowImage(true)

            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    const handleVideo = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url
            setDatas(newData)
            setShowData(true)

            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Video uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'Video Not uploaded',
            })
            return 'Error'
        }
    }

    const handleImageCheck = async (field: any) => {
        return field && field.length > 0 ? await handleimage(field) : null
    }
    const handleVideoCheck = async (field: any) => {
        return field && field.length > 0 ? await handleVideo(field) : null
    }

    const fileShow = (uploadFile: any, value: any) => {
        if (uploadFile && value) {
            return [uploadFile, value].join(',')
        }
        return uploadFile || value || null
    }

    const handleSubmit = async (values: Product) => {
        const imageUpload = await handleImageCheck(values.images)
        const colorlink = await handleImageCheck(values.color_code)
        const videoUpload = await handleVideoCheck(values.video)

        const imageShow = fileShow(imageUpload, values.image)
        const videoShow = fileShow(videoUpload, values.video_link)

        const formData = {
            ...values,
            color_code_link: colorlink ? colorlink : values.color_code_link,
            image: imageShow,
            video_link: videoShow,
        }

        try {
            const response = await axioisInstance.post('product/add', formData)

            console.log(response)
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Product created Successfully',
            })
            navigate('/app/catalog/products')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'Product not created ',
            })
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <div>
            <h3 className="mb-5 text-neutral-900">ADD NEW PRODUCT</h3>
            <Formik
                enableReinitialize
                initialValues={INITIALVALUES}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3" onKeyDown={handleKeyDown}>
                        <FormContainer>
                            <div className="grid grid-cols-2 gap-4">
                                {PRODUCT_EDIT_COMMON.map((item, key) => (
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-hidden ">
                                    Image
                                    <FormContainer className=" mt-5 w-full ">
                                        {/* DIV */}

                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="image">
                                                {({
                                                    form,
                                                }: FieldProps<Product>) => (
                                                    <>
                                                        <Upload
                                                            className="flex justify-center"
                                                            multiple
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.images
                                                            }
                                                            onChange={(files) =>
                                                                form.setFieldValue(
                                                                    'images',
                                                                    files,
                                                                )
                                                            }
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'images',
                                                                    files,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>

                                        <br />
                                        <br />
                                    </FormContainer>
                                    <FormItem
                                        label=""
                                        invalid={errors.image && touched.image}
                                        errorMessage={errors.image}
                                        className="col-span-1 w-[80%]"
                                    >
                                        <Field
                                            type="text"
                                            name="image"
                                            placeholder="Enter ImageUrl or Upload Image file"
                                            component={Input}
                                        />
                                    </FormItem>
                                </FormContainer>

                                {/* .............................................................. */}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-hidden">
                                    Color Code Thumbnail
                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="color_code">
                                                {({
                                                    form,
                                                }: FieldProps<Product>) => (
                                                    <>
                                                        <Upload
                                                            className="flex justify-center"
                                                            multiple
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.color_code
                                                            }
                                                            onChange={(files) =>
                                                                form.setFieldValue(
                                                                    'color_code',
                                                                    files,
                                                                )
                                                            }
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'color_code',
                                                                    files,
                                                                )
                                                            }
                                                            // uploadButtonText="Add Files"
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>

                                        <br />
                                        <br />
                                    </FormContainer>
                                    <FormItem
                                        label=""
                                        className="col-span-1 w-[80%]"
                                    >
                                        <Field
                                            type="text"
                                            name="color_code_link"
                                            placeholder="Enter Color Url or Upload Color file"
                                            component={Input}
                                        />
                                    </FormItem>
                                </FormContainer>

                                {/* .......................video........................................ */}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                    Video
                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            invalid={Boolean(
                                                errors.video && touched.video,
                                            )}
                                            errorMessage={
                                                errors.video as string
                                            }
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="video_link">
                                                {({
                                                    form,
                                                }: FieldProps<Product>) => (
                                                    <>
                                                        <Upload
                                                            multiple
                                                            beforeUpload={
                                                                beforeVideoUpload
                                                            }
                                                            fileList={
                                                                values.video
                                                            }
                                                            onChange={(files) =>
                                                                form.setFieldValue(
                                                                    'Video',
                                                                    files,
                                                                )
                                                            }
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'images',
                                                                    files,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>

                                        <br />
                                        <br />
                                    </FormContainer>
                                    <FormItem
                                        label=""
                                        invalid={
                                            errors.video_link &&
                                            touched.video_link
                                        }
                                        errorMessage={errors.video_link}
                                        className="col-span-1 w-[80%]"
                                    >
                                        <Field
                                            type="text"
                                            name="video_link"
                                            placeholder="Enter VideoUrl or Upload Video file"
                                            component={Input}
                                        />
                                    </FormItem>
                                </FormContainer>
                                {PRODUCT_EDIT_COMMON_DOWN.map((item, key) => (
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item.component}
                                        />
                                    </FormItem>
                                ))}
                            </div>

                            <FormContainer className="flex justify-end mt-5">
                                <Button
                                    type="reset"
                                    className="mr-2"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    className="bg-blue-500 text-white"
                                >
                                    Submit
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddProduct
