/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import CouponSeriesForm from '../couponSeriesUtils/CouponSeriesForm'
import { useParams } from 'react-router-dom'
import { couponSeriesService } from '@/store/services/couponSeriesService'
import { CouponSeriesInitialTypes, setCouponSeriesActive } from '@/store/slices/couponSeriesSlice/couponSeries'
import { useAppDispatch, useAppSelector } from '@/store'
import { CouponResults } from '@/store/types/couponSeries.types'

const CouponSeriesEdit = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const { couponSeriesActive } = useAppSelector<CouponSeriesInitialTypes>((state) => state.couponSeries)
    const { data: couponSeriesData, isSuccess } = couponSeriesService.useCouponSeriesQuery(
        {
            id: id,
        },
        {
            refetchOnMountOrArgChange: true,
        },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setCouponSeriesActive(couponSeriesData?.data?.results[0]))
        }
    }, [isSuccess, couponSeriesData?.data?.results, dispatch])

    const initialValue: any = {
        discount_type: couponSeriesActive?.discount_type,
        value: couponSeriesActive?.value,
        image: couponSeriesActive?.image,
        min_cart_value: couponSeriesActive?.min_cart_value,
        max_count: couponSeriesActive?.max_count,
        maximum_discount: couponSeriesActive?.maximum_discount,
        valid_from: couponSeriesActive?.valid_from,
        valid_to: couponSeriesActive?.valid_to,
        description: couponSeriesActive?.description,
        max_count_per_user: couponSeriesActive?.max_count_per_user,
        campaign: couponSeriesActive?.campaign,
        coupon_type: couponSeriesActive?.coupon_type,
        is_public: couponSeriesActive?.is_public,
        extra_attributes: couponSeriesActive?.extra_attributes,
    }

    const handleSubmit = async (values: CouponResults) => {
        console.log('values is', values)
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

export default CouponSeriesEdit
