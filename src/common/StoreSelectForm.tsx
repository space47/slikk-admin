/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { Field, FieldProps } from 'formik'
import React, { useEffect } from 'react'

interface Props {
    label: string
    name: string
    customCss?: string
    isSingle?: boolean
}

const StoreSelectForm = ({ label, name, customCss, isSingle = false }: Props) => {
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    return (
        <div>
            <FormContainer>
                <FormItem label={label}>
                    <Field name={name}>
                        {({ form, field }: FieldProps) => {
                            // handle selected values based on isSingle
                            const getFieldValueId = (value: any) => {
                                return typeof value === 'object' && value !== null ? value.id : value
                            }

                            const selectedValue = isSingle
                                ? storeResults.find((option) => option.id === getFieldValueId(field.value))
                                : storeResults.filter((option) => field.value?.some((store: any) => getFieldValueId(store) === option.id))

                            return (
                                <div className="flex flex-col gap-1 w-full max-w-md">
                                    <Select
                                        isMulti={!isSingle}
                                        className={customCss ?? 'w-full'}
                                        options={storeResults}
                                        getOptionLabel={(option) => option.code}
                                        getOptionValue={(option) => option.id.toString()}
                                        value={selectedValue || []}
                                        onChange={(newVal) => {
                                            form.setFieldValue(name, newVal)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default StoreSelectForm
