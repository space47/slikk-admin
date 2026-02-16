/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useState } from 'react'

interface Props {
    values: any
}

type ViewMode = 'split' | 'editor' | 'preview'

const TemplateForm = ({ values }: Props) => {
    const [viewMode, setViewMode] = useState<ViewMode>('split')

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
            <FormContainer className="mt-10 rounded-2xl bg-blue-50 p-6 shadow-sm border border-blue-100">
                <FormItem label="Email Body (HTML)">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div className="flex gap-2">
                            {(['split', 'editor', 'preview'] as ViewMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1 text-xs rounded-full transition 
                                        ${viewMode === mode ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
                                >
                                    {mode.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {(viewMode === 'split' || viewMode === 'editor') && (
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">HTML Editor</label>
                                <Field name="email_body">
                                    {({ field }: FieldProps) => (
                                        <textarea
                                            {...field}
                                            rows={18}
                                            className="w-full border rounded-xl p-4 font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            placeholder="<h1>Hello World</h1>"
                                        />
                                    )}
                                </Field>
                            </div>
                        )}
                        {(viewMode === 'split' || viewMode === 'preview') && (
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">Live Preview</label>
                                <div
                                    className={`border rounded-xl p-4 min-h-[300px] bg-white overflow-auto transition-all duration-300 ${'w-full'}`}
                                >
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
                        )}
                    </div>
                </FormItem>
            </FormContainer>
        </FormContainer>
    )
}

export default TemplateForm
