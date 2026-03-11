import { RichTextEditor } from '@/components/shared'
import { FormItem } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface props {
    label: string
    name: string
    isRequired?: boolean
}

const RichTextCommon = ({ label, name, isRequired }: props) => {
    return (
        <FormItem label={label} labelClass="!justify-start" className="w-full" asterisk={isRequired}>
            <Field name={name}>
                {({ field, form }: FieldProps) => (
                    <RichTextEditor
                        value={field.value}
                        onChange={(val) => {
                            form.setFieldValue(field.name, val)
                        }}
                    />
                )}
            </Field>
        </FormItem>
    )
}

export default RichTextCommon
