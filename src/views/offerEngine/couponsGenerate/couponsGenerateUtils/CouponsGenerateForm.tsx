/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Tooltip, Upload } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { AutoGenerateType, NumericTypeArray } from './CouponsGenerateCommon'
import { DatePicker } from 'antd'

import { beforeUpload } from '@/common/beforeUpload'
import { CiCircleQuestion } from 'react-icons/ci'
import dayjs from 'dayjs'

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
            <FormItem label="">
                <div className="flex gap-2">
                    <span className="font-bold">Max Count</span>
                    <Tooltip title="Enter Max Count manually otherwise it will take the value of the max count of series">
                        <CiCircleQuestion className="text-yellow-800 text-xl" />
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                    <Field type="number" name="max_count" component={Input} placeholder="Enter max count" />
                </div>
            </FormItem>
            <FormItem label="CSV for User" className="flex gap-2 bg-blue-100 p-3 rounded-xl">
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
                <Field type="checkbox" name="unique_user_code" component={Checkbox} />
            </FormItem>
            <FormItem label="Auto Generate Code">
                <Field type="checkbox" name="auto_generate_code" component={Checkbox} />
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
                            value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
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
