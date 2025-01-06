import React from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps, FieldArray } from 'formik' // Add FieldProps here
import * as Yup from 'yup'
import { useState } from 'react'
import { message, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { NotificationTYPE } from './createNotification.common'
import { NotificationARRAY } from './NotificationForms'
import { RichTextEditor } from '@/components/shared'

const AddNotification = () => {
    const notificationTypeArray = [
        { value: 'SMS', label: 'SMS' },
        { value: 'EMAIL', label: 'EMAIL' },
        { value: 'WHATSAPP', label: 'WHATSAPP' },
        { value: 'APP', label: 'APP' },
    ]

    const initialValue: NotificationTYPE = {
        event_name: '',
        notification_type: '',
        title: '',
        message: '',
        template_id: '',
        is_active: false,
    }

    const handleSubmit = async (values: NotificationTYPE) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(values.message, 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''
        const formData = {
            ...values,
            message: plainTextMessage,
        }
        console.log('FORMDATA', formData)

        try {
            // const response = await axioisInstance.post(`/notifications/config`, formData)
            // notification.success({
            //     message: 'SUCCESS',
            //     description: response.data.message || 'Notification has been added',
            // })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'FAILURE',
                description: 'Failed to create notification',
            })
        }
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {NotificationARRAY.slice(0, 3).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                <FormItem label="Notification Type" className="col-span-1 w-1/2">
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
                            </FormContainer>
                            {values?.notification_type === 'WHATSAPP' && (
                                <>
                                    <FormItem label="Body Config" className="w-full">
                                        <FieldArray
                                            name="config_data.body_config"
                                            render={(arrayHelpers) => (
                                                <div>
                                                    {values?.config_data?.body_config?.map((config, index) => (
                                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                                            <Field
                                                                name={`config_data.body_config[${index}].text`}
                                                                placeholder="Enter text (e.g., {name})"
                                                                className="flex-1"
                                                                component={Input}
                                                            />
                                                            <Field
                                                                name={`config_data.body_config[${index}].type`}
                                                                as="select"
                                                                className="flex-1 border rounded px-2 py-1"
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="image">Image</option>
                                                                <option value="video">Video</option>
                                                            </Field>
                                                            <Button
                                                                type="button"
                                                                variant="reject"
                                                                onClick={() => arrayHelpers.remove(index)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="accept"
                                                        onClick={() => arrayHelpers.push({ text: '', type: 'text' })}
                                                    >
                                                        Add Body Config
                                                    </Button>
                                                </div>
                                            )}
                                        />
                                    </FormItem>

                                    {/* header config */}

                                    <FormItem label="Header Config" className="w-full">
                                        <FieldArray
                                            name="config_data.header_config"
                                            render={(arrayHelpers) => (
                                                <div>
                                                    {values?.config_data?.header_config?.map((config, index) => (
                                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                                            <Field
                                                                name={`config_data.header_config[${index}].text`}
                                                                placeholder="Enter text (e.g., {name})"
                                                                className="flex-1"
                                                                component={Input}
                                                            />
                                                            <Field
                                                                name={`config_data.header_config[${index}].type`}
                                                                as="select"
                                                                className="flex-1 border rounded px-2 py-1"
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="image">Image</option>
                                                                <option value="video">Video</option>
                                                            </Field>
                                                            <Button
                                                                type="button"
                                                                variant="reject"
                                                                onClick={() => arrayHelpers.remove(index)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="accept"
                                                        onClick={() => arrayHelpers.push({ text: '', type: 'text' })}
                                                    >
                                                        Add Body Config
                                                    </Button>
                                                </div>
                                            )}
                                        />
                                    </FormItem>

                                    <FormItem label="Button Config" className="w-full mt-5">
                                        <FieldArray
                                            name="config_data.button_config"
                                            render={(arrayHelpers) => (
                                                <div>
                                                    {values?.config_data?.button_config?.map((config, index) => (
                                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                                            <Field
                                                                name={`config_data.button_config[${index}].url`}
                                                                placeholder="Enter URL (e.g., {order_id})"
                                                                className="flex-1"
                                                                component={Input}
                                                            />
                                                            <Field
                                                                name={`config_data.button_config[${index}].sub_type`}
                                                                as="select"
                                                                className="flex-1 border rounded px-2 py-1"
                                                            >
                                                                <option value="url">URL</option>
                                                                <option value="call">Phone</option>
                                                            </Field>
                                                            <Field
                                                                name={`config_data.button_config[${index}].index`}
                                                                type="number"
                                                                placeholder="Enter Index"
                                                                className="flex-1"
                                                                component={Input}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="reject"
                                                                onClick={() => arrayHelpers.remove(index)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="accept"
                                                        onClick={() =>
                                                            arrayHelpers.push({
                                                                url: '',
                                                                index: values?.config_data?.button_config?.length || 0,
                                                                sub_type: 'url',
                                                            })
                                                        }
                                                    >
                                                        Add Button Config
                                                    </Button>
                                                </div>
                                            )}
                                        />
                                    </FormItem>
                                </>
                            )}
                        </FormContainer>
                        <FormItem label="Schedular Message" labelClass="!justify-start" className="col-span-1 w-full">
                            <Field name="message">
                                {({ field, form }: FieldProps) => (
                                    <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem>
                            {NotificationARRAY.slice(3).map((item, key) => (
                                <FormItem key={key} label={item.label} className={item.classname}>
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}
                        </FormItem>

                        <FormContainer className="flex justify-end mt-5">
                            <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                Reset
                            </Button>

                            <Button variant="solid" type="submit" className=" text-white">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddNotification
