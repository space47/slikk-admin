import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik' // Add FieldProps here
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

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

// const validationSchema = Yup.object().shape({
//     registered_name: Yup.string().required('Registered Name is required'),
//     name: Yup.string().required('Brand Name is required'),
//     gstin: Yup.string().required('GSTIN is required'),
//     segment: Yup.string().required('Segment is required'),
//     cin: Yup.string().required('CIN is required'),
//     address: Yup.string().required('Address is required'),
//     contact_number: Yup.string()
//         .required('Mobile Number is required')
//         .matches(/^[6-9]\d{9}$/, 'Mobile Number is not valid'),
//     alternate_contact_number: Yup.string()
//         .required('Alternate Mobile Number is required')
//         .matches(/^[6-9]\d{9}$/, 'Alternate Mobile Number is not valid'),
//     poc: Yup.string().required('POC Name is required'),
//     poc_email: Yup.string()
//         .required('POC Email is required')
//         .email('Email is not valid'),
//     account_number: Yup.string().required('Account Number is required'),
//     confirm: Yup.string()
//         .required('Confirm Account Number is required')
//         .oneOf([Yup.ref('account_number')], 'Account number does not match'),
//     account_holder_name: Yup.string().required(
//         'Account Holder Name is required',
//     ),
//     bank_name: Yup.string().required('Bank Name is required'),
// })

const SegmentOptions = () => {
    return ['Fashion', 'Footwear', 'Beauty & Personal Care', 'Home Decor'].map(
        (segment) => ({
            label: segment,
            value: segment,
        }),
    )
}

const EditSeller = () => {
    const [sellerData, setSellerData] = useState<FormModel>()
    const navigate = useNavigate()

    const { gstin } = useParams()

    const fetchsellerData = async () => {
        try {
            const response = await axioisInstance.get(
                `merchant/company?gstin=${gstin}`,
            )
            const data = response.data.data
            console.log('ssdssdsd', data)
            setSellerData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchsellerData()
    }, [])

    const initialValue: FormModel = {
        registered_name: sellerData?.registered_name || '',
        name: sellerData?.name || '',
        gstin: sellerData?.gstin || '',
        segment: sellerData?.segment || '',
        cin: sellerData?.cin || '',
        address: sellerData?.address || '',
        contact_number: sellerData?.contact_number || '',
        alternate_contact_number: sellerData?.alternate_contact_number || '',
        poc: sellerData?.poc || '',
        poc_email: sellerData?.poc_email || '',
        account_number: sellerData?.account_number || '',
        ifsc: sellerData?.ifsc || '',
        confirm: sellerData?.confirm || '',
        account_holder_name: sellerData?.account_holder_name || '',
        bank_name: sellerData?.bank_name || '',
    }

    const handleSubmit = async (values: FormModel) => {
        console.log('handleSubmit')

        if (values.account_number !== values.confirm) {
            notification.error({
                message: 'Failure',
                description: 'Account number does not match',
            })
            return
        }
        if (values.contact_number === values.alternate_contact_number) {
            notification.error({
                message: 'Failure',
                description: 'Alternate Mobile Number Should be different',
            })
            return
        }

        const formData = {
            ...values,
        }

        console.log('formData', formData)

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
                    error?.response?.data?.message || 'Seller not created',
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
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
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
                                    label="Segment"
                                    invalid={errors.segment && touched.segment}
                                    errorMessage={errors.segment}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field name="segment">
                                        {({ field }: FieldProps) => (
                                            <Select
                                                {...field}
                                                value={SegmentOptions().find(
                                                    (option) =>
                                                        option.value ===
                                                        field.value,
                                                )}
                                                options={SegmentOptions()}
                                                onChange={(option) =>
                                                    setFieldValue(
                                                        'segment',
                                                        option?.value,
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>

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

                            <h5 className="mb-5 from-neutral-900">
                                Account Details
                            </h5>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Account Number"
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
                                    label="Confirm Account Number"
                                    invalid={errors.confirm && touched.confirm}
                                    errorMessage={errors.confirm}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="confirm"
                                        placeholder="Confirm Account Number"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Account Holder Name"
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
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                <Button
                                    type="reset"
                                    className="mr-2"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    className="bg-blue-500 text-white"
                                >
                                    Submit
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditSeller
