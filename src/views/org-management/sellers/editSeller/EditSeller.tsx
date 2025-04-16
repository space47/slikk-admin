/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik' // Add FieldProps here
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { SELLING_FORM, POC_FORM, ACCOUNT_FORM } from './editCommon'
import AccessDenied from '@/views/pages/AccessDenied'
import { SellerFormTypes } from '../sellerCommon'

const SegmentOptions = () => {
    return ['Fashion', 'Footwear', 'Beauty & Personal Care', 'Home Decor', 'Accessories', 'Travel and Luggages'].map((segment) => ({
        label: segment,
        value: segment,
    }))
}

const EditSeller = () => {
    const [sellerData, setSellerData] = useState<SellerFormTypes>()
    const [accessDenied, setAccessDenied] = useState(false)
    const navigate = useNavigate()

    const { id } = useParams()

    const fetchsellerData = async () => {
        try {
            const response = await axioisInstance.get(`merchant/company?company_id=${id}`)
            const data = response.data.data
            console.log('ssdssdsd', data)
            setSellerData(data)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchsellerData()
    }, [id])

    const initialValue: SellerFormTypes = {
        account_holder_name: sellerData?.account_holder_name || '',
        account_number: sellerData?.account_number || '',
        address: sellerData?.address || '',
        alternate_contact_number: sellerData?.alternate_contact_number || '',
        bank_name: sellerData?.bank_name || '',
        cin: sellerData?.cin || '',
        contact_number: sellerData?.contact_number || '',
        create_date: sellerData?.create_date || '',
        damages_per_sku: sellerData?.damages_per_sku || 0,
        gstin: sellerData?.gstin || '',
        handling_charges_per_order: sellerData?.handling_charges_per_order || 0,
        id: sellerData?.id || 0,
        ifsc: sellerData?.ifsc || '',
        is_active: sellerData?.is_active || false,
        confirm: sellerData?.account_number || '',
        name: sellerData?.name || '',
        poc: sellerData?.poc || '',
        poc_email: sellerData?.poc_email || '',
        registered_name: sellerData?.registered_name || '',
        removal_fee_per_sku: sellerData?.removal_fee_per_sku || 0,
        revenue_share: sellerData?.revenue_share || 0,
        segment: sellerData?.segment || '',
        settlement_days: sellerData?.settlement_days || 0,
        update_date: sellerData?.update_date || '',
        warehouse_charge_per_sku: sellerData?.warehouse_charge_per_sku || 0,
        code: sellerData?.code || '',
    }

    const handleSubmit = async (values: SellerFormTypes) => {
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

        const { confirm, ...filteredValues } = values
        console.log(confirm)

        const formData = {
            ...filteredValues,
            handling_charges_per_order: Number(values.handling_charges_per_order),
        }

        console.log('formData', formData)

        try {
            const response = await axioisInstance.patch(`merchant/company/${id}`, formData)

            console.log(response)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Seller created Successfully',
            })
            navigate('/app/sellers')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Seller not created',
            })
        }
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div>
            <h3 className="text-xl font-bold">Edit Seller</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ resetForm }) => (
                    <Form className="xl:w-[90%] w-full p-5 shadow-xl rounded-xl">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {SELLING_FORM.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                <FormItem asterisk label="Segment" className="col-span-1 w-full">
                                    <Field name="segment">
                                        {({ field, form }: FieldProps) => {
                                            const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value.split(',')
                                            const selectedOptions = fieldValueArray.map((item: any) => {
                                                const selectedOption = SegmentOptions()?.find((options: any) => {
                                                    return options?.label === item
                                                })
                                                return selectedOption
                                            })
                                            return (
                                                <Select
                                                    isMulti
                                                    isClearable
                                                    className="w-full"
                                                    options={SegmentOptions()}
                                                    getOptionLabel={(option) => option?.label}
                                                    getOptionValue={(option) => option?.value?.toString()}
                                                    value={selectedOptions}
                                                    onChange={(newVals) => {
                                                        const selectedValues = newVals?.map((val: any) => val.value) || []
                                                        form.setFieldValue(`segment`, selectedValues?.join(','))
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            <br />
                            <h5 className="mb-3 text-gray-600 text-xl">POC Details</h5>
                            <FormContainer className="grid grid-cols-2 gap-10 ">
                                {POC_FORM.map((item, key) => (
                                    <FormItem asterisk key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            {/* ------------------------------------------------------------------------------------------------ */}
                            <br />
                            <h5 className="mb-3 text-gray-600 text-xl">Account Details</h5>
                            <FormContainer className="grid grid-cols-2 gap-10 ">
                                {ACCOUNT_FORM.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
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
