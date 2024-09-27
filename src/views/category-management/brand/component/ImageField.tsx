/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormModel } from '../BrandEdit'

interface BrandImageProps {
    imagview: any
    label: string
    beforeUpload: any
    fileList: any
    handleFileupload: any
    setImageView: any
    name: string
}

const ImageField = ({ imagview, label, beforeUpload, fileList, handleFileupload, setImageView, name }: BrandImageProps) => {
    return (
        <div className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
            <div className=" image w-[10%] h-[20%] mt-5  ">
                {imagview && imagview.length > 0 ? (
                    imagview.map((img: any, index: any) => <img key={index} src={img} alt="img" className="rounded-xl" />)
                ) : (
                    <p>No image</p>
                )}
            </div>
            <FormContainer className="mt-5">
                <FormItem
                    label={label} //label
                    className="grid grid-rows-2"
                >
                    <Field name="image">
                        {({ form }: FieldProps<FormModel>) => (
                            <>
                                <Upload
                                    beforeUpload={beforeUpload}
                                    fileList={fileList}
                                    onChange={async (files) => {
                                        const uploadedImage = await handleFileupload(files)
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
