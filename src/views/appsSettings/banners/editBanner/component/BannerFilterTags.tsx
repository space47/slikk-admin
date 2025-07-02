/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface props {
    value?: string
    label: string
    name: string
}

const BannerFilterTags = ({ label, name }: props) => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    return (
        <div>
            <FormItem label={label} className="col-span-1 w-1/2">
                <Field name={name}>
                    {({ field, form }: FieldProps<any>) => {
                        const selectedTags = Array.isArray(field?.value)
                            ? field?.value?.map((tag: any) => {
                                  const matchedOption = filters.filters.find((option) => option.value === tag)
                                  return matchedOption || { value: tag, label: tag }
                              })
                            : []

                        return (
                            <Select
                                isMulti
                                placeholder="Select Filter Tags"
                                options={filters.filters}
                                value={selectedTags}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                onChange={(newVal) => {
                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                    form.setFieldValue(field.name, newValues)
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default BannerFilterTags
