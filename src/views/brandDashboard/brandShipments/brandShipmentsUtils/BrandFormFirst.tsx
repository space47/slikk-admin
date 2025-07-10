import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import React from 'react'
import { BrandShipentForms } from './brandShipmentsCommon'
import { Field, FieldProps } from 'formik'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { beforeUpload } from '@/common/beforeUpload'
import { RichTextEditor } from '@/components/shared'
import { DatePicker } from 'antd'
import moment from 'moment'
import dayjs from 'dayjs'

interface props {
    isEdit?: boolean
    values: any
}

const BrandFormFirst = ({ isEdit, values }: props) => {
    return (
        <FormContainer>
            {BrandShipentForms?.map((item, key) => (
                <FormItem asterisk key={key} label={item.label} className="col-span-1 w-3/4">
                    <Field type={item.type} name={item?.name} placeholder={`Place ${item.label}`} component={Input} />
                </FormItem>
            ))}
            <FormItem label="Dispatch Date">
                <Field name="dispatch_date">
                    {({ field, form }: FieldProps) => {
                        const dateValue = field.value ? dayjs(field.value) : null

                        return (
                            <DatePicker
                                placeholder=""
                                className="w-1/2"
                                value={dateValue && dateValue.isValid() ? dateValue : null}
                                onChange={(value) => {
                                    form.setFieldValue('dispatch_date', value ? value.format('YYYY-MM-DD') : '')
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>

            <FormItem label="Upload Supporting Document"></FormItem>
            <FormContainer className=" mt-5 w-full bg-blue-100 p-4 rounded-xl ">
                {isEdit && values?.document && (
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <span>
                            <IoDocumentTextOutline className="text-xl" />
                        </span>
                        <span className="w-[240px] line-clamp-3 flex-wrap overflow-hidden">{values?.document}</span>
                    </div>
                )}
                <FormItem label="" className="grid grid-rows-2">
                    <Field name="itemsArray">
                        {({ form }: FieldProps) => (
                            <>
                                <Upload
                                    multiple
                                    className="flex justify-center"
                                    beforeUpload={beforeUpload}
                                    fileList={values.itemsArray}
                                    onChange={(files) => form.setFieldValue('itemsArray', files)}
                                    onFileRemove={(files) => form.setFieldValue('itemsArray', files)}
                                />
                            </>
                        )}
                    </Field>
                </FormItem>
                <br />
            </FormContainer>
            <br />
            <FormItem label="Origin Address">
                <Field name="origin_address">
                    {({ field, form }: FieldProps) => (
                        <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                    )}
                </Field>
            </FormItem>
        </FormContainer>
    )
}

export default BrandFormFirst
