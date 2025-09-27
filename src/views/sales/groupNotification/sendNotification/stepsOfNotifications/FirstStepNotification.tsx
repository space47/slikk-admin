/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { RichTextEditor } from '@/components/shared'
import { FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { notificationTypeArray, SendNotificationARRAYType, sendNotificationType } from '../sendNotify.common'

interface FirstStepProps {
    SendNotificationARRAY: SendNotificationARRAYType[]
    values: sendNotificationType
    setMessagePreview: React.Dispatch<React.SetStateAction<string>>
    setImagePreview: React.Dispatch<React.SetStateAction<string>>
    setTitleView: React.Dispatch<React.SetStateAction<string>>
    setFieldValue: (field: string, value: any) => void
}

const FirstStepNotification = ({
    SendNotificationARRAY,
    values,
    setMessagePreview,
    setImagePreview,
    setTitleView,
    setFieldValue,
}: FirstStepProps) => {
    return (
        <div className="space-y-6 shadow-lg rounded-lg px-6 py-4 xl:px-14 xl:py-9">
            <div className="text-lg font-bold xl:text-xl">Basic Information for Sending Notifications</div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
                <FormItem label="Notification Title" className="w-full rounded-[10px]">
                    <Field
                        type="text"
                        name="title"
                        placeholder="Enter Title"
                        component={Input}
                        onChange={(e: any) => {
                            setTitleView(e.target.value)
                            setFieldValue('title', e.target.value)
                        }}
                    />
                </FormItem>
                {SendNotificationARRAY.map((item, key) => (
                    <FormItem key={key} label={item.label} className={`w-full rounded-[10px] ${item.classname || ''}`}>
                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                    </FormItem>
                ))}
                {/* <FormItem label="Notification Type" className="col-span-1 w-full xl:col-span-2 xl:w-1/2">
                    <Field name="notification_type">
                        {({ field, form }: FieldProps) => (
                            <Select
                                isClearable
                                field={field}
                                form={form}
                                options={notificationTypeArray}
                                value={notificationTypeArray.find((option) => option.value === field.value)}
                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                            />
                        )}
                    </Field>
                </FormItem> */}
            </div>

            <FormItem label="Scheduler Message" labelClass="!justify-start" className="w-full">
                <Field name="message">
                    {({ field, form }: FieldProps) => (
                        <RichTextEditor
                            value={field.value}
                            onChange={(val) => {
                                form.setFieldValue(field.name, val)
                                setMessagePreview(val)
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            <FormContainer className="bg-gray-100 p-4 rounded-xl shadow-md space-y-4 xl:p-6">
                <h3 className="text-md font-medium text-center mb-2 xl:text-lg xl:mb-4">Image Upload</h3>
                <FormItem className="w-full">
                    <Field name="image">
                        {({ form }: FieldProps) => (
                            <Upload
                                multiple
                                className="flex justify-center"
                                beforeUpload={beforeUpload}
                                fileList={values.image_url_array}
                                onChange={(files: any) => {
                                    form.setFieldValue('image_url_array', files)
                                    setImagePreview(files)
                                }}
                                onFileRemove={(files) => form.setFieldValue('image_url_array', files)}
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem className="w-full">
                    <Field type="text" name="image_url" placeholder="Enter image URL or upload a file" component={Input} />
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default FirstStepNotification
