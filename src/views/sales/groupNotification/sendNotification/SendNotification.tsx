/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps, useFormikContext } from 'formik' // Add FieldProps here
import * as Yup from 'yup'
import { useState } from 'react'
import { message, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
// import { NotificationTYPE } from './createNotification.common'
// import { NotificationARRAY } from './NotificationForms'
import { RichTextEditor } from '@/components/shared'
import { MAXMINARRAY, OFFARRAY, SendNotificationARRAY, sendNotificationType, UtmArray } from './sendNotify.common'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { Dialog, Upload } from '@/components/ui'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'

const SendNotification = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])
    const [filterId, setFilterId] = useState()
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
        { value: 'sms', label: 'sms' },
        { value: 'email', label: 'email' },
        { value: 'whatsapp', label: 'whatsapp' },
        { value: 'app', label: 'app' },
    ]

    const targetPageArray = [
        { label: 'product', value: 'product' },
        { label: 'productListing', value: 'productListing' },
        { label: 'wishlist', value: 'wishlist' },
        { label: 'order', value: 'order' },
        { label: 'cart', value: 'cart' },
    ]

    const DISCOUNTOPTIONS = [
        { value: 'sort_lowtohigh', label: 'Low to High' },
        { value: 'sort_hightolow', label: 'High to Low' },
        { value: 'sort_discount', label: 'DISCOUNT' },
    ]

    const initialValue: sendNotificationType = {
        page: '',
        notification_type: '',
        title: '',
        message: '',
        target_page: '',
        key: '',
        users: '9818454888,8310903174',
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
        console.log('start')
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(values.message, 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''
        const { image_url_array, utm_medium, utm_source, utm_campaign, minprice, maxprice, minoff, maxoff, utm_tags, ...formData } = values
        console.log(utm_medium, utm_source, utm_campaign, utm_tags, maxoff, maxprice, minoff, minprice)
        const imageUpload = values.image_url_array.length > 0 ? await handleimage(image_url_array) : values.image_url

        const data = {
            ...formData,
            image_url: imageUpload,
            filters: [
                ...(values.filters || []),
                ...UtmArray.filter((item) => values[item.name] !== undefined).map(
                    (item) => `${item.name.replace('_', '-')}_${values[item.name]}`,
                ),
                ...MAXMINARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
                ...OFFARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
                ...(values.discountTags || []),
                `filterId_${filterId}`,
            ]
                .filter((filter) => filter)
                .join(','),
            message: plainTextMessage,
        }

        if (values.users_all) {
            data.users = ''
        } else {
            data.users = values.users.replace(/\s+/g, '')
        }

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

    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
    }
    const [filtersData, setFiltersData] = useState([])

    const handleAddFilters = async (values) => {
        console.log('Values', values)
        const newFilterData = showAddFilter.map((_, index) => {
            return values.filtersAdd[index] || []
        })

        setFiltersData((prev) => {
            const updatedFilters = [...prev, newFilterData]

            const lastElement = updatedFilters.at(-1)

            sendFilterData(lastElement)

            return updatedFilters
        })
    }

    const sendFilterData = async (filterData) => {
        try {
            const body = {
                filter_data: filterData,
            }

            const response = await axioisInstance.post(`/product/search/criteria`, body)
            console.log('MAIN response', response.data.data)
            const id = response.data?.data?.id

            setFilterId(id)
        } catch (error) {
            console.log(error)
        }
    }
    console.log('Final Filters Data:', filtersData.at(-1))
    console.log('data of filter id', filterId)

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, resetForm }) => (
                    <Form className="w-full lg:w-2/3 mx-auto xl:mx-0">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                {SendNotificationARRAY.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
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
                                <FormItem label="SEARCH STRINGS">
                                    <FormContainer className="items-center mt-4">
                                        <button onClick={handleAddFilter} type="button">
                                            <IoMdAddCircle className="text-3xl text-green-500" />
                                        </button>
                                    </FormContainer>

                                    {showAddFilter.map((_, index) => (
                                        <FormItem key={index} className="flex  gap-2">
                                            <div className="flex gap-3 items-center">
                                                <Field name={`filtersAdd[${index}]`} key={index}>
                                                    {({ field, form }: FieldProps<any>) => (
                                                        <Select
                                                            isMulti
                                                            placeholder={`Filter Tags ${index + 1}`}
                                                            options={filters.filters}
                                                            getOptionLabel={(option) => option.label}
                                                            getOptionValue={(option) => option.value}
                                                            onChange={(newVal) => {
                                                                const newValues = newVal ? newVal.map((val) => val.value) : []
                                                                form.setFieldValue(field.name, newValues)
                                                            }}
                                                            className="w-3/4"
                                                        />
                                                    )}
                                                </Field>
                                                <div className="">
                                                    <button type="button" className="" onClick={() => handleRemoveFilter(index)}>
                                                        <MdCancel className="text-xl text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </FormItem>
                                    ))}

                                    {showAddFilter.length > 0 && (
                                        <>
                                            <Field>
                                                {({ form }: FieldProps<any>) => (
                                                    <Button variant="new" onClick={() => handleAddFilters(form.values)} type="button">
                                                        Search Strings
                                                    </Button>
                                                )}
                                            </Field>
                                        </>
                                    )}
                                </FormItem>

                                <FormContainer className="flex gap-3 flex-col xl:flex-row">
                                    {MAXMINARRAY.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full xl:w-2/3">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                                <FormContainer className="flex gap-3 flex-col xl:flex-row">
                                    {OFFARRAY.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full xl:w-2/3">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>

                                <div className="flex flex-col">
                                    <div>Sort By</div>
                                    <Field name="discountTags">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    isMulti
                                                    placeholder="Discount Tags"
                                                    options={DISCOUNTOPTIONS}
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
                                </div>

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
                                {UtmArray.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
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

                        <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
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
