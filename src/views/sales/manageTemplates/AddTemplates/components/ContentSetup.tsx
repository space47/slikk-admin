/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import UploadDocument from '@/common/UploadDocument'
import UploaderFiles from '@/common/UploadFiles'
import { RichTextEditor } from '@/components/shared'
import { Button, Card, FormItem, Input } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field, FieldProps } from 'formik'
import React from 'react'

const HeaderArray = [
    { label: 'Text', value: 'text' },
    { label: 'Image', value: 'image' },
    { label: 'Video', value: 'video' },
    { label: 'Docs', value: 'document' },
    { label: 'Location', value: 'location' },
]

interface ContentSetupProps {
    values: any
    setTemplateImagePreview: any
    setTemplateTextPreview: any
    setTemplateVideoPreview: any
    setTemplatedocsPreview: any
    setBodyTemplate: any
}

const ContentSetup = ({
    values,
    setTemplateImagePreview,
    setTemplateTextPreview,
    setTemplateVideoPreview,
    setTemplatedocsPreview,
    setBodyTemplate,
}: ContentSetupProps) => {
    return (
        <Card>
            <div className="flex flex-col ">
                <span className="font-bold text-xl">Content</span>
                <p>Fill out the header, body and footer of your template</p>
            </div>

            <div className="mt-5">
                <CommonSelect options={HeaderArray} name="header" label="Header" />
                {values?.header !== '' && <label htmlFor="">Header Sample</label>}
                {values?.header === 'text' && (
                    <Field
                        type="text"
                        name="header_text"
                        placeholder="Enter Title"
                        component={Input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplateTextPreview(e.target.value)}
                    />
                )}
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
                        label="Image"
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
                            <RichTextEditor
                                value={field.value}
                                onChange={(val) => {
                                    form.setFieldValue(field.name, val)
                                    setBodyTemplate(val)
                                }}
                            />
                        )}
                    </Field>
                    <div className="flex justify-end mt-4">
                        <button className="bg-blue-600 text-white p-1 rounded-md hover:bg-blue-500">Add Vaiables</button>
                    </div>
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

export default ContentSetup
