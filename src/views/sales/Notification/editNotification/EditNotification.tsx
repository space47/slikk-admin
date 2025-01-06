import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps, FieldArray } from 'formik' // Add FieldProps here
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { message, notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { NotificationTYPE } from '../createNotification/createNotification.common'
import { NotificationARRAY } from '../createNotification/NotificationForms'
import { RichTextEditor } from '@/components/shared'

const EditNotification = () => {
    const [notificationData, setNotificationData] = useState<any>()
    const { id } = useParams()

    const notificationTypeArray = [
        { value: 'SMS', label: 'SMS' },
        { value: 'EMAIL', label: 'EMAIL' },
        { value: 'WHATSAPP', label: 'WHATSAPP' },
        { value: 'APP', label: 'APP' },
    ]

    const fetchNotificationEditData = async () => {
        try {
            const response = await axioisInstance.get(`/notifications/config?id=${id}`)
            const data = response?.data
            setNotificationData(data?.message)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchNotificationEditData()
    }, [id])

    // Initial value includes fetched `config_data` or default values if not present
    const initialValue: NotificationTYPE = {
        event_name: notificationData?.event_name || '',
        notification_type: notificationData?.notification_type || '',
        title: notificationData?.title || '',
        message: notificationData?.message || '',
        template_id: notificationData?.template_id || '',
        is_active: notificationData?.is_active || false,
        config_data: {
            body_config: notificationData?.config_data?.body_config || [{ text: '', type: 'text' }],
            header_config: notificationData?.config_data?.header_config || [],
            button_config: notificationData?.config_data?.button_config || [{ url: '', sub_type: 'url', index: 0 }],
        },
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
            const response = await axioisInstance.post(`/notifications/config`, formData)
            notification.success({
                message: 'SUCCESS',
                description: response.data.message || 'Notification has been updated successfully',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'FAILURE',
                description: 'Failed to update notification',
            })
        }
    }

    return (
        <div>
            {notificationData ? (
                <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                    {({ values, setFieldValue, resetForm }) => (
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
                                            {({ field, form }: FieldProps<any>) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={notificationTypeArray}
                                                    value={notificationTypeArray.find((option) => option.value === field.value)}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </FormContainer>
                                {values?.notification_type === 'WHATSAPP' && (
                                    <>
                                        {/* Body Config */}
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

                                        {/* Button Config */}
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
                            </FormContainer>
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
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default EditNotification
