/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { beforeUpload } from '@/common/beforeUpload'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import UploadDocument from '@/common/UploadDocument'
import UploaderFiles from '@/common/UploadFiles'
import { RichTextEditor } from '@/components/shared'
import { Card, FormItem, Input, Select } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field, FieldProps } from 'formik'

const HeaderArray = [
    { label: 'Text', value: 'text' },
    { label: 'Image', value: 'image' },
    { label: 'Video', value: 'video' },
    { label: 'Docs', value: 'document' },
    { label: 'Location', value: 'location' },
]

export const btnsArray = [
    'name',
    'order_id',
    'address',
    'delivery_time',
    'coupon',
    'amount',
    'loyalty',
    'order_count',
    'DOB',
    'return_order_id',
    'return_amount',
    'refund_amount',
    'return_date',
    'return_slot',
]

interface EditContentSetupProps {
    values: any
    setTemplateImagePreview: any
    setTemplateTextPreview: any
    setTemplateVideoPreview: any
    setTemplatedocsPreview: any
    setBodyTemplate: any
    setBodyButtonVariable?: any
    setTextButtonVariable: any
    setSampleValues: any
    sampleValues: any
    setSampleBodyValues: any
    sampleBodyValues: any
}

const EditContentSetup = ({
    values,
    setTemplateImagePreview,
    setTemplateTextPreview,
    setTemplateVideoPreview,
    setTemplatedocsPreview,
    setBodyTemplate,
    setBodyButtonVariable,
    setTextButtonVariable,
    setSampleValues,
    sampleValues,
    setSampleBodyValues,
    sampleBodyValues,
}: EditContentSetupProps) => {
    const [activeButton, setActiveButton] = useState<string | null>(null)

    // Dynamically handle sample value changes for header
    const handleSampleValueChange = (field: string, value: string) => {
        setSampleValues((prev: any) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Dynamically handle sample body value changes for body
    const handleSampleBodyValueChange = (field: string, value: string) => {
        setSampleBodyValues((prev: any) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleTextVariable = (field: any, form: any, variable: string) => {
        setBodyButtonVariable((prev) => [...(Array.isArray(prev) ? prev : []), variable])
        const currentBody = field.value || ''
        const updatedBody = `${currentBody}{{${variable}}}`
        form.setFieldValue(field.name, updatedBody)
        setBodyTemplate(updatedBody)
        handleSampleValueChange(variable, '')
        setActiveButton(variable)

        setSampleValues((prev: any) => ({
            ...prev,
            [variable]: '', // Add the new dynamic field for the clicked variable
        }))
    }

    const handleInsertVariable = (field: any, form: any, variable: string) => {
        setBodyButtonVariable((prev) => [...(Array.isArray(prev) ? prev : []), variable])
        const currentBody = field.value || ''
        const updatedBody = `${currentBody}{{${variable}}}`
        form.setFieldValue(field.name, updatedBody)
        setBodyTemplate(updatedBody)
        handleSampleBodyValueChange(variable, '')
        setActiveButton(variable)

        setSampleBodyValues((prev: any) => ({
            ...prev,
            [variable]: '',
        }))
    }

    return (
        <Card>
            <div className="flex flex-col">
                <span className="font-bold text-xl">Content</span>
                <p>Fill out the header, body, and footer of your template</p>
            </div>

            <div className="mt-5">
                <FormItem label="Header">
                    <Field name="header">
                        {({ field, form }: FieldProps<any>) => {
                            return (
                                <Select
                                    isClearable
                                    options={HeaderArray}
                                    value={HeaderArray.find((option) => option.value === field.value)}
                                    onChange={(option) => {
                                        const value = option ? option.value : ''
                                        form.setFieldValue(field.name, value)
                                        console.log('FIELD.NAME', field.name)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
                {values?.header !== '' && <label htmlFor="">Header Sample</label>}
                {values?.header === 'text' && (
                    <Field name="header_text">
                        {({ field, form }: FieldProps) => (
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Enter Title"
                                    value={field.value}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        form.setFieldValue(field.name, e.target.value)
                                        setTemplateTextPreview(e.target.value)
                                    }}
                                />
                                <div className="mb-4 mt-4 font-bold">Header Variables</div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {btnsArray.map((item, key) => (
                                        <button
                                            type="button"
                                            className="bg-gray-600 text-white p-1 rounded-md hover:bg-gray-500"
                                            key={key}
                                            onClick={() => handleTextVariable(field, form, item)}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <div className="font-bold">Header Sample Values</div>
                                    {/* Render all sample fields dynamically for header */}
                                    {Object.keys(sampleValues).map((item) => (
                                        <div key={item} className="mt-2">
                                            <label>{item} Sample</label>
                                            <Input
                                                type="text"
                                                placeholder={`Enter sample for ${item}`}
                                                value={sampleValues[item] || ''}
                                                onChange={(e) => handleSampleValueChange(item, e.target.value)} // Update sample value dynamically
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Field>
                )}
                {/* Handle other header types */}
                {values?.header === 'image' && (
                    <UploaderFiles
                        label="Image"
                        name="header_image"
                        beforeFileUpload={beforeUpload}
                        fieldname="header_image"
                        setFields={setTemplateImagePreview}
                    />
                )}
                {values?.header === 'video' && (
                    <UploaderFiles
                        label="Video"
                        name="header_video"
                        beforeFileUpload={beforeVideoUpload}
                        fieldname="header_video"
                        setFields={setTemplateVideoPreview}
                    />
                )}
                {values?.header === 'document' && <UploadDocument label="Documents" name="header_documents" />}
            </div>

            <div className="mt-8">
                <FormItem label="Body">
                    <Field name="body">
                        {({ field, form }: FieldProps) => (
                            <>
                                <RichTextEditor
                                    value={field.value}
                                    onChange={(val) => {
                                        form.setFieldValue(field.name, val)
                                        setBodyTemplate(val)
                                    }}
                                />
                                <div className="mb-4 mt-4 font-bold">Body Variables</div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {btnsArray.map((item, key) => (
                                        <button
                                            className="bg-gray-600 text-white p-1 rounded-md hover:bg-gray-500"
                                            key={key}
                                            type="button"
                                            onClick={() => handleInsertVariable(field, form, item)}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <div className="font-bold">Body Sample Values</div>
                                    {/* Render all sample fields dynamically for body */}
                                    {Object.keys(sampleBodyValues).map((item) => (
                                        <div key={item} className="mt-2">
                                            <label>{item} Sample</label>
                                            <Input
                                                type="text"
                                                placeholder={`Enter sample for ${item}`}
                                                value={sampleBodyValues[item] || ''} // Use sampleBodyValues here
                                                onChange={(e) => handleSampleBodyValueChange(item, e.target.value)} // Update sample body value dynamically
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </Field>
                </FormItem>
            </div>

            <div className="mt-8">
                <FormItem label="Footer(optional)">
                    <Field name="footer">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>
            </div>
        </Card>
    )
}

export default EditContentSetup
