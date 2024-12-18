import React from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, FieldProps } from 'formik'
import Select from '@/components/ui/Select'

interface PROPS {
    label: string
    name: string
    defaultValue: any
    fieldValues: string
    setFieldValue: any
    options: any
    needClassName?: boolean
}

const SectionsComponent = ({ label, name, defaultValue, fieldValues, setFieldValue, options, needClassName }: PROPS) => {
    return (
        <FormContainer>
            <FormItem label={label} className={needClassName ? 'col-span-1 w-1/2' : 'col-span-1 w-full'}>
                <Field name={name}>
                    {({ field }: FieldProps<any>) => {
                        const fieldValue = Array.isArray(field.value) ? field.value : []

                        return (
                            <Select
                                isMulti
                                field={field}
                                defaultValue={defaultValue.filter((option) => fieldValue.some((item) => item.name === option.name))}
                                options={options}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id.toString()}
                                onChange={(newVal) => {
                                    setFieldValue(name, newVal ? newVal : [])
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </FormContainer>
    )
}

export default SectionsComponent
