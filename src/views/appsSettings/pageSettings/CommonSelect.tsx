import { FormContainer, FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface SELECTPROPS {
    label?: string
    name: string
    options: any
    className?: string
    needClassName?: boolean
    requireOnChange?: boolean
    onChange?: any
}

const CommonSelect = ({ label, name, options, className, needClassName = false, requireOnChange = false, onChange }: SELECTPROPS) => {
    return (
        <FormContainer>
            <FormItem label={label || ''} className={needClassName ? className : 'col-span-1 w-full'}>
                <Field name={name}>
                    {({ field, form }: FieldProps<any>) => {
                        return requireOnChange ? (
                            <>
                                <Select
                                    isClearable
                                    options={options}
                                    value={options.find((option) => option.value === field.value)}
                                    onChange={onChange}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                            </>
                        ) : (
                            <Select
                                isClearable
                                options={options}
                                value={options.find((option) => option.value === field.value)}
                                onChange={(option) => {
                                    const value = option ? option.value : ''
                                    form.setFieldValue(field.name, value)
                                    console.log('FIELD.NAME', field.name, value)
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
