import React, { useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik' // Add FieldProps here
import * as Yup from 'yup'
import { useState } from 'react'
import { message, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
// import { NotificationTYPE } from './createNotification.common'
// import { NotificationARRAY } from './NotificationForms'
import { RichTextEditor } from '@/components/shared'
import { SendNotificationARRAY, sendNotificationType } from './sendNotify.common'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'

const SendNotification = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])
    const notificationTypeArray = [
        { value: 'SMS', label: 'sms' },
        { value: 'EMAIL', label: 'email' },
        { value: 'WHATSAPP', label: 'whatsapp' },
        { value: 'APP', label: 'app' },
    ]

    const targetPageArray = [
        { label: 'product', value: 'product/' },
        { label: 'productListing', value: 'productListing/' },
        { label: 'wishlist', value: 'wishlist' },
        { label: 'order', value: 'order/' },
        { label: 'cart', value: 'cart/' },
    ]

    const initialValue: sendNotificationType = {
        page: '',
        notification_type: '',
        title: '',
        message: '',
        target_page: '',
        key: '',
        users: '',
        page_title: '',
        filters: '',
    }

    const handleSubmit = async (values: any) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(values.message, 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''
        const formData = {
            ...values,
            message: plainTextMessage,
            filters: values.filters.join(','),
        }
        console.log('FORMDATA', formData)

        try {
            const response = await axioisInstance.post(`/notification/send`, formData)
            notification.success({
                message: 'SUCCESS',
                description: response.data.message || 'Notification has been added',
            })
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
                                {SendNotificationARRAY.map((item, key) => (
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
                                <FormItem label="Filters">
                                    <Field name="filters">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    isMulti
                                                    placeholder="Select Filter Tags"
                                                    options={filters.filters}
                                                    getOptionLabel={(option) => option.label}
                                                    getOptionValue={(option) => option.value}
                                                    onChange={(newVal) => {
                                                        const newValues = newVal ? newVal.map((val) => val.value) : []
                                                        form.setFieldValue(field.name, newValues)
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>

                                <FormItem label="Target Page">
                                    <Field name="target_page">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    placeholder="Select Target Page"
                                                    options={targetPageArray}
                                                    value={targetPageArray.find((option) => option.value === field.value)}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                        <FormItem label="Schedular Message" labelClass="!justify-start" className="col-span-1 w-full">
                            <Field name="message">
                                {({ field, form }: FieldProps) => (
                                    <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                )}
                            </Field>
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

export default SendNotification
