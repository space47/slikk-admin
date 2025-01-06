/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { COUPONDATA } from '@/store/types/coupons.types'
import { Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import CouponForm from '../CouponForm'

const CouponsType = () => {
    return ['PERCENT_OFF', 'FLAT_OFF'].map((coupon) => ({
        label: coupon,
        value: coupon,
    }))
}

const AddCoupons = () => {
    const navigate = useNavigate()

    const initialValue: COUPONDATA = {
        code: '',
        imageArray: [],
        image: null,
        type: '',
        value: null,
        min_cart_value: null,
        max_count: null,
        maximum_price: null,
        valid_from: '',
        valid_to: '',
        description: '',
        max_count_per_user: null,
        coupon_used_count: null,
        frequency: null,
        coupon_type: '',
        user_add_action: '',
        user: [],
    }

    const handleSubmit = async (values: COUPONDATA) => {
        try {
            const formData = new FormData()

            if (values.imageArray && values.imageArray.length > 0) {
                formData.append('image', values.imageArray[0])
            }

            const userArray = Array.isArray(values.user) ? values.user : values.user.split(',').map((mobile) => mobile.trim())

            formData.append('code', values.code)
            formData.append('type', values.type)
            formData.append('value', values.value?.toString() || '')
            formData.append('min_cart_value', values.min_cart_value?.toString() || '')
            formData.append('max_count', values.max_count?.toString() || '')
            formData.append('maximum_price', values.maximum_price?.toString() || '')
            formData.append('valid_from', values.valid_from)
            formData.append('valid_to', values.valid_to)
            formData.append('description', values.description)
            formData.append('is_public', values?.is_public)
            formData.append('max_count_per_user', values.max_count_per_user?.toString() || '')
            formData.append('coupon_used_count', values.coupon_used_count?.toString() || '')
            formData.append('coupon_discount_type', values?.coupon_discount_type || '')
            const extraAttributes = {
                delivery_free: values?.delivery_free,
                max_order_count: values?.max_order_count,
                min_order_count: values?.min_order_count,
            }
            formData.append('extra_attributes', JSON.stringify(extraAttributes))

            if (userArray.length > 0) {
                formData.append('users', userArray)
            }

            console.log('ARRAY of USERS', values.user)

            console.log('Form data before API call:', formData)

            const response = await axioisInstance.post('/merchant/coupon', formData)

            notification.success({
                message: 'Success',
                description: response?.data?.message || response?.data?.data?.message || 'Coupon created successfully',
            })
            navigate(-1)
        } catch (error: any) {
            console.error('Error during submission:', error)

            notification.error({
                message: error?.response?.data?.data?.message || 'Failure',
                description: 'Failed to create Coupon',
            })
        }
    }
    return (
        <div>
            <h3 className="mb-5 from-neutral-900 font-semibold">COUPON ADD</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <CouponForm values={values} setFieldValue={setFieldValue} resetForm={resetForm} CouponsType={CouponsType} />
                )}
            </Formik>
        </div>
    )
}

export default AddCoupons
