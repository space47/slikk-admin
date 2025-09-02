/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { Field, FieldProps } from 'formik'
import React, { useEffect } from 'react'

interface props {
    label: string
    name: string
    customCss?: string
}

const StoreSelectForm = ({ label, name, customCss }: props) => {
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
                            const selectedStores = storeResults.filter((option) =>
                                field.value?.some((store: any) => store?.id === option.id),
                            )
                            return (
                                <div className="flex flex-col gap-1 w-full max-w-md">
                                    <Select
                                        isMulti
                                        className={`${customCss ? customCss : 'w-full'}`}
                                        options={storeResults}
                                        getOptionLabel={(option) => option.code}
                                        getOptionValue={(option) => option.id}
                                        value={selectedStores || null}
                                        onChange={(newVal) => {
                                            form.setFieldValue('store', newVal)
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
