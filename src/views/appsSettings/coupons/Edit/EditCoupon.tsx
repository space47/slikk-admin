/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import CouponForm from '../CouponForm'

const ACTION_ARRAY = [
    { name: 'Add', value: 'add' },
    { name: 'Remove', value: 'remove' },
    { name: 'Replace', value: 'replace' },
]

const AddCoupons = () => {
    const navigate = useNavigate()
    const [couponsEdit, setCouponsEdit] = useState<any>()
    const { coupon_code } = useParams()

    useEffect(() => {
        const fetchCouponsCode = async () => {
            try {
                const response = await axioisInstance.get(`merchant/coupon?coupon_code=${coupon_code}`)
                const data = response?.data?.data
                setCouponsEdit(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchCouponsCode()
    }, [coupon_code])

    const initialValue: any = {
        code: couponsEdit?.code || '',
        user: couponsEdit?.user?.map((item: any) => item.mobile) || [],
    }

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData()
            const userArray = Array.isArray(values.user) ? values.user : values.user.split(',').map((mobile: string) => mobile.trim())
            formData.append('code', initialValue?.code)
            formData.append('user_add_action', values?.user_add_action)
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
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue, resetForm }) => (
                    <CouponForm values={values} setFieldValue={setFieldValue} resetForm={resetForm} ACTIONARRAY={ACTION_ARRAY} />
                )}
            </Formik>
        </div>
    )
}

export default AddCoupons
