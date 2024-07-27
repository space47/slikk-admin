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
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

type FormModel = {
    registered_name: string
    name: string
    gstin: string
    segment: string
    cin: string
    address: string
    contact_number: string
    alternate_contact_number: string
    poc: string
    poc_email: string
    account_number: string
    ifsc: string
    confirm: string
    account_holder_name: string
    bank_name: string
}

const MIN_UPLOAD = 1
const MAX_UPLOAD = 8

const initialValue: FormModel = {
    registered_name: '',
    name: '',
    gstin: '',
    segment: '',
    cin: '',
    address: '',
    contact_number: '',
    alternate_contact_number: '',
    poc: '',
    poc_email: '',
    account_number: '',
    ifsc: '',
    confirm: '',
    account_holder_name: '',
    bank_name: '',
}

// Validation

// const validationSchema = Yup.object().shape({
//     document_number: Yup.string()
//         .min(3, 'Too Short!')
//         .required('Please Enter the details!'),
//     // select: Yup.string().required('Please select one!'),
//     // multipleSelect: Yup.array().min(1, 'At least one is selected!'),

//     document_date: Yup.date().required('Date Required!'),
//     origin_address: Yup.string().required('Supplier Address Required'),
//     received_address: Yup.string().required('Receiver Address Required'),
//     // time: Yup.date().required('Time Required!').nullable(),
//     slikk_owned: Yup.boolean().oneOf([true], 'You must tick this!'),
//     total_sku: Yup.string().required('SKU Required'),
//     total_quantity: Yup.string().required('Quantity Required'),
//     received_by: Yup.string().required('Phone Number Required'),

//     // radio: Yup.string().required('Please select one!'),
//     // switcher: Yup.boolean().oneOf([true], 'You must turn this on!'),
//     upload: Yup.array().min(MIN_UPLOAD, 'At least one file uploaded!'),
//     // segment: Yup.array().min(1, 'Select at least one option!'),
//     fileType: Yup.string().required('Please input file type!'),
// })

const AddSeller = () => {
    const navigate = useNavigate()

    const handleSubmit = async (values: FormModel) => {
        console.log('handleSubmit')

        if (values.account_number !== values.confirm) {
            notification.error({
                message: 'Failure',
                description: 'Account number does not match',
            })
            return
        }

        const formData = {
            ...values,
        }

        console.log('formDaata', formData)

        try {
            const response = await axioisInstance.post(
                'merchant/company',
                formData,
            )

            console.log(response)
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Seller created Successfully',
            })
            navigate('/app/sellers')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'Seller not created ',
            })
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Seller Details</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                // ONSUBMIT LOGICCCCCCC....................................................................................................
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Registered Name"
                                    invalid={
                                        errors.registered_name &&
                                        touched.registered_name
                                    }
                                    errorMessage={errors.registered_name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="registered_name"
                                        placeholder="Place your Registered Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Brand Name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Place Brand Name"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* Second line////////////////////////////////////////////////////////////////////////////// */}

                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="GSTIN"
                                    invalid={errors.gstin && touched.gstin}
                                    errorMessage={errors.gstin}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="gstin"
                                        placeholder="Enter GST number "
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="SEGMENT"
                                    invalid={errors.segment && touched.segment}
                                    errorMessage={errors.segment}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="segment"
                                        placeholder="Place Seller Name"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* #rd Line.................................................................................................... */}

                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="CIN"
                                    invalid={errors.cin && touched.cin}
                                    errorMessage={errors.cin}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="cin"
                                        placeholder="Enter CIN  "
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Address"
                                    invalid={errors.address && touched.address}
                                    errorMessage={errors.address}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="address"
                                        placeholder="Enter Complete Address "
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo */}

                            <h5 className="mb-5 from-neutral-900">
                                POC Details
                            </h5>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="POC Name"
                                    invalid={errors.poc && touched.poc}
                                    errorMessage={errors.poc}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="poc"
                                        placeholder="Enter POC Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="POC EMAIL"
                                    invalid={
                                        errors.poc_email && touched.poc_email
                                    }
                                    errorMessage={errors.poc_email}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="poc_email"
                                        placeholder="Enter POC EMAIL"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Mobile Number"
                                    invalid={
                                        errors.contact_number &&
                                        touched.contact_number
                                    }
                                    errorMessage={errors.contact_number}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="contact_number"
                                        placeholder="Enter your Contact Number"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Alternate Contact Number"
                                    invalid={
                                        errors.alternate_contact_number &&
                                        touched.alternate_contact_number
                                    }
                                    errorMessage={
                                        errors.alternate_contact_number
                                    }
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="alternate_contact_number"
                                        placeholder="Enter alternate contact Number"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* <div className="border border-gray-500 w-[85%] items-center justify-center flex py-2 mb-4">
                                {datas}
                            </div> */}

                            {/* ...............................IMAGES.......................................... */}
                            <h5 className="mb-5 from-neutral-900">
                                Account Details
                            </h5>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="ACCOUNT NUMBER"
                                    invalid={
                                        errors.account_number &&
                                        touched.account_number
                                    }
                                    errorMessage={errors.account_number}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="account_number"
                                        placeholder="Place your Account Number"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Confirm ACCOUNT NUMBER"
                                    invalid={errors.confirm && touched.confirm}
                                    errorMessage={errors.confirm}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="confirm"
                                        placeholder="Place your Account Number"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="IFSC Code"
                                    invalid={errors.ifsc && touched.ifsc}
                                    errorMessage={errors.ifsc}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="ifsc"
                                        placeholder="Place IFSC number"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Bank Name"
                                    invalid={
                                        errors.bank_name && touched.bank_name
                                    }
                                    errorMessage={errors.bank_name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="bank_name"
                                        placeholder="Enter Bank Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Account Holder"
                                    invalid={
                                        errors.account_holder_name &&
                                        touched.account_holder_name
                                    }
                                    errorMessage={errors.account_holder_name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="account_holder_name"
                                        placeholder="Enter Account Holder Name"
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

                            {/* <FormItem
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
                            </FormItem> */}

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

export default AddSeller
