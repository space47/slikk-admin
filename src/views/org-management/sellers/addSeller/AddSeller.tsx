import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik' // Add FieldProps here
import * as Yup from 'yup'
import { useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { SELLING_FORM, POC_FORM, ACCOUNT_FORM } from './addCommon'

type FormModel = {
    account_holder_name: string
    account_number: string
    address: string
    alternate_contact_number: string
    bank_name: string
    cin: string
    contact_number: string
    create_date: string
    damages_per_sku: number
    gstin: string
    handling_charges_per_order: number
    id: number
    ifsc: string
    is_active: boolean
    name: string
    poc: string
    poc_email: string
    registered_name: string
    removal_fee_per_sku: number
    revenue_share: number
    segment: string
    settlement_days: number
    update_date: string
    warehouse_charge_per_sku: number
}

const initialValue: FormModel = {
    account_holder_name: '',
    account_number: '',
    address: '',
    alternate_contact_number: '',
    bank_name: '',
    cin: '',
    contact_number: '',
    create_date: '',
    damages_per_sku: 0,
    gstin: '',
    handling_charges_per_order: 0,
    id: 0,
    ifsc: '',
    is_active: false,
    name: '',
    poc: '',
    poc_email: '',
    registered_name: '',
    removal_fee_per_sku: 0,
    revenue_share: 0,
    segment: '',
    settlement_days: 0,
    update_date: '',
    warehouse_charge_per_sku: 0,
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
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {SELLING_FORM.map((item, key) => (
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}

                                <FormItem
                                    asterisk
                                    label="Segment"
                                    invalid={errors.segment && touched.segment}
                                    errorMessage={errors.segment}
                                    className="col-span-1 w-full"
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

                            <h5 className="mb-5 from-neutral-900">
                                POC Details
                            </h5>
                            <FormContainer className="grid grid-cols-2 gap-10 ">
                                {POC_FORM.map((item, key) => (
                                    <FormItem
                                        asterisk
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            {/* ------------------------------------------------------------------------------------------------ */}

                            <h5 className="mb-5 from-neutral-900">
                                Account Details
                            </h5>
                            <FormContainer className="grid grid-cols-2 gap-10 ">
                                {ACCOUNT_FORM.map((item, key) => (
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                <Button
                                    type="reset"
                                    className="mr-2 bg-gray-600"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    className=" text-white"
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

export default AddSeller
