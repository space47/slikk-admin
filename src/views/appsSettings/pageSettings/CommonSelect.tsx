import { FormContainer, FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface SELECTPROPS {
    label: string
    name: string
    options: any
}

const CommonSelect = ({ label, name, options }: SELECTPROPS) => {
    return (
        <FormContainer>
            <FormItem label={label} className="col-span-1 w-full">
                <Field name={name}>
                    {({ field, form }: FieldProps<any>) => {
                        return (
                            <Select
                                field={field}
                                form={form}
                                options={options}
                                value={options.find((option) => option.value === field.value)}
                                onChange={(option) => {
                                    const value = option ? option.value : ''
                                    form.setFieldValue(field.name, value)
                                    console.log('FIELD.NAME', field.name)
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </FormContainer>
    )
}

export default CommonSelect
