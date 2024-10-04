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
import { Upload } from '@/components/ui'

const SendNotification = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const MAX_UPLOAD = 100

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
            'image/JPEG',
            'image/JPG',
            'image/WEBP',
            'image/PNG',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]
        const MAX_FILE_SIZE = 5000000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a valid file format'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }

    const notificationTypeArray = [
        { value: 'SMS', label: 'sms' },
        { value: 'EMAIL', label: 'email' },
        { value: 'WHATSAPP', label: 'whatsapp' },
        { value: 'APP', label: 'app' },
    ]

    const targetPageArray = [
        { label: 'product', value: 'product' },
        { label: 'productListing', value: 'productListing' },
        { label: 'wishlist', value: 'wishlist' },
        { label: 'order', value: 'order' },
        { label: 'cart', value: 'cart' },
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
        image_url: '',
        image_url_array: [],
    }

    const handleimage = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url

            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)

            return 'Error'
        }
    }

    const handleSubmit = async (values: any) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(values.message, 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''
        const { image_url_array, ...formData } = values
        const imageUpload = await handleimage(values.image_url_array)

        const data = new FormData()

        data.append('message', plainTextMessage)
        data.append('image_url', imageUpload)
        data.append('page', formData.page)
        data.append('notification_type', formData.notification_type)
        data.append('title', formData.title)
        data.append('target_page', formData.target_page)
        data.append('key', formData.key)
        data.append('page_title', formData.page_title)
        data.append('filters', formData.filters)
        if (!formData.users || formData.users.length === 0) {
            notification.warning({
                message: 'WARNING',
                description: 'Users list is empty. Please add users to send the notification.',
            })
            return
        }

        data.append('users', formData.users)

        try {
            const response = await axioisInstance.post(`/notification/send`, data)
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
                        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-hidden ">
                            Image
                            <FormContainer className=" mt-5 w-full ">
                                {/* DIV */}

                                <FormItem label="" className="grid grid-rows-2">
                                    <Field name="image">
                                        {({ form }: FieldProps<any>) => (
                                            <>
                                                <Upload
                                                    className="flex justify-center"
                                                    multiple
                                                    beforeUpload={beforeUpload}
                                                    fileList={values.image_url_array}
                                                    onChange={(files) => form.setFieldValue('image_url_array', files)}
                                                    onFileRemove={(files) => form.setFieldValue('image_url_array', files)}
                                                />
                                            </>
                                        )}
                                    </Field>
                                </FormItem>

                                <br />
                                <br />
                            </FormContainer>
                            <FormItem label="" className="col-span-1 w-[80%]">
                                <Field type="text" name="image_url" placeholder="Enter ImageUrl or Upload Image file" component={Input} />
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
        </div>
    )
}

export default SendNotification
