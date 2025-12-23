/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import { Field, FieldProps } from 'formik'
import React, { useEffect } from 'react'

interface props {
    value?: string
    label: string
    name: string
}

const BannerFilterTags = ({ label, name }: props) => {
    const dispatch = useAppDispatch()
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    return (
        <div>
            <FormItem label={label} className="col-span-1">
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
