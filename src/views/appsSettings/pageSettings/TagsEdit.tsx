/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface FilterProps {
    filterOptions: any
    isValue?: boolean
    customClass?: string
}

const TagsEdit = ({ filterOptions, isValue, customClass }: FilterProps) => {
    return (
        <FormContainer className={` ${customClass ? customClass : 'grid grid-cols-2 gap-4 w-3/4 '} `}>
            {/* Filters */}
            <FormItem label="Section Filters">
                <Field name="section_filters">
                    {({ field, form }: FieldProps<any>) => {
                        // Ensure field.value is an array
                        const selectedTags = Array.isArray(field.value)
                            ? field.value.map((tag: any) => {
                                  const matchedOption = filterOptions.find((option: any) => option.value === tag)
                                  return (
                                      matchedOption || {
                                          value: tag,
                                          label: tag,
                                      }
                                  )
                              })
                            : []

                        return (
                            <Select
                                isMulti
                                placeholder="Select Filter Tags"
                                options={filterOptions}
                                value={isValue ? selectedTags : []}
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
        </FormContainer>
    )
}

export default TagsEdit
