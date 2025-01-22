import { FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface optionsType {
    label: string
    value: string
}

interface props {
    label: string
    name: string
    fieldname: string
    options: optionsType[]
}

const CommonSelectByLabel = ({ label, name, fieldname, options }: props) => {
    return (
        <div>
            <FormItem label={label}>
                <Field name={name}>
                    {({ form, field }: FieldProps) => {
                        const selectedCompany = options.find((option) => option.value === field?.value)

                        return (
                            <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                <Select
                                    isClearable
                                    className="w-full"
                                    options={options}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={selectedCompany || null}
                                    onChange={(newVal) => {
                                        form.setFieldValue(field.name, newVal?.value)
                                    }}
                                />
                            </div>
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default CommonSelectByLabel
