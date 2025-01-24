import { FormContainer, FormItem, Input, Select } from '@/components/ui'
import React from 'react'
import { CareerFormArray } from './careersCommon'
import { Field, FieldProps } from 'formik'
import CommonSelectByLabel from '@/common/CommonSelectByLabel'
import { RichTextEditor } from '@/components/shared'

const JobTypeArray = [
    { label: 'Full Time', value: 'FULL_TIME' },
    { label: 'Part Time', value: 'PART_TIME' },
    { label: 'Contract', value: 'CONTRACT' },
    { label: 'Internship', value: 'INTERNSHIP' },
]

interface props {
    departmentsData: any[]
}

const CareerForm = ({ departmentsData }: props) => {
    const formattedData = departmentsData?.map((item) => ({
        label: item?.name,
        value: item?.id,
    }))

    console.log('formated daata', formattedData)

    return (
        <div>
            <FormContainer>
                <FormContainer className="grid grid-cols-2 gap-4">
                    {CareerFormArray.map((item, key) => {
                        return (
                            <FormItem key={key} label={item?.label}>
                                <Field
                                    name={item?.name}
                                    component={Input}
                                    type={item?.type}
                                    placeholder={`Enter ${item?.label}`}
                                    className="w-3/4"
                                />
                            </FormItem>
                        )
                    })}
                </FormContainer>
                <FormItem label="Description">
                    <Field name="description">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>

                <FormContainer className="grid grid-cols-2">
                    <CommonSelectByLabel label="Job Type" options={JobTypeArray} name="job_type" fieldname="job_type" />
                    {/* <CommonSelectByLabel
                        label="Select Department"
                        options={formattedData}
                        name="department_name"
                        fieldname="department_name"
                    /> */}

                    <FormItem label="Department Name">
                        <Field name="department">
                            {({ form, field }: FieldProps) => {
                                console.log('field', field?.value)
                                const selectedCompany = formattedData?.find((option) => option.value === field?.value)

                                return (
                                    <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                        <Select
                                            isClearable
                                            className="w-full"
                                            options={formattedData}
                                            getOptionLabel={(option) => option.label}
                                            getOptionValue={(option) => option.value}
                                            value={selectedCompany || null}
                                            onChange={(newVal) => {
                                                form.setFieldValue(field.name, newVal?.value)
                                            }}
                                        />
                                    </div>
                                )
                            }}
                        </Field>
                    </FormItem>
                </FormContainer>

                <FormItem label="Responsibilities">
                    <Field name="responsibilities">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>
                <FormItem label="How To Apply">
                    <Field name="how_to_apply">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default CareerForm
