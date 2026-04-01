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
    noTime?: boolean
}

const FullDateForm = ({ label, name, fieldname, customCss, noTime }: props) => {
    const format = noTime ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'

    return (
        <div>
            <FormItem label={label}>
                <Field name={name}>
                    {({ field, form }: FieldProps) => (
                        <DatePicker
                            showTime={!noTime}
                            placeholder=""
                            className={customCss ? customCss : 'w-full max-w-md'}
                            value={field.value ? dayjs(field.value, format) : null}
                            onChange={(value) => {
                                form.setFieldValue(fieldname, value ? value.format(format) : '')
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default FullDateForm
