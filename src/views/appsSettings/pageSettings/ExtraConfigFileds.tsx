import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import { TimeFieldsArray } from './configurationCommon'
import { Field } from 'formik'
import { DatePicker } from 'antd'
import moment from 'moment'
import CommonSelect from './CommonSelect'
import dayjs from 'dayjs'

const TimerPositionArray = [
    {
        label: 'Left',
        value: 'left',
    },
    {
        label: 'Right',
        value: 'right',
    },
    {
        label: 'Top',
        value: 'top',
    },
    {
        label: 'Bottom',
        value: 'bottom',
    },
]

const ExtraConfigFileds = () => {
    return (
        <FormContainer className="grid grid-cols-2 gap-2">
            <FormItem label="Timeout" className="mt-4">
                <Field name="extra_info.timeout">
                    {({ field, form }: any) => (
                        <DatePicker
                            showTime
                            placeholder=""
                            value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                            onChange={(value) => {
                                form.setFieldValue('extra_info.timeout', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                            }}
                            className=" md:w-2/3 lg:w-1/2 xl:w-2/3"
                        />
                    )}
                </Field>
            </FormItem>
            {TimeFieldsArray.slice(0, 3).map((item, key) => (
                <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
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
                label="Timer Text Position"
                name="extra_info.timer_text_position"
                options={TimerPositionArray}
                needClassName
                className="col-span-1 w-1/2"
            />
            {TimeFieldsArray.slice(3).map((item, key) => (
                <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
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

export default ExtraConfigFileds
