/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA, USER_PROFILE_DATA } from '@/store/types/company.types'
import { Field, FieldArray, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'

interface SalesReportFieldsProps {
    values: any[]
    reportQueryArray: any
    optionDataMap: any
    storeName: any
}

const SalesReportFields = ({ values, reportQueryArray, optionDataMap, storeName }: SalesReportFieldsProps) => {
    const [showInfo, setShowInfo] = useState(false)
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((state) => state.company.currCompany)

    console.log('Company status', selectedCompany?.name)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInfo(true)
            const hideTimer = setTimeout(() => {
                setShowInfo(false)
            }, 6000)
            return () => clearTimeout(hideTimer)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])
    return (
        <FormContainer className="items-end">
            <div className="flex text-xl gap-2 font-bold  mb-4">
                <span className="text-blue-700">SALES OVERVIEW</span>
            </div>
            <FormItem className="col-span-1 w-[60%] h-[80%]">
                <FieldArray name="required_fields">
                    {({ push, remove }) => (
                        <div>
                            {values?.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex space-x-4 mt-2 b xl:flex-row xl:justify-between  flex-col gap-5 items-center rounded-lg px-4 py-2"
                                >
                                    <div className="">
                                        <Field name={`required_fields[${index}].key`}>
                                            {({ field }: { field: any }) => {
                                                const { dataType, key } = values[index]
                                                if (key === 'brand') {
                                                    return (
                                                        <div className="hidden">
                                                            <Input type="text" placeholder="" {...field} className="w-2/3" />
                                                        </div>
                                                    )
                                                }
                                                return (
                                                    <div className="flex gap-1 xl:text-[16px] font-bold  items-end">
                                                        {key.toUpperCase()}:
                                                    </div>
                                                )
                                            }}
                                        </Field>
                                    </div>

                                    <Field name={`required_fields[${index}].dataType`}>
                                        {({ field, form }: FieldProps) => {
                                            const { dataType, key } = values[index]

                                            return (
                                                <Select
                                                    className="w-full hidden"
                                                    placeholder="Select dataType"
                                                    options={reportQueryArray}
                                                    isDisabled
                                                    value={reportQueryArray.find((option) => option.value === field.value)}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                />
                                            )
                                        }}
                                    </Field>

                                    <Field name={`required_fields[${index}].value`}>
                                        {({ field, form }: FieldProps) => {
                                            const { dataType, key } = values[index]
                                            const fieldValue = Array.isArray(field.value) ? field.value : []
                                            const options = optionDataMap[key]

                                            if (key === 'brand') {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="hidden space-x-4 mt-2 xl:flex-row flex-col items-center rounded-lg px-4 py-2"
                                                    >
                                                        <Field name={`required_fields[${index}].key`} component="input" />
                                                        <Field name={`required_fields[${index}].dataType`} component="input" />
                                                        <Field name={`required_fields[${index}].value`} component="input" />
                                                    </div>
                                                )
                                            }

                                            if (dataType === 'Select' && options) {
                                                const selectedOption = options.find(
                                                    (option: any) => option.name?.toLowerCase() === field.value?.toLowerCase(),
                                                )

                                                return (
                                                    <div className="w-2/3">
                                                        <Select
                                                            className="w-1/3"
                                                            {...field}
                                                            options={options}
                                                            getOptionLabel={(option) => option?.name}
                                                            getOptionValue={(option) => option?.id?.toString()}
                                                            value={selectedOption || null}
                                                            isClearable
                                                            onChange={(newVal) => {
                                                                form.setFieldValue(`required_fields[${index}].value`, newVal?.name)
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }

                                            if (dataType === 'MultiSelect' && options) {
                                                const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value.split(',')

                                                const selectedOptions = fieldValueArray.map((item) =>
                                                    options.find((option) => option?.name.toLowerCase() === item.toLowerCase()),
                                                )

                                                return (
                                                    <Select
                                                        className="w-1/2"
                                                        {...field}
                                                        options={options}
                                                        getOptionLabel={(option) => option?.name}
                                                        getOptionValue={(option) => option?.id?.toString()}
                                                        value={selectedOptions}
                                                        isMulti
                                                        isClearable
                                                        onChange={(newVals) => {
                                                            const selectedValues = newVals?.map((val: any) => val.name) || []
                                                            form.setFieldValue(`required_fields[${index}].value`, selectedValues)
                                                        }}
                                                    />
                                                )
                                            }

                                            return (
                                                <div className="w-2/3">
                                                    <Input
                                                        type={dataType === 'Date' ? 'date' : 'text'}
                                                        placeholder={dataType === 'Date' ? 'Select date' : 'Enter value'}
                                                        {...field}
                                                        className="w-1/3"
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>

                                    <FormContainer className="hidden">
                                        <Field
                                            name={`required_fields[${index}].prefix`}
                                            placeholder="Key"
                                            component={Input}
                                            className="w-full"
                                        />
                                        <Field
                                            name={`required_fields[${index}].suffix`}
                                            placeholder="Key"
                                            component={Input}
                                            className="w-full"
                                        />
                                    </FormContainer>
                                </div>
                            ))}
                        </div>
                    )}
                </FieldArray>

                <FormContainer className="flex mt-8 mb-9">
                    <Button variant="new" type="submit" className="text-white">
                        Generate
                    </Button>
                </FormContainer>
            </FormItem>
        </FormContainer>
    )
}

export default SalesReportFields
