import { beforeUpload } from '@/common/beforeUpload'
import { RichTextEditor } from '@/components/shared'
import { FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { notificationTypeArray } from '../sendNotify.common'

interface FirstStepProps {
    SendNotificationARRAY: any[]
    values: any
}

const FirstStepNotification = ({ SendNotificationARRAY, values }: FirstStepProps) => {
    return (
        <div className="space-y-6 shadow-lg rounded-lg px-14 py-9">
            <div className="text-xl font-bold">Basic Information for Sending Notifications</div>
            <div className="grid grid-cols-2 gap-6">
                {SendNotificationARRAY.map((item, key) => (
                    <FormItem key={key} label={item.label} className={`w-full rounded-[10px] ${item.classname || ''}`}>
                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                    </FormItem>
                ))}
                <FormItem label="Notification Type" className="col-span-1 w-full xl:w-1/2">
                    <Field name="notification_type">
                        {({ field, form }: FieldProps<any>) => {
                            return (
                                <Select
                                    field={field}
                                    form={form}
                                    options={notificationTypeArray}
                                    value={notificationTypeArray.find((option) => option.value === field.value)}
                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </div>

            <FormItem label="Scheduler Message" labelClass="!justify-start" className="w-full">
                <Field name="message">
                    {({ field, form }: FieldProps) => (
                        <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                    )}
                </Field>
            </FormItem>

            <FormContainer className="bg-gray-100 p-6 rounded-xl shadow-md space-y-4">
                <h3 className="text-lg font-medium text-center mb-4">Image Upload</h3>
                <FormItem className="w-full">
                    <Field name="image">
                        {({ form }: FieldProps) => (
                            <Upload
                                className="flex justify-center"
                                multiple
                                beforeUpload={beforeUpload}
                                fileList={values.image_url_array}
                                onChange={(files) => form.setFieldValue('image_url_array', files)}
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
