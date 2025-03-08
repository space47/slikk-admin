/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import { TimePicker } from 'antd'
import { Field, FieldProps } from 'formik'
import moment from 'moment'
import React from 'react'

interface Props {
    label: string
    name: string
    fieldname: string
}

const FullTimePicker = ({ label, name, fieldname }: Props) => {
    return (
        <div>
            <FormItem label={label}>
                <Field name={name}>
                    {({ field, form }: FieldProps) => (
                        <TimePicker
                            placeholder=""
                            className="w-1/2"
                            value={field.value ? moment(field.value, 'HH:mm:ss') : undefined}
                            onChange={(value) => {
                                form.setFieldValue(fieldname, value ? value.format('HH:mm:ss') : '')
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default FullTimePicker
