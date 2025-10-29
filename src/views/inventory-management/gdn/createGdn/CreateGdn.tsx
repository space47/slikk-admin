/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { RichTextEditor } from '@/components/shared'
import { Button, Checkbox, DatePicker, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { companyStore } from '@/store/types/companyStore.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import axios from 'axios'
import { Field, FieldProps, Form, Formik } from 'formik'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateGdn = () => {
    const [datas, setDatas] = useState()
    const [imagview, setImageView] = useState<string>('')
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    const [companyData, setCompanyData] = useState<number>()

    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const navigate = useNavigate()

    const handleUpload = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'grn')
        try {
            const response = await axios.post('fileupload/dashboard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            const newData = response.data.url
            setDatas(newData)
            setShowData(true)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'File uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    const handleimage = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'grn')

        try {
            const response = await axioisInstance.post('fileupload/dashboard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            const newData = response.data.url
            setImageView(newData)

            setShowImage(true)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    const initialValue: any = {}

    const plainValue = (item: any) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(item, 'text/html')
        const plainTextValue = htmlDoc.body.textContent || ''
        return plainTextValue
    }

    const handleSubmit = async (values: any) => {
        setSpinner(true)
        let docsUpload = null
        if (values.files && values.files.length > 0) {
            docsUpload = await handleUpload(values.files)
        }

        let imageUpload = null
        if (values.image && values.image.length > 0) {
            imageUpload = await handleimage(values.image)
        }

        let docsShow = null
        if (docsUpload && values.document) {
            docsShow = [docsUpload, values.document].join(',')
        } else if (docsUpload) {
            docsShow = docsUpload
        } else if (values.document) {
            docsShow = values.document
        }

        let imageShow = null
        if (imageUpload && values.images) {
            imageShow = [imageUpload, values.images].join(',')
        } else if (imageUpload) {
            imageShow = imageUpload
        } else if (values.image) {
            imageShow = values.images
        }

        const plainOriginAddress = plainValue(values?.origin_address)
        const plainDeliveryAddress = plainValue(values?.delivery_address)
        const formData = {
            ...(values?.document_number && { document_number: values.document_number }),
            ...(companyData && { company: companyData }),
            ...(values?.dispatched_by && { dispatched_by: values.dispatched_by }),
            ...(values?.document_date && { document_date: moment(values.document_date).format('YYYY-MM-DD') }),
            ...(plainOriginAddress && { origin_address: plainOriginAddress }),
            ...(plainDeliveryAddress && { delivery_address: plainDeliveryAddress }),
            ...(values?.total_sku && { total_sku: values.total_sku }),
            ...(values?.total_quantity && { total_quantity: values.total_quantity }),
            ...(docsShow && { document: docsShow }),
            ...(imageShow && { images: imageShow }),
            ...(values?.store?.id && { store: values.store.id }),
        }

        try {
            const response = await axioisInstance.post('/goods/dispatch', formData)

            console.log(response)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'GRN created Successfully',
            })
            navigate('/app/goods/gdn')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'GRN not created ',
            })
        } finally {
            setSpinner(false)
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
                    <Form className="">
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem label="Document Number" className="col-span-1 w-1/2">
                                    <Field type="text" name="document_number" placeholder="Place your Document Number" component={Input} />
                                </FormItem>
                                <FormItem label="Date" className="col-span-1 w-1/2">
                                    <Field name="document_date" placeholder="Date">
                                        {({ field, form }: FieldProps<any>) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={values?.document_date}
                                                onChange={(date) => {
                                                    console.log(field.name)
                                                    form.setFieldValue(field.name, date)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            <div className="grid grid-cols-2 gap-3">
                                <FormItem label="Company">
                                    <Field name="companyList">
                                        {({ field }: FieldProps<any>) => {
                                            const fieldValue = Array.isArray(field.value) ? field.value : []

                                            return (
                                                <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                                    <Select
                                                        className="w-full"
                                                        options={companyList}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        defaultValue={companyList.filter((option) =>
                                                            fieldValue.some((item) => item === option.name),
                                                        )}
                                                        onChange={(newVal) => {
                                                            const selectedValues = newVal
                                                            setFieldValue('companyList', selectedValues)
                                                            setCompanyData(newVal?.id)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>

                                <FormItem label="Store ">
                                    <Field name="store">
                                        {({ form, field }: FieldProps<any>) => {
                                            const selectedCompany = storeResults.find((option) => option.code === field?.value?.code)

                                            return (
                                                <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                                    <Select
                                                        className="w-full"
                                                        options={storeResults}
                                                        getOptionLabel={(option) => option.code}
                                                        getOptionValue={(option) => option.code}
                                                        value={selectedCompany || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('store', newVal)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </div>
                            <br />
                            {/* Second line/////////////////////////////////////////////////////////// */}

                            <FormContainer>
                                <FormItem label="Supplier Address" labelClass="!justify-start" className="col-span-1 w-full">
                                    <Field name="origin_address">
                                        {({ field, form }: FieldProps) => (
                                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            <FormContainer>
                                <FormItem label="Delivery Address" labelClass="!justify-start" className="col-span-1 w-full">
                                    <Field name="delivery_address">
                                        {({ field, form }: FieldProps) => (
                                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            {/* fffffffffffffffffffffffffffffffffffffff */}

                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem label="Dispatched By" className="col-span-1 w-1/3">
                                    <Field type="text" name="dispatched_by" placeholder="Enter your Mobile Number" component={Input} />
                                </FormItem>
                                <FormItem label="Total SKUs" className="col-span-1 w-1/3">
                                    <Field type="number" name="total_sku" placeholder="Enter total Skus" component={Input} />
                                </FormItem>
                                <FormItem label="Total Quantity" className="col-span-1 w-1/3">
                                    <Field type="number" name="total_quantity" placeholder="Enter total items received" component={Input} />
                                </FormItem>
                            </FormContainer>

                            {/* ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo */}

                            <div className="font-bold mb-3">Upload Supporting Document</div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <FormContainer className=" mt-5 ">
                                    <FormItem
                                        label=""
                                        invalid={Boolean(errors.document && touched.document)}
                                        errorMessage={errors.document as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="document">
                                            {({ field, form }: FieldProps<any>) => (
                                                <>
                                                    <Upload
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.files}
                                                        onChange={(files) => {
                                                            form.setFieldValue('files', files)
                                                        }}
                                                        onFileRemove={(files) => form.setFieldValue('files', files)}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                    {showData && (
                                        <>
                                            <p>{datas}</p>
                                        </>
                                    )}
                                    <br />
                                </FormContainer>

                                <FormItem label="" className="col-span-1 w-[80%]">
                                    <Field
                                        type="text"
                                        name="document"
                                        placeholder="Enter Document Url or Upload docs file"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* ...............................IMAGES.......................................... */}
                            <div className="font-bold mb-3 mt-8">Upload Supporting Image</div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <FormContainer className=" mt-5 ">
                                    <FormItem
                                        label=""
                                        invalid={Boolean(errors.files && touched.files)}
                                        errorMessage={errors.files as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="images">
                                            {({ form }: FieldProps<any>) => (
                                                <>
                                                    <Upload
                                                        multiple
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.image}
                                                        onChange={(files) => form.setFieldValue('image', files)}
                                                        onFileRemove={(files) => form.setFieldValue('image', files)}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                    {showImage && (
                                        <>
                                            <p>{imagview}</p>
                                        </>
                                    )}
                                    <br />
                                    <br />
                                </FormContainer>

                                <FormItem label="" className="col-span-1 w-[80%]">
                                    <Field type="text" name="images" placeholder="Enter ImageUrl or Upload Image file" component={Input} />
                                </FormItem>
                            </FormContainer>

                            <FormButton isSpinning={spinner} value="Create" />
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CreateGdn
