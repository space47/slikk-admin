/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface props {
    label: string
    name: string
    options: any[]
    compareKey: string
    customClass?: string
    setFieldValue: any
}

const MultiSelect = ({ label, name, options, customClass, compareKey, setFieldValue }: props) => {
    return (
        <div>
            <FormItem label={label} className={customClass ? customClass : 'col-span-1 w-1/2'}>
                <Field name={name}>
                    {({ field }: FieldProps) => {
                        const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value?.split(',')

                        const selectedOptions = fieldValueArray?.map((item: any) => {
                            const selectedOption = options?.find((options: any) => {
                                return options[compareKey] === item
                            })
                            return selectedOption
                        })

                        return (
                            <Select
                                isClearable
                                isMulti
                                options={options}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option[compareKey]}
                                value={selectedOptions}
                                onChange={(newVals) => {
                                    const selectedValues = newVals?.map((val: any) => val[compareKey]) || []
                                    setFieldValue(name, selectedValues)
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default MultiSelect
