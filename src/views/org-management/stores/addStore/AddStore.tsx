/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Upload from '@/components/ui/Upload'

import { Field, Form, Formik } from 'formik'
import Select from '@/components/ui/Select'
// import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useState } from 'react'
import { notification } from 'antd'

import { StoreTypes } from '../commonStores'

const MAX_UPLOAD = 8

const options = [
    { label: 'Mall', value: 'Mall' },
    {
        label: 'Independent Commercial Complex',
        value: 'Independent Commercial Complex',
    },
    { label: 'Standalone', value: 'Standalone' },
    { label: 'Warehouse', value: 'Warehouse' },
]

const AddStore = () => {
    const [imagview, setImageView] = useState<string[]>([])
    const [descriptiontextarea, setDescriptiontextarea] = useState()
    const [instructiontextarea, setInstructiontextarea] = useState()
    const [address, setAddress] = useState({
        area: '',
        pincode: '',
        state: '',
        city: '',
    })
    const [returnAddress, setReturnAddress] = useState({
        return_area: '',
        return_pincode: '',
        return_state: '',
        return_city: '',
    })
    const [isSameAddress, setIsSameAddress] = useState(false)

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/zip',
            'application/json',
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

    const handleDescriptionChange = (e: any) => {
        setDescriptiontextarea(e.target.value)
    }

    const handleInstructionChange = (e: any) => {
        setInstructiontextarea(e.target.value)
    }

    const handleCheckbox = () => {
        setIsSameAddress((prev) => !prev)
        if (!isSameAddress) {
            setReturnAddress({
                return_area: address.area,
                return_pincode: address.pincode,
                return_state: address.state,
                return_city: address.city,
            })
        } else {
            setReturnAddress({
                return_area: '',
                return_pincode: '',
                return_state: '',
                return_city: '',
            })
        }
    }

    const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleReturnAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setReturnAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const initialValue: StoreTypes = {
        company: null,
        code: '',
        name: '',
        description: '',
        area: '',
        city: '',
        state: '',
        pincode: null,
        latitude: null,
        longitude: null,
        contactNumber: '',
        poc: '',
        poc_designation: '',
        type: '',
        return_area: '',
        return_city: '',
        return_state: '',
        return_pincode: '',
        gstin: '',
        instruction: '',
        location_url: '',
        is_fulfillment_center: false,
        image: '',
        opening_hours: [],
        images_array: [],
    }

    const handleFileupload = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'category')

        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const newData = response.data.url
            setImageView(newData)
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

    const handleSubmit = async (values: StoreTypes) => {
        console.log('values of store', values)
        let uploadedImage = ''
        if (values?.images_array && values?.images_array?.length > 0) {
            uploadedImage = await handleFileupload(values?.images_array)
            setImageView([uploadedImage])
        }

        const formData = {
            ...values,
            area: address.area,
            city: address.city,
            pincode: address.pincode,
            state: address.state,
            return_area: returnAddress.return_area,
            return_city: returnAddress.return_city,
            return_pincode: returnAddress.return_pincode,
            return_state: returnAddress.return_state,
            description: descriptiontextarea,
            instruction: instructiontextarea,
            image: uploadedImage ?? '',
        }

        console.log('formDaata', formData)

        try {
            const response = await axioisInstance.post('merchant/store', formData)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Store created successfully',
            })
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Failed to create Store',
            })
        }
    }

    return (
        <div>
            <div className="text-xl mb-10 font-bold">Add New Store</div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-2/3" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    asterisk
                                    label="Company Id"
                                    invalid={errors.company && touched.company}
                                    errorMessage={errors.company}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="company"
                                        component={Input}
                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Code"
                                    invalid={errors.code && touched.code}
                                    errorMessage={errors.code}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="code"
                                        component={Input}
                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="name"
                                        component={Input}
                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                    />
                                </FormItem>
                            </FormContainer>
                            {/*  */}

                            {/* Instruction */}

                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    label="Instruction"
                                    invalid={errors.instruction && touched.description}
                                    errorMessage={errors.instruction}
                                    className="col-span-1 w-full"
                                >
                                    <textarea
                                        name="instruction"
                                        value={instructiontextarea}
                                        onChange={handleInstructionChange}
                                        id=""
                                        className="w-full border border-gray-200 rounded-lg items-center h-[200px] p-2"
                                    ></textarea>
                                </FormItem>
                            </FormContainer>

                            {/* Image upload.................................................................. */}

                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <div className=" image w-[10%] h-[20%] mt-5  ">
                                    {imagview && imagview.length > 0 ? (
                                        imagview.map((img, index) => <img key={index} src={img} alt="img" className="rounded-xl" />)
                                    ) : (
                                        <p>No image</p>
                                    )}
                                </div>
                                <FormContainer className="mt-5">
                                    <FormItem
                                        label="ADD NEW IMAGE"
                                        invalid={Boolean(errors.image && touched.image)}
                                        errorMessage={errors.image as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="images_array">
                                            {({ form }: FieldProps<StoreTypes>) => (
                                                <>
                                                    <Upload
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.images_array}
                                                        onChange={async (files) => {
                                                            form.setFieldValue('images_array', files)
                                                        }}
                                                        onFileRemove={(files) => form.setFieldValue('images_array', files)}
                                                        showList={false}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                    <br />
                                </FormContainer>
                            </FormContainer>

                            {/* Text area.................................................................. */}

                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    label="Description"
                                    invalid={errors.description && touched.description}
                                    errorMessage={errors.description}
                                    className="col-span-1 w-full"
                                >
                                    <textarea
                                        name="description"
                                        value={descriptiontextarea}
                                        onChange={handleDescriptionChange}
                                        id=""
                                        className="w-full border border-gray-200 rounded-lg items-center h-[200px] p-2"
                                    ></textarea>
                                </FormItem>
                            </FormContainer>

                            {/*............................................................ */}

                            <FormContainer className="grid grid-cols-3 ">
                                <FormItem
                                    asterisk
                                    label="Latitude"
                                    invalid={errors.latitude && touched.latitude}
                                    errorMessage={errors.latitude}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field type="text" name="latitude" component={Input} />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Longitude"
                                    invalid={errors.longitude && touched.longitude}
                                    errorMessage={errors.longitude}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field type="text" name="longitude" component={Input} />
                                </FormItem>

                                <FormItem label="Type" invalid={errors.type && touched.type}>
                                    <Field
                                        name="type"
                                        onKeyDown={(e: any) => {
                                            e.key === 'Enter' && e.preventDefault()
                                        }}
                                    >
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                field={field}
                                                className="text-black"
                                                form={form}
                                                options={options}
                                                value={options.find((option) => option.value === field.value)}
                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/*  */}

                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    asterisk
                                    label="Area"
                                    invalid={errors.area && touched.area}
                                    errorMessage={errors.area}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field type="text" name="area" value={address.area} onChange={handleAddress} component={Input} />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Pincode"
                                    invalid={errors.pincode && touched.pincode}
                                    errorMessage={errors.pincode}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field type="text" name="pincode" value={address.pincode} onChange={handleAddress} component={Input} />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="City"
                                    invalid={errors.city && touched.city}
                                    errorMessage={errors.city}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field type="text" name="city" value={address.city} onChange={handleAddress} component={Input} />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="State"
                                    invalid={errors.state && touched.state}
                                    errorMessage={errors.state}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field name="state" type="text" value={address.state} onChange={handleAddress} component={Input} />
                                </FormItem>
                            </FormContainer>

                            {/* Return.................................................... */}
                            <div className="mt-6">RETURN ORDERS</div>

                            <FormItem
                                asterisk
                                label="Return Area"
                                invalid={errors.return_area && touched.return_area}
                                errorMessage={errors.return_area}
                                className="col-span-1 w-1/2"
                            >
                                <Field name="return_area" component={Checkbox} onClick={handleCheckbox}>
                                    {' '}
                                    Check to add same address as above{' '}
                                </Field>
                            </FormItem>
                            {/* FIELDS */}
                            <FormContainer className="flex flex-row gap-7  ">
                                <FormItem
                                    asterisk
                                    label="Return Area"
                                    invalid={errors.return_area && touched.return_area}
                                    errorMessage={errors.return_area}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="return_area"
                                        value={returnAddress.return_area}
                                        onChange={handleReturnAddress}
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Return Pincode"
                                    invalid={errors.return_pincode && touched.return_pincode}
                                    errorMessage={errors.return_pincode}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="return_pincode"
                                        value={returnAddress.return_pincode}
                                        onChange={handleReturnAddress}
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Return City"
                                    invalid={errors.return_city && touched.return_city}
                                    errorMessage={errors.return_city}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="return_city"
                                        value={returnAddress.return_city}
                                        onChange={handleReturnAddress}
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Return State"
                                    invalid={errors.return_state && touched.return_state}
                                    errorMessage={errors.return_state}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        name="return_state"
                                        type="text"
                                        value={returnAddress.return_state}
                                        onChange={handleReturnAddress}
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* Select boxes......................................................................... */}

                            <FormContainer className="flex flex-row gap-7">
                                <FormItem label="Number" invalid={errors.contactNumber && touched.contactNumber}>
                                    <Field name="contactNumber" type="text" component={Input} />
                                </FormItem>

                                <FormItem label="POC" invalid={errors.poc && touched.poc}>
                                    <Field name="poc" component={Input} />
                                </FormItem>
                                <FormItem label="POC Designation" invalid={errors.poc_designation && touched.poc_designation}>
                                    <Field name="poc_designation" component={Input} />
                                </FormItem>
                                <FormItem label="GSTIN" invalid={errors.gstin && touched.gstin}>
                                    <Field name="gstin" component={Input} />
                                </FormItem>
                            </FormContainer>

                            {/* ............................. */}

                            <FormItem label="FulFillment Center" invalid={errors.is_fulfillment_center && touched.is_fulfillment_center}>
                                <Field name="is_fulfillment_center" component={Checkbox}>
                                    Require fulfillment center
                                </Field>
                            </FormItem>

                            {/* Handle Submit........................... */}

                            <FormItem>
                                <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit">
                                    Submit
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddStore
