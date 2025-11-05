/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface props {
    label: string
    name: string
    fieldname: string
    customCss?: string
}

const FullDateForm = ({ label, name, fieldname, customCss }: props) => {
    return (
        <div>
            <FormItem label={label}>
                <Field name={name}>
                    {({ field, form }: FieldProps) => (
                        <DatePicker
                            showTime
                            placeholder=""
                            className={customCss ? customCss : 'w-full max-w-md'}
                            value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                            onChange={(value) => {
                                form.setFieldValue(fieldname, value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default FullDateForm
