/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { AutoGenerateType, NumericTypeArray } from './CouponsGenerateCommon'
import { DatePicker } from 'antd'
import moment from 'moment'

import { beforeUpload } from '@/common/beforeUpload'

interface Props {
    formattedOptions: any[]
    values: any
}

const CouponsGenerateForm = ({ formattedOptions, values }: Props) => {
    return (
        <FormContainer className="grid grid-cols-2 gap-4">
            <CommonSelect options={formattedOptions} name="coupon_series" label="Select Series" />
            <FormItem label="Users">
                <Field type="text" name="users" component={Input} placeholder="Enter Users" />
            </FormItem>
            <FormItem label="CSV for User" className="flex gap-2">
                <FormItem label="" className="grid grid-rows-2">
                    <Field name="docsArray">
                        {({ form }: FieldProps) => (
                            <>
                                <Upload
                                    multiple
                                    className="flex justify-center"
                                    beforeUpload={beforeUpload}
                                    fileList={values.docsArray}
                                    onChange={(files) => form.setFieldValue('docsArray', files)}
                                    onFileRemove={(files) => form.setFieldValue('docsArray', files)}
                                />
                            </>
                        )}
                    </Field>
                </FormItem>
            </FormItem>
            <FormItem label="Coupons Count">
                <Field type="number" min="0" name="coupons_count" component={Input} />
            </FormItem>
            <FormItem label="Unique User Code">
                <Field type="checkbox" name="unique_user_code" component={Input} />
            </FormItem>
            <FormItem label="Auto Generate Code">
                <Field type="checkbox" name="auto_generate_code" component={Input} />
            </FormItem>

            {values.auto_generate_code ? (
                <>
                    <CommonSelect label="Select Type" name="auto_generate_type" options={AutoGenerateType} />
                    {values?.auto_generate_type === 'numeric' && (
                        <CommonSelect label="Select Numeric Type" name="numeric_type" options={NumericTypeArray} />
                    )}
                    {values?.numeric_type === 'series' && (
                        <FormItem label="Series Gap">
                            <Field type="number" min="0" name="series_diff" component={Input} placeholder="Enter series diff" />
                        </FormItem>
                    )}
                    <FormItem label="Length">
                        <Field type="number" min="0" name="length" component={Input} placeholder="Enter Length" />
                    </FormItem>
                    <FormItem label="Prefix">
                        <Field type="text" name="prefix" component={Input} placeholder="Enter Prefix" />
                    </FormItem>
                </>
            ) : (
                <>
                    <FormItem label="Coupon Code Name">
                        <Field type="text" name="coupon_code_name" component={Input} placeholder="Enter Coupon Code Name" />
                    </FormItem>
                </>
            )}
            <FormItem label="Expiry" className="col-span-1 w-full">
                <Field name="valid_to">
                    {({ field, form }: FieldProps) => (
                        <DatePicker
                            showTime
                            placeholder=""
                            value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                            onChange={(value) => {
                                form.setFieldValue('valid_to', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </FormContainer>
    )
}

export default CouponsGenerateForm
