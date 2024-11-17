/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldArray, FieldProps } from 'formik'
import React from 'react'

interface ReportFieldsProps {
    values: any[]
    reportQueryArray: any
    optionDataMap: any
    storeName: any
}

const ReportFields = ({ values, reportQueryArray, optionDataMap, storeName }: ReportFieldsProps) => {
    return (
        <FormContainer>
            <FormItem asterisk label="Required Fields" className="col-span-1 w-[60%] h-[80%]">
                <FieldArray name="required_fields">
                    {({ push, remove }) => (
                        <div>
                            {values?.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex space-x-4 mt-2 xl:flex-row flex-col items-center
                                                    rounded-lg px-4 py-2"
                                >
                                    <Field name={`required_fields[${index}].key`} placeholder="Key" component={Input} className="w-full" />
                                    <Field name={`required_fields[${index}].dataType`}>
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                className=" w-full"
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
                                            const fieldValue = Array.isArray(field.value) ? field.value : []
                                            const options = optionDataMap[key]

                                            if ((dataType === 'Select' || dataType === 'MultiSelect') && options) {
                                                const selectedOption = options.find(
                                                    (option: any) => option.name.toLowerCase() === field.value.toLowerCase(),
                                                )

                                                return (
                                                    <Select
                                                        className=" w-full"
                                                        {...field}
                                                        options={options}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id.toString()}
                                                        value={selectedOption || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue(`required_fields[${index}].value`, newVal?.name)
                                                        }}
                                                    />
                                                )
                                            }

                                            return (
                                                <Input
                                                    type={dataType === 'Date' ? 'date' : 'text'}
                                                    placeholder={dataType === 'Date' ? 'Select date' : 'Enter value'}
                                                    {...field}
                                                    className=" w-full"
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
                    <FormContainer className="flex  mt-8 mb-9">
                        <Button variant="new" type="submit" className="text-white ">
                            Generate
                        </Button>
                    </FormContainer>
                )}
            </FormItem>
        </FormContainer>
    )
}

export default ReportFields
