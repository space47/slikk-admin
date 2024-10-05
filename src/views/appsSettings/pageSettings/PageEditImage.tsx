import React from 'react'
import { Field, Form, Formik } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { WebType } from './PageModal'
import { MdCancel } from 'react-icons/md'

interface IMAGEPROPS {
    label: string
    rowName: any
    removeName: string
    handleRemoveImage: any
    beforeUpload: any
    name: string
    fileList: any
    // setFieldValue: any
    // className: string
    fieldName: string
}

const PageEditImage = ({
    label,
    rowName,
    removeName,
    handleRemoveImage,
    beforeUpload,
    name,
    // className,
    fieldName,
    fileList,
    // setFieldValue,
}: IMAGEPROPS) => {
    return (
        <div>
            {' '}
            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                <div className="font-semibold mb-1">{label}</div>
                {rowName && (
                    <div className="flex flex-col items-center justify-center min-w-[100px]">
                        <img src={rowName} alt={`Image `} className="w-[100px] h-[40px] flex object-contain " />
                        <button className="text-red-500 text-md " onClick={() => handleRemoveImage(removeName)}>
                            <MdCancel className="text-red-500 bg-none text-lg" />
                        </button>
                    </div>
                )}
                <FormContainer className=" mt-5 ">
                    <FormItem
                        label=""
                        // }
                        className="grid grid-rows-2"
                    >
                        <Field name={name}>
                            {({ field, form }: FieldProps<WebType>) => (
                                <>
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        fileList={fileList}
                                        onChange={(files) => {
                                            form.setFieldValue(fieldName, files)
                                        }}
                                        className="flex justify-center"
                                        onFileRemove={(files) => form.setFieldValue(fieldName, files)}
                                    />
                                </>
                            )}
                        </Field>
                    </FormItem>
                </FormContainer>
            </FormContainer>
        </div>
    )
}

export default PageEditImage
