/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik' // Add FieldProps here
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { SELLING_FORM, POC_FORM, ACCOUNT_FORM } from './addCommon'
import { SellerFormTypes } from '../sellerCommon'

const initialValue: SellerFormTypes = {
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
    confirm: '',
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

const SegmentOptions = () => {
    return ['Fashion', 'Footwear', 'Beauty & Personal Care', 'Home Decor', 'Accessories', 'Travel and Luggages'].map((segment) => ({
        label: segment,
        value: segment,
    }))
}

const AddSeller = () => {
    const navigate = useNavigate()

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

        try {
            const response = await axioisInstance.post('merchant/company', formData)

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

    return (
        <div>
            <h3 className="text-xl font-bold">Add Seller</h3>
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
                                <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className=" text-white">
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
