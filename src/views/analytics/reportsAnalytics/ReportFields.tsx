/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldArray, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'

interface ReportFieldsProps {
    values: any[]
    reportQueryArray: any[]
    optionDataMap: any
    storeName: any
}

const ReportFields = ({ values, reportQueryArray, optionDataMap, storeName }: ReportFieldsProps) => {
    const [showInfo, setShowInfo] = useState(false)

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
        <FormContainer>
            <FormItem asterisk label="Required Fields" className="col-span-1 w-full sm:w-[80%] md:w-[70%] lg:w-[60%] h-auto">
                <FieldArray name="required_fields">
                    {() => (
                        <div>
                            {values?.map((item: any, index: number) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:space-x-4 mt-2 items-center rounded-lg px-4 py-2">
                                    <Field
                                        name={`required_fields[${index}].position`}
                                        placeholder="Key"
                                        component={Input}
                                        className="w-full sm:w-2/3 hidden"
                                        type="number"
                                    />
                                    <Field
                                        name={`required_fields[${index}].key`}
                                        placeholder="Key"
                                        component={Input}
                                        className="w-full sm:w-2/3"
                                    />
                                    <Field name={`required_fields[${index}].dataType`}>
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                isDisabled
                                                className="w-full"
                                                placeholder="Select dataType"
                                                options={reportQueryArray}
                                                value={reportQueryArray.find((option) => option.value === field.value)}
                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                            />
                                        )}
                                    </Field>
                                    <Field name={`required_fields[${index}].value`}>
                                        {({ field, form }: FieldProps) => {
                                            const { dataType, key } = values[index]
                                            const options = optionDataMap[key]

                                            if (dataType === 'Select' && options) {
                                                const selectedOption = options.find(
                                                    (option: any) => option.name?.toLowerCase() === field.value?.toLowerCase(),
                                                )

                                                return (
                                                    <div className="w-full">
                                                        <Select
                                                            isClearable
                                                            className="w-full"
                                                            {...field}
                                                            options={options}
                                                            getOptionLabel={(option) => option?.name}
                                                            getOptionValue={(option) => option?.id?.toString()}
                                                            value={selectedOption || null}
                                                            onChange={(newVal) => {
                                                                form.setFieldValue(`required_fields[${index}].value`, newVal?.name)
                                                            }}
                                                        />
                                                        {showInfo && (
                                                            <p className="mt-2 text-sm text-yellow-500">Leave empty to select all</p>
                                                        )}
                                                    </div>
                                                )
                                            }

                                            if (dataType === 'MultiSelect' && options) {
                                                const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value.split(',')

                                                const selectedOptions = fieldValueArray.map((item: any) => {
                                                    const selectedOption = options?.find((options: any) => {
                                                        return options?.name.toLowerCase() === item.toLowerCase()
                                                    })
                                                    return selectedOption
                                                })

                                                return (
                                                    <Select
                                                        isMulti
                                                        isClearable
                                                        className="w-full"
                                                        {...field}
                                                        options={options}
                                                        getOptionLabel={(option) => option?.name}
                                                        getOptionValue={(option) => option?.id?.toString()}
                                                        value={selectedOptions}
                                                        onChange={(newVals) => {
                                                            console.log('multiselect values', newVals)
                                                            const selectedValues = newVals?.map((val: any) => val.name) || []

                                                            form.setFieldValue(`required_fields[${index}].value`, selectedValues)
                                                        }}
                                                    />
                                                )
                                            }

                                            return (
                                                <Input
                                                    type={dataType === 'Date' ? 'date' : 'text'}
                                                    placeholder={dataType === 'Date' ? 'Select date' : 'Enter value'}
                                                    {...field}
                                                    className="w-full"
                                                />
                                            )
                                        }}
                                    </Field>
                                </div>
                            ))}
                        </div>
                    )}
                </FieldArray>
                {storeName !== null && storeName !== undefined && storeName !== '' && (
                    <FormContainer className="flex justify-center mt-8 mb-9">
                        <Button variant="new" type="submit" className="text-white">
                            Generate
                        </Button>
                    </FormContainer>
                )}
            </FormItem>
        </FormContainer>
    )
}

export default ReportFields
