/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { ActionMeta, MultiValue } from 'react-select'

interface props {
    label: string
    name: string
    options: any[]
    needCss?: boolean
    className?: string
    isOnchange?: boolean
    onChangeValue?: (
        newValue: MultiValue<{
            value: string
            label: string
        }>,
        actionMeta: ActionMeta<{
            value: string
            label: string
        }>,
    ) => void
    setFieldValue?: any
    anyThing?: any
    isId?: boolean
}

const CommonMultiSelect = ({
    label,
    name,
    options,
    needCss = false,
    className,
    isOnchange = false,
    onChangeValue,
    setFieldValue,
    isId = false,
}: props) => {
    return (
        <div>
            <FormItem label={label} className={needCss ? className : 'col-span-1 w-1/2'}>
                <Field name={name}>
                    {({ field }: FieldProps) => {
                        const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value?.split(',')

                        const selectedOptions = isId
                            ? fieldValueArray?.map((item: any) => {
                                  const selectedOption = options?.find((options: any) => {
                                      return options.id === item
                                  })
                                  return selectedOption
                              })
                            : fieldValueArray?.map((item: any) => {
                                  const selectedOption = options?.find((options) => {
                                      return options?.name?.toLowerCase() === item?.toLowerCase()
                                  })
                                  return selectedOption
                              })

                        return (
                            <Select
                                isClearable
                                isMulti
                                options={options}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => (isId ? option.id : option.value)}
                                value={selectedOptions}
                                onChange={
                                    isOnchange
                                        ? onChangeValue
                                        : (newVals) => {
                                              const selectedValues = newVals?.map((val: any) => val.name) || []
                                              setFieldValue(`extra_attributes.applicable_categories`, selectedValues)
                                          }
                                }
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default CommonMultiSelect
