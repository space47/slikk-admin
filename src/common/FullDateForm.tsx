import { FormItem } from '@/components/ui'
import { DatePicker } from 'antd'
import { Field } from 'formik'
import moment from 'moment'
import React from 'react'

interface props {
    label: string
    name: string
    fieldname: string
}

const FullDateForm = ({ label, name, fieldname }: props) => {
    return (
        <div>
            <FormItem label={label}>
                <Field name={name}>
                    {({ field, form }: any) => (
                        <DatePicker
                            showTime
                            placeholder=""
                            className="w-1/2"
                            value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
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
