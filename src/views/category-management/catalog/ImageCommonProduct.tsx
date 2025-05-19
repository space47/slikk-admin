/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { MdCancel } from 'react-icons/md'
import Product from './CommonType'
import { beforeUpload } from '@/common/beforeUpload'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import { Input } from 'antd'

interface ImageofProductProps {
    label: string
    allName: string[]
    handleRemove: any
    name: string
    fieldname: string
    fileLists: any
    textName: string
    placeholder: string
    isVideo?: boolean
}

const ImageCommonProduct = ({
    label,
    allName,
    handleRemove,
    name,
    fieldname,
    fileLists,
    textName,
    placeholder,
    isVideo,
}: ImageofProductProps) => {
    return (
        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-scroll scrollbar-hide ">
            {label}
            <FormContainer className=" mt-5 w-full ">
                {/* DIV */}

                <div className="overflow-x-scroll w-[350px] scrollbar-hide flex justify-center">
                    <div className="image w-[80%] min-h-[100px] h-auto mt-5 flex gap-3 items-center">
                        {allName && allName.length > 0 ? (
                            allName?.map(
                                (img, index) =>
                                    img && (
                                        <div key={index} className="flex flex-col gap-3">
                                            <img src={img} alt="img" className="w-[100px]" />

                                            <button className=" mb-5" onClick={(e) => handleRemove(e, index)}>
                                                <MdCancel className="text-red-500 bg-none text-lg" />
                                            </button>
                                        </div>
                                    ),
                            )
                        ) : (
                            <p>No image</p>
                        )}
                    </div>
                </div>

                <FormItem label="" className="grid grid-rows-2">
                    <Field name={name}>
                        {({ form }: FieldProps<Product>) => (
                            <>
                                <Upload
                                    multiple
                                    className="flex justify-center"
                                    beforeUpload={isVideo ? beforeVideoUpload : beforeUpload}
                                    fileList={fileLists}
                                    onChange={(files) => form.setFieldValue(fieldname, files)}
                                    onFileRemove={(files) => form.setFieldValue(fieldname, files)}
                                />
                            </>
                        )}
                    </Field>
                </FormItem>

                <br />
                <br />
            </FormContainer>
            <FormItem label="" className="col-span-1 w-[80%]">
                <Field type="text" name={textName} placeholder={placeholder}>
                    {({ form, field }: FieldProps) => (
                        <Input
                            {...field}
                            onChange={(e) => {
                                form.setFieldValue(textName, e.target.value) // Your custom logic
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </FormContainer>
    )
}

export default ImageCommonProduct
