/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import CouponSeriesForm from '../couponSeriesUtils/CouponSeriesForm'
import { couponSeriesService } from '@/store/services/couponSeriesService'
import { handleimage } from '@/common/handleImage'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

const CouponSeriesAdd = () => {
    const navigate = useNavigate()
    const [addCouponseries, addCouponseriesresponse] = couponSeriesService.useAddCouponSeriesMutation()

    const initialValue = {}
    useEffect(() => {
        if (addCouponseriesresponse.isSuccess) {
            notification.success({
                message: 'Successfully added Series',
            })
            navigate(-1)
        }
        if (addCouponseriesresponse?.isError) {
            notification.error({
                message: addCouponseriesresponse?.error?.data?.message || 'Failed to add Series',
            })
        }
    }, [addCouponseriesresponse?.isSuccess])

    const handleSubmit = async (values: any) => {
        console.log('values is', values)
        const imageUpload = await handleimage('product', values.imageArray)
        addCouponseries({
            discount_type: values?.discount_type,
            value: values?.value,
            image: imageUpload || '',
            min_cart_value: values?.min_cart_value,
            max_count: values?.max_count,
            maximum_discount: values?.maximum_discount,
            valid_from: values?.valid_from,
            valid_to: values?.valid_to,
            description: values?.description,
            max_count_per_user: values?.max_count_per_user,
            campaign: values?.campaign,
            coupon_type: values?.coupon_type,
            is_public: values?.is_public,
            extra_attributes: values?.extra_attributes,
        })
            .then(() => {})
            .catch(() => {
                notification.error({
                    message: 'Failed to add Series',
                })
            })
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, resetForm }) => (
                    <Form className="w-full shadow-xl p-3 rounded-xl ">
                        <FormContainer className="">
                            <CouponSeriesForm values={values} setFieldValue={setFieldValue} resetForm={resetForm} />
                        </FormContainer>
                        <FormContainer>
                            <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CouponSeriesAdd
