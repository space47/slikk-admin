/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { MdCancel } from 'react-icons/md'
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
    delimiter?: string
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
    delimiter = ',',
}: ImageofProductProps) => {
    const getTextValues = (form: any) => {
        const textValue = form.values[textName] || ''
        return textValue.split(delimiter).map((item: string) => item.trim())
    }

    const updateTextField = (form: any, index: number, value: string) => {
        const textValues = getTextValues(form)
        textValues[index] = value
        form.setFieldValue(textName, textValues.join(delimiter + ' '))
    }

    return (
        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 p-4">
            {label}
            <FormContainer className="mt-5 w-full">
                <Field name={name}>
                    {({ form }: FieldProps) => {
                        const textValues = getTextValues(form)

                        return (
                            <div className="w-full space-y-4">
                                {allName && allName.length > 0 ? (
                                    allName.map(
                                        (img, index) =>
                                            img && (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow">
                                                    <img src={img} alt="img" className="w-[100px] h-[100px] object-cover rounded" />

                                                    <div className="flex-grow">
                                                        <Input
                                                            value={textValues[index] || ''}
                                                            placeholder={placeholder}
                                                            onChange={(e) => updateTextField(form, index, e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </div>

                                                    <button onClick={(e) => handleRemove(e, index)} className="ml-2">
                                                        <MdCancel className="text-red-500 text-lg" />
                                                    </button>
                                                </div>
                                            ),
                                    )
                                ) : (
                                    <p className="text-center py-4">No images</p>
                                )}
                            </div>
                        )
                    }}
                </Field>

                <div className="mt-4">
                    <Field name={name}>
                        {({ form }: FieldProps) => (
                            <Upload
                                multiple
                                className="flex justify-center"
                                beforeUpload={isVideo ? beforeVideoUpload : beforeUpload}
                                fileList={fileLists}
                                onChange={(files) => form.setFieldValue(fieldname, files)}
                                onFileRemove={(files) => form.setFieldValue(fieldname, files)}
                            />
                        )}
                    </Field>
                </div>
            </FormContainer>
        </FormContainer>
    )
}

export default ImageCommonProduct
