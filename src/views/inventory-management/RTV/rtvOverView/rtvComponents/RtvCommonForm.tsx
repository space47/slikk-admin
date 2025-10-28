import StoreSelectForm from '@/common/StoreSelectForm'
import { FormContainer, FormItem, Input, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { Field, FieldProps } from 'formik'
import React from 'react'

const RtvCommonForm = () => {
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    return (
        <FormContainer className="grid grid-cols-2 gap-3">
            <FormItem label="Document Number">
                <Field type="text" name="document_number" component={Input} placeholder="Enter Document Number" />
            </FormItem>
            <FormItem label="Select Company">
                <Field name="company">
                    {({ form }: FieldProps) => {
                        const selectedCompany = companyList.find((option) => option.id === form.values.company)

                        return (
                            <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                <Select
                                    className="w-full"
                                    options={companyList}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id?.toString()}
                                    value={selectedCompany || null}
                                    onChange={(newVal) => {
                                        form.setFieldValue('company', newVal?.id)
                                    }}
                                />
                            </div>
                        )
                    }}
                </Field>
            </FormItem>
            <StoreSelectForm label="Store" name="store" isSingle />
        </FormContainer>
    )
}

export default RtvCommonForm
