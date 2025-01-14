/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormModel } from '../BrandEdit'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

interface BrandImageProps {
    imagview: any
    label: string
    beforeUpload: any
    fileList: any
    setImageView: any
    name: string
}

const ImageField = ({ imagview, label, beforeUpload, fileList, setImageView, name }: BrandImageProps) => {
    const handleFileupload = async (files: File[], setView) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'category')

        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const newData = response.data.url
            setView(newData)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    console.log('IS ImageVIew a function', imagview)
    return (
        <div className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
            <div className=" image w-[10%] h-[20%] mt-5  ">
                {imagview && imagview?.length > 0 ? (
                    [imagview]?.map((img: any, index: any) => <img key={index} src={img} alt="img" className="rounded-xl" />)
                ) : (
                    <p>No image</p>
                )}
            </div>
            <FormContainer className="mt-5">
                <FormItem
                    label={label} //label
                    className="grid grid-rows-2"
                >
                    <Field name={name}>
                        {({ form }: FieldProps<FormModel>) => (
                            <>
                                <Upload
                                    beforeUpload={beforeUpload}
                                    fileList={fileList}
                                    onChange={async (files) => {
                                        const uploadedImage = await handleFileupload(files, setImageView)
                                        {
                                            form.setFieldValue(name, uploadedImage)
                                            setImageView([uploadedImage])
                                        }
                                    }}
                                    onFileRemove={(files) => form.setFieldValue(name, files)}
                                    showList={false}
                                />
                            </>
                        )}
                    </Field>
                </FormItem>
                <br />
            </FormContainer>
        </div>
    )
}

export default ImageField
