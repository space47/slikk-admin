import { FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface props {
    group: any
    values: any
}

const SecondStep = ({ group, values }: props) => {
    return (
        <div>
            <FormContainer>
                <FormItem>
                    <FormItem label="Template Name">
                        <Field name="template_name" type="text" component={Input} placeholder="Template Name" />
                    </FormItem>
                    <FormItem label="Language Code">
                        <Field name="language_code" type="text" component={Input} placeholder="Language Code" />
                    </FormItem>
                    <FormItem label="User">
                        <Field name="user" type="text" component={Input} placeholder="user " />
                    </FormItem>

                    <FormItem label="Group Name">
                        <Field
                            name="group"
                            onKeyDown={(e) => {
                                e.key === 'Enter' && e.preventDefault()
                            }}
                        >
                            {({ field, form }: FieldProps<any>) => (
                                <Select
                                    // defaultValue={bannerForm[index]['category'] || []}
                                    options={group?.group}
                                    getOptionLabel={(option) => option?.name}
                                    getOptionValue={(option) => option?.name}
                                    onChange={(newVal) => {
                                        console.log(newVal?.name)
                                        form.setFieldValue(field.name, newVal?.name)
                                    }}
                                    isClearable
                                />
                            )}
                        </Field>
                    </FormItem>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default SecondStep
