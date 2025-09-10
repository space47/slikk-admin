/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import CouponSeriesForm from '../couponSeriesUtils/CouponSeriesForm'
import { useNavigate, useParams } from 'react-router-dom'
import { couponSeriesService } from '@/store/services/couponSeriesService'
import { CouponSeriesInitialTypes, setCouponSeriesActive } from '@/store/slices/couponSeriesSlice/couponSeries'
import { useAppDispatch, useAppSelector } from '@/store'
import { handleimage } from '@/common/handleImage'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const CouponSeriesEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { couponSeriesActive } = useAppSelector<CouponSeriesInitialTypes>((state) => state.couponSeries)
    const { data: couponSeriesData, isSuccess } = couponSeriesService.useCouponSeriesQuery({ id: id }, { refetchOnMountOrArgChange: true })
    const [editSeriesData, editSeriesDataResponse] = couponSeriesService.useEditCouponSeriesMutation()
    const [filterId, setFilterId] = useState<any>()
    const [excludeFilterId, setExcludeFilterId] = useState<any>()

    console.log('filterId is', filterId)

    useEffect(() => {
        if (isSuccess) {
            dispatch(setCouponSeriesActive(couponSeriesData?.data?.results[0]))
        }
    }, [isSuccess, couponSeriesData?.data?.results, dispatch])

    useEffect(() => {
        if (editSeriesDataResponse?.isSuccess) {
            notification.success({
                message: 'Coupon Series Updated Successfully',
            })
            navigate(`/app/appSettings/couponsGenerate/generateCoupons`)
        } else if (editSeriesDataResponse?.error) {
            notification.error({
                message: 'Failed to update',
            })
        }
    }, [editSeriesDataResponse?.isSuccess, editSeriesDataResponse?.error, navigate])

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
        max_coupons_per_user: couponSeriesActive?.max_coupons_per_user,
        series_type: couponSeriesActive?.series_type,
        event_name: couponSeriesActive?.event_name,
        coupon_active_event_name: couponSeriesActive?.coupon_active_event_name,
        store_id: couponSeriesActive?.store_id,
    }

    // useEffect(() => {
    //     setExcludeFilterId(couponSeriesActive?.extra_attributes?.filters?.filter_id_exclude || '')
    // }, [couponSeriesActive])

    console.log('filters are', excludeFilterId)

    const handleSubmit = async (values: any) => {
        let imageUpload = values?.image
        if (values?.imageArray && values?.imageArray?.length > 0) {
            imageUpload = await handleimage('product', values?.imageArray)
        }
        const body = Object.fromEntries(
            Object.entries({
                discount_type: values?.discount_type,
                value: values?.value,
                image: imageUpload,
                min_cart_value: values?.min_cart_value,
                max_count: values?.max_count,
                maximum_discount: values?.maximum_discount,
                valid_from: values?.valid_from,
                valid_to: values?.valid_to,
                description: values?.description,
                max_count_per_user: values?.max_count_per_user,
                campaign: values?.campaign,
                coupon_type: values?.coupon_type,
                series_type: values?.series_type,
                event_name: values?.event_name,
                coupon_active_event_name: values?.coupon_active_event_name,
                max_coupons_per_user: values?.max_coupons_per_user,
                is_public: values?.is_public ?? false,
                store_id: values?.store?.map((store: any) => store.id).join(',') || '',
                extra_attributes: {
                    new_users_only: values?.extra_attributes?.new_users_only,
                    filters: {
                        filter_id: filterId ?? values?.extra_attributes?.filters?.filter_id,
                        filter_id_exclude: excludeFilterId ?? values?.extra_attributes?.filters?.filter_id_exclude,
                        min_item_quantity: values?.extra_attributes?.filters?.min_item_quantity,
                        max_item_quantity: values?.extra_attributes?.filters?.max_item_quantity,
                    },
                    bxgy_config: {
                        max_groups: values?.extra_attributes?.bxgy_config?.max_groups,
                        y_quantity: values?.extra_attributes?.bxgy_config?.y_quantity,
                        x_quantity: values?.extra_attributes?.bxgy_config?.x_quantity,
                        y_discount_value: values?.extra_attributes?.bxgy_config?.y_discount_value,
                        y_discount_type: values?.extra_attributes?.bxgy_config?.y_discount_type,
                    },
                    auto_apply: values?.extra_attributes?.auto_apply || false,
                    offer_text: values?.extra_attributes?.offer_text,
                    terms_and_conditions: values?.extra_attributes?.terms_and_conditions,

                    min_filters_products_amount: values?.extra_attributes?.min_filters_products_amount,
                },
            }).filter(([key, value]) => value !== undefined && value !== null && value !== ''),
        )
        try {
            editSeriesData({
                id: id?.toString(),
                ...body,
            }).unwrap()
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to update',
            })
            console.error(error)
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue, resetForm }) => (
                    <Form className="w-full shadow-xl p-3 rounded-xl ">
                        <div className="flex gap-6 text-xl font-bold mb-10 items-center ">
                            <span>Update Coupon Series</span>
                            <span
                                className="cursor-pointer bg-red-800 text-white p-2 rounded-xl hover:bg-red-700"
                                onClick={() => navigate(`/app/appSettings/couponsGenerate/generateCoupons`)}
                            >
                                Add Coupons
                            </span>
                        </div>
                        <FormContainer className="">
                            <CouponSeriesForm
                                setFilterId={setFilterId}
                                values={values}
                                setFieldValue={setFieldValue}
                                resetForm={resetForm}
                                excludeFilterValue={initialValue?.extra_attributes?.filters?.filter_id_exclude}
                                setExcludeFilterId={setExcludeFilterId}
                                filterValue={initialValue?.extra_attributes?.filters?.filter_id}
                            />
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
