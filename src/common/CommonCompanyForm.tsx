/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface Props {
    label: string
    name: string
    queryVal: keyof SINGLE_COMPANY_DATA
}

const CommonCompanyForm = ({ label, name, queryVal }: Props) => {
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    return (
        <FormItem label={label}>
            <Field name={name}>
                {({ field, form }: FieldProps) => {
                    const selectedCompany = companyList.find((option) => option[queryVal]?.toString() === field.value?.toString())

                    return (
                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                            <Select
                                className="w-full"
                                options={companyList}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option[queryVal]?.toString() ?? ''}
                                value={selectedCompany || null}
                                onChange={(newVal: any) => {
                                    form.setFieldValue(name, newVal?.[queryVal] ?? '')
                                }}
                            />
                        </div>
                    )
                }}
            </Field>
        </FormItem>
    )
}

export default CommonCompanyForm
