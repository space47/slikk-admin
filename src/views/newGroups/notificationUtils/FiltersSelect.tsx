/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface FiltersSelectProps {
    index: number
    filter: any[]
    is_aggregation?: boolean
}

const FiltersSelect = ({ filter, index, is_aggregation }: FiltersSelectProps) => {
    return (
        <div>
            <Field name={is_aggregation ? `conditions[${index}].agg_value` : `conditions[${index}].value`}>
                {({ field, form }: FieldProps) => {
                    const options =
                        filter?.map((c: any) => ({
                            label: c.name,
                            value: c.name, // use id if available
                        })) || []
                    return (
                        <Select
                            isClearable
                            className="w-full"
                            placeholder="Select Category"
                            options={options}
                            value={options.find((opt) => opt.value === field.value) || null}
                            onChange={(option) => form.setFieldValue(field.name, option?.value)}
                        />
                    )
                }}
            </Field>
        </div>
    )
}

export default FiltersSelect
