import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import { Field, FieldProps } from 'formik'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { TimeFieldsArray, TimerPositionArray } from '../newPageSettingsUtils/newPageCommons'
import CommonSelect from '../../pageSettings/CommonSelect'

const ExtraConfig = () => {
    return (
        <FormContainer className="grid grid-cols-2 gap-2">
            <FormItem label="Timeout" className="mt-4">
                <Field name="extra_info.timeout">
                    {({ field, form }: FieldProps) => (
                        <DatePicker
                            showTime
                            placeholder=""
                            className=" md:w-2/3 lg:w-1/2 xl:w-2/3"
                            value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                            onChange={(value) => {
                                form.setFieldValue('extra_info.timeout', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                            }}
                        />
                    )}
                </Field>
            </FormItem>
            {TimeFieldsArray.slice(0, 3).map((item, key) => (
                <FormItem key={key} asterisk label={item.label} className="w-full">
                    <Field
                        type={item.type}
                        name={item.name}
                        placeholder={`Enter ${item.label}`}
                        component={item?.type === 'checkbox' ? Checkbox : Input}
                        min="0"
                    />
                </FormItem>
            ))}
            <CommonSelect
                needClassName
                label="Timer Text Position"
                name="extra_info.timer_text_position"
                options={TimerPositionArray}
                className="col-span-1 w-1/2"
            />
            {TimeFieldsArray.slice(3).map((item, key) => (
                <FormItem key={key} asterisk label={item.label} className="w-full">
                    <Field
                        type={item.type}
                        name={item.name}
                        placeholder={`Enter ${item.label}`}
                        component={item?.type === 'checkbox' ? Checkbox : Input}
                        min="0"
                    />
                </FormItem>
            ))}
        </FormContainer>
    )
}

export default ExtraConfig
