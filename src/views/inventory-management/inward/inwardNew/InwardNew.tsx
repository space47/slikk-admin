import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
// import TimeInput from '@/components/ui/TimeInput'
import Checkbox from '@/components/ui/Checkbox'
// import Radio from '@/components/ui/Radio'
// import Switcher from '@/components/ui/Switcher'
// import Segment from '@/components/ui/Segment'
import Upload from '@/components/ui/Upload'
// import SegmentItemOption from '@/components/shared/SegmentItemOption'
// import { HiCheckCircle } from 'react-icons/hi'
import { Field, Form, Formik } from 'formik'
// import CreatableSelect from 'react-select/creatable'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import Textarea from '@/views/ui-components/forms/Input/Textarea'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useState } from 'react'
import axios from 'axios'

type FormModel = {
    select: string
    date: Date | null
    time: Date | null
    singleCheckbox: boolean
    files: File[]
    file_type: string
    document_number: string
    company: number
    received_by: string
    document_date: string
    origin_address: string
    received_address: string
    slikk_owned: boolean
    total_sku: number
    total_quantity: number
    document: string
    images: string
}

const MIN_UPLOAD = 1
const MAX_UPLOAD = 8

const initialValue: FormModel = {
    select: '',
    date: null,
    time: null,
    singleCheckbox: false,
    files: [],
    file_type: '',
    document_number: '',
    company: 1,
    received_by: '',
    document_date: '',
    origin_address: '',
    received_address: '',
    slikk_owned: false,
    total_sku: 0,
    total_quantity: 0,
    document: '',
    images: '',
}

const validationSchema = Yup.object().shape({
    input: Yup.string()
        .min(3, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Please input user name!'),
    select: Yup.string().required('Please select one!'),
    multipleSelect: Yup.array().min(1, 'At least one is selected!'),
    date: Yup.date().required('Date Required!').nullable(),
    time: Yup.date().required('Time Required!').nullable(),
    singleCheckbox: Yup.boolean().oneOf([true], 'You must tick this!'),
    multipleCheckbox: Yup.array().min(1, 'Select at least one option!'),
    radio: Yup.string().required('Please select one!'),
    switcher: Yup.boolean().oneOf([true], 'You must turn this on!'),
    upload: Yup.array().min(MIN_UPLOAD, 'At least one file uploaded!'),
    segment: Yup.array().min(1, 'Select at least one option!'),
    fileType: Yup.string().required('Please input file type!'),
})

const MixedFormControl = () => {
    const [datas, setDatas] = useState()
    const [imagview, setImageView] = useState()
    // const [showImage, setShowImage] =

    console.log(datas)
    console.log(imagview)
    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
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

    const handleUpload = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('files', file)
        })
        formData.append('file_type', 'grn')
        try {
            console.log(formData.get('files'))
            const response = await axios.post(
                'fileupload/dashboard',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            console.log(response)
            const newData = response.data.url
            setDatas(newData)
            alert('Files uploaded successfully')
        } catch (error) {
            console.error('Error uploading files:', error)
            alert('Failed to upload files')
        }
    }

    const handleimage = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'grn')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post(
                'fileupload/dashboard',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            console.log(response)
            const newData = response.data.url
            setImageView(newData)
            alert('Image uploaded successfully')
        } catch (error) {
            console.error('Error uploading files:', error)
            alert('Failed to upload Image')
        }
    }

    const handleSubmit = async (values: FormModel) => {
        try {
            const response = await axioisInstance.post('goods/received', values)

            console.log(response)
            alert('Form submitted successfully')
        } catch (error) {
            console.error('Error submitting form:', error)
            alert('Failed to submit form')
        }
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                validationSchema={validationSchema}
                // ONSUBMIT LOGICCCCCCC....................................................................................................
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Document Number"
                                    invalid={
                                        errors.document_number &&
                                        touched.document_number
                                    }
                                    errorMessage={errors.document_number}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="document_number"
                                        placeholder="Place your Document Number"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Date"
                                    invalid={errors.date && touched.date}
                                    errorMessage={errors.date}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field name="date" placeholder="Date">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={values.date}
                                                onChange={(date) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        date,
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            {/* Second line/////////////////////////////////////////////////////////// */}

                            <FormItem
                                asterisk
                                label="Supplier Address"
                                invalid={
                                    errors.origin_address &&
                                    touched.origin_address
                                }
                                errorMessage={errors.origin_address}
                                className="col-span-1 w-full"
                            >
                                <Field
                                    type="text"
                                    name="origin_address"
                                    placeholder="Supplier Address"
                                    component={Textarea}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Receiver Address"
                                invalid={
                                    errors.received_address &&
                                    touched.received_address
                                }
                                errorMessage={errors.received_address}
                                className="col-span-1 w-full"
                            >
                                <Field
                                    type="text"
                                    name="received_address"
                                    placeholder="Receiver Address"
                                    component={Textarea}
                                />
                            </FormItem>

                            {/* fffffffffffffffffffffffffffffffffffffff */}

                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Received By"
                                    invalid={
                                        errors.received_by &&
                                        touched.received_by
                                    }
                                    errorMessage={errors.received_by}
                                    className="col-span-1 w-1/3"
                                >
                                    <Field
                                        type="text"
                                        name="received_by"
                                        placeholder="Enter your Mobile Number"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Total SKUs"
                                    invalid={
                                        errors.total_sku && touched.total_sku
                                    }
                                    errorMessage={errors.total_sku}
                                    className="col-span-1 w-1/3"
                                >
                                    <Field
                                        type="number"
                                        name="total_sku"
                                        placeholder="Enter total Skus"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Total Quantity"
                                    invalid={
                                        errors.total_quantity &&
                                        touched.total_quantity
                                    }
                                    errorMessage={errors.total_quantity}
                                    className="col-span-1 w-1/3"
                                >
                                    <Field
                                        type="number"
                                        name="total_quantity"
                                        placeholder="Enter total items received"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo */}

                            <div className="font-bold mb-3">
                                Upload Supporting Document
                            </div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <FormContainer className=" mt-5 ">
                                    <FormItem
                                        label=""
                                        invalid={Boolean(
                                            errors.files && touched.files,
                                        )}
                                        errorMessage={errors.files as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="document">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<FormModel>) => (
                                                <>
                                                    <Upload
                                                        beforeUpload={
                                                            beforeUpload
                                                        }
                                                        fileList={values.files} // uploadedd the file
                                                        onChange={(files) =>
                                                            form.setFileValue(
                                                                field.name,
                                                                files,
                                                            )
                                                        }
                                                        onFileRemove={(files) =>
                                                            form.setFileValue(
                                                                field.name,
                                                                files,
                                                            )
                                                        }
                                                        // uploadButtonText="Add Files"
                                                    />
                                                    <Button
                                                        type="button"
                                                        className="mt-2"
                                                        onClick={() =>
                                                            handleUpload(
                                                                values.files,
                                                            )
                                                        }

                                                        // disabled={
                                                        //     values.upload.length === 0
                                                        // }
                                                    >
                                                        Upload Docs
                                                    </Button>
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                <FormItem
                                    label=""
                                    invalid={
                                        errors.document && touched.document
                                    }
                                    errorMessage={errors.document}
                                    className="col-span-1 w-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="document"
                                        placeholder="Enter Document Url or Upload docs file"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* <div className="border border-gray-500 w-[85%] items-center justify-center flex py-2 mb-4">
                                {datas}
                            </div> */}

                            {/* ...............................IMAGES.......................................... */}
                            <div className="font-bold mb-3 mt-8">
                                Upload Supporting Image
                            </div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <FormContainer className=" mt-5 ">
                                    <FormItem
                                        label=""
                                        invalid={Boolean(
                                            errors.files && touched.files,
                                        )}
                                        errorMessage={errors.files as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="images">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<FormModel>) => (
                                                <>
                                                    <Upload
                                                        beforeUpload={
                                                            beforeUpload
                                                        }
                                                        fileList={values.files}
                                                        onChange={(files) =>
                                                            form.setImageValue(
                                                                field.name,
                                                                files,
                                                            )
                                                        }
                                                        onFileRemove={(files) =>
                                                            form.setImageValue(
                                                                field.name,
                                                                files,
                                                            )
                                                        }
                                                        // uploadButtonText="Add Files"
                                                    />
                                                    <Button
                                                        className="mt-2"
                                                        type="button"
                                                        onClick={() =>
                                                            handleimage(
                                                                values.files,
                                                            )
                                                        }

                                                        // disabled={
                                                        //     values.upload.length === 0
                                                        // }
                                                    >
                                                        Upload Image
                                                    </Button>
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                <FormItem
                                    label=""
                                    invalid={errors.images && touched.images}
                                    errorMessage={errors.images}
                                    className="col-span-1 w-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="images"
                                        placeholder="Enter ImageUrl or Upload Image file"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* {imagview && (
                                <div className="border border-gray-500 w-[85%] items-center justify-center flex py-2 mb-4">
                                    {imagview}
                                </div>
                            )} */}

                            {/* ----------------------------------------------------------------------------------------- */}

                            <FormItem
                                label="SLIKK OWNED"
                                invalid={
                                    errors.singleCheckbox &&
                                    touched.singleCheckbox
                                }
                                // errorMessage={errors.singleCheckbox}
                            >
                                <Field
                                    name="singleCheckbox"
                                    component={Checkbox}
                                >
                                    Items purchased by SLIKK
                                </Field>
                            </FormItem>

                            <FormItem>
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    // onClick={() => handleSubmit()}
                                >
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

export default MixedFormControl
