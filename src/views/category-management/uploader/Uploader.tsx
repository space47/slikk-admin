/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import { useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

import Upload from '@/components/ui/Upload'
import Product from '@/views/category-management/catalog/CommonType'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { INITIALVALUES } from '../catalog/ProductCommon'
import { AiOutlineCopy } from 'react-icons/ai'

const Uploader = () => {
    const [finalImage, setFinalImage] = useState('')
    const [finalVideo, setFinalVideo] = useState('')
    const [finalColorLink, setFinalColorLink] = useState('')

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

    const handleSubmit = async (values: any) => {
        const imageUpload = await handleImageCheck(values.images)
        const colorlink = await handleImageCheck(values.color_code)
        const videoUpload = await handleVideoCheck(values.video)

        const imageShow = fileShow(imageUpload, values.image)
        const colorCodeShow = fileShow(colorlink, values.color_code_link)
        const videoShow = fileShow(videoUpload, values.video_link)

        setFinalImage(imageShow)
        setFinalColorLink(colorCodeShow)
        setFinalVideo(videoShow)
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={INITIALVALUES}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
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
                                                        fileList={values.images}
                                                        onChange={(files) =>
                                                            form.setFieldValue(
                                                                'images',
                                                                files,
                                                            )
                                                        }
                                                        onFileRemove={(files) =>
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
                                                        onFileRemove={(files) =>
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
                                        errorMessage={errors.video as string}
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
                                                        fileList={values.video}
                                                        onChange={(files) =>
                                                            form.setFieldValue(
                                                                'Video',
                                                                files,
                                                            )
                                                        }
                                                        onFileRemove={(files) =>
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
                            </FormContainer>

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

            <br />
            <br />

            <div className="flex flex-col mt-5  shadow-lg w-[60%] items-center text-md ">
                {finalImage && (
                    <div className="flex items-center gap-2">
                        <p>Image:</p>

                        {finalImage}
                        <AiOutlineCopy
                            className="text-gray-500 cursor-pointer"
                            onClick={() =>
                                navigator.clipboard.writeText(finalImage)
                            }
                        />
                    </div>
                )}
                {finalColorLink && (
                    <div className="flex items-center gap-2">
                        <p>Color Code:</p>

                        {finalColorLink}
                        <AiOutlineCopy
                            className="text-gray-500 cursor-pointer"
                            onClick={() =>
                                navigator.clipboard.writeText(finalColorLink)
                            }
                        />
                    </div>
                )}
                {finalVideo && (
                    <div className="flex items-center gap-2">
                        <p>Video:</p>

                        {finalVideo}
                        <AiOutlineCopy
                            className="text-gray-500 cursor-pointer"
                            onClick={() =>
                                navigator.clipboard.writeText(finalVideo)
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Uploader
