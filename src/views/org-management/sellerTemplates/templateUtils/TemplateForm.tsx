/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface Props {
    values: any
}

const TemplateForm = ({ values }: Props) => {
    return (
        <FormContainer>
            <FormContainer className="grid xl:grid-cols-2 grid-cols-1 gap-3">
                <FormItem label="Name">
                    <Field component={Input} placeholder="Enter Name" type="text" name="name" />
                </FormItem>

                <FormItem label="Email Subject">
                    <Field component={Input} placeholder="Enter Email Subject" type="text" name="email_subject" />
                </FormItem>
            </FormContainer>
            <FormContainer className="mt-10 rounded-xl bg-blue-50 p-4">
                <FormItem label="Email Body (HTML)">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-2">HTML Editor</label>
                            <Field name="email_body">
                                {({ field }: FieldProps) => (
                                    <textarea
                                        {...field}
                                        rows={18}
                                        className="w-full border rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="<h1>Hello World</h1>"
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-2">Live Preview</label>
                            <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 overflow-auto">
                                {values.email_body ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: values.email_body,
                                        }}
                                    />
                                ) : (
                                    <p className="text-gray-400 text-sm">Preview will appear here...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </FormItem>
            </FormContainer>
        </FormContainer>
    )
}

export default TemplateForm
