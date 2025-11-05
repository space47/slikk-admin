/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik' // Add FieldProps here
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import AccessDenied from '@/views/pages/AccessDenied'
import { SellerFormTypes } from '../sellerCommon'
import SellerForm from '../sellerForm/SellerForm'

// const SegmentOptions = () => {
//     return ['Fashion', 'Footwear', 'Beauty & Personal Care', 'Home Decor', 'Accessories', 'Travel and Luggages'].map((segment) => ({
//         label: segment,
//         value: segment,
//     }))
// }

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
            <h3 className="text-xl font-bold">Onboarding Process</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="xl:w-[90%] w-full p-5 ">
                        <SellerForm values={values} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditSeller
