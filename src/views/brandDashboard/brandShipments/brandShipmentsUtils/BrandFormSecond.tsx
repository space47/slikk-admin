import { RichTextEditor } from '@/components/shared'
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

const BrandFormSecond = () => {
    return (
        <FormContainer>
            <FormItem label="POC Name" className="col-span-1 w-3/4">
                <Field type="text" name="dispatched_by" component={Input} placeholder="Enter Dispatch By Name" />
            </FormItem>
            <FormItem label="Delivery Address">
                <Field name="delivery_address">
                    {({ field, form }: FieldProps) => (
                        <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                    )}
                </Field>
            </FormItem>
        </FormContainer>
    )
}

export default BrandFormSecond
