/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { COUPONDATA } from '@/store/types/coupons.types'
import { Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import CouponForm from '../CouponForm'

const CouponsType = () => {
    return ['PERCENT_OFF', 'FLAT_OFF'].map((segment) => ({
        label: segment,
        value: segment,
    }))
}

const ACTIONARRAY = [
    { name: 'Add', value: 'add' },
    { name: 'Remove', value: 'remove' },
    { name: 'Replace', value: 'replace' },
]

const AddCoupons = () => {
    const [userAction, setUserAction] = useState('add')
    const [couponsEdit, setCouposEdit] = useState<any>()
    const { coupon_code } = useParams()
    const navigate = useNavigate()

    const fetchCouponsCode = async () => {
        try {
            const response = await axioisInstance.get(`merchant/coupon?coupon_code=${coupon_code}`)
            const data = response?.data?.data
            setCouposEdit(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCouponsCode()
    }, [])

    console.log('Coupons Code', couponsEdit?.extra_attributes?.delivery_free)

    const initialValue: any = {
        code: couponsEdit?.code || '',
        imageArray: [],
        image: couponsEdit?.image || '',
        type: couponsEdit?.type || '',
        value: couponsEdit?.value || null,
        min_cart_value: couponsEdit?.min_cart_value || null,
        max_count: couponsEdit?.max_count || null,
        maximum_price: couponsEdit?.maximum_price || null,
        valid_from: couponsEdit?.valid_from || '',
        valid_to: couponsEdit?.valid_to || '',
        description: couponsEdit?.description || '',
        max_count_per_user: couponsEdit?.max_count_per_user || null,
        coupon_used_count: couponsEdit?.coupon_used_count || null,
        user: couponsEdit?.user?.map((item) => item.mobile) || [],
        user_add_action: userAction,
        is_public: couponsEdit?.is_public,
        delivery_free: couponsEdit?.extra_attributes?.delivery_free,
        coupon_discount_type: couponsEdit?.coupon_discount_type,
        max_order_count: couponsEdit?.extra_attributes?.max_order_count,
        min_order_count: couponsEdit?.extra_attributes?.min_order_count,
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
            formData.append('max_count_per_user', values.max_count_per_user?.toString() || '')
            formData.append('coupon_used_count', values.coupon_used_count?.toString() || '')
            formData.append('user_add_action', userAction)
            formData.append('is_public', values?.is_public || false)
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

            const response = await axioisInstance.patch('/merchant/coupon', formData)

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
            <h3 className="mb-5 from-neutral-900">COUPON EDIT</h3>
            <Formik initialValues={initialValue} onSubmit={handleSubmit} enableReinitialize>
                {({ values, setFieldValue, resetForm }) => (
                    <CouponForm
                        values={values}
                        setFieldValue={setFieldValue}
                        resetForm={resetForm}
                        ACTIONARRAY={ACTIONARRAY}
                        userAction={userAction}
                        setUserAction={setUserAction}
                        CouponsType={CouponsType}
                        isEdit
                    />
                )}
            </Formik>
        </div>
    )
}

export default AddCoupons
