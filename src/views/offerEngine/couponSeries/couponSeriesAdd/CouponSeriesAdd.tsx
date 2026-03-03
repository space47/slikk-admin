/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import CouponSeriesForm from '../couponSeriesUtils/CouponSeriesForm'
import { couponSeriesService } from '@/store/services/couponSeriesService'
import { handleimage } from '@/common/handleImage'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import FormButton from '@/components/ui/Button/FormButton'
import { CiShare1 } from 'react-icons/ci'

const CouponSeriesAdd = () => {
    const navigate = useNavigate()
    const [addCouponseries, addCouponseriesresponse] = couponSeriesService.useAddCouponSeriesMutation()
    const [filterId, setFilterId] = useState<any>()
    const [excludeFilterId, setExcludeFilterId] = useState<any>()

    console.log('filterId is', filterId)

    const initialValue = {}
    useEffect(() => {
        if (addCouponseriesresponse.isSuccess) {
            notification.success({
                message: 'Successfully added Series',
            })
            navigate(`/app/appSettings/couponsGenerate/generateCoupons`)
        }
        if (addCouponseriesresponse?.isError) {
            console.log('error is', addCouponseriesresponse?.error)
            notification.error({
                message: 'Failed to add Series',
            })
        }
    }, [addCouponseriesresponse?.isSuccess, addCouponseriesresponse?.isError, addCouponseriesresponse?.error, navigate])

    const handleSubmit = async (values: any) => {
        console.log('values is', values)
        let imageUpload = ''
        if (values?.imageArray && values?.imageArray?.length > 0) {
            imageUpload = await handleimage('product', values.imageArray)
        }

        try {
            await addCouponseries({
                discount_type: values?.discount_type,
                value: values?.value,
                image: imageUpload,
                min_cart_value: values?.min_cart_value || null,
                max_count: values?.max_count,
                maximum_discount: values?.maximum_discount,
                valid_from: values?.valid_from,
                valid_to: values?.valid_to,
                description: values?.description,
                max_count_per_user: values?.max_count_per_user,
                campaign: values?.campaign,
                coupon_type: values?.coupon_type,
                is_public: values?.is_public ?? false,
                series_type: values?.series_type,
                event_name: values?.event_name,
                coupon_active_event_name: values?.coupon_active_event_name,
                max_coupons_per_user: values?.max_coupons_per_user,
                store_id: values?.store?.map((store: any) => store.id).join(',') || '',
                extra_attributes: {
                    new_users_only: values?.extra_attributes?.new_users_only,
                    filters: {
                        filter_id: filterId ?? '',
                        filter_id_exclude: excludeFilterId || '',
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
                    min_filters_products_amount: values?.extra_attributes?.min_filters_products_amount,
                    free_delivery: values?.extra_attributes?.free_delivery || false,
                    terms_and_conditions: values?.extra_attributes?.terms_and_conditions,
                    max_order_count: values?.extra_attributes?.max_order_count ?? '',
                    min_order_count: values?.extra_attributes?.min_order_count ?? '',
                    user_filters: {
                        registration_date: {
                            from_date: values?.extra_attributes?.user_filters?.registration_date?.from_date,
                            to_date: values?.extra_attributes?.user_filters?.registration_date?.to_date,
                        },
                    },
                },
            }).unwrap()
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to add Series',
            })
        }
    }

    return (
        <div className="bg-gray-50 rounded-2xl">
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, resetForm }) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl ">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-2xl font-semibold text-gray-800">Add New Coupon Series</h2>
                        </div>
                        <div className="mb-8">
                            <Button
                                variant="twoTone"
                                icon={<CiShare1 />}
                                onClick={() => navigate(`/app/appSettings/couponsGenerate/generateCoupons`)}
                            >
                                <span>Add Coupons</span>
                            </Button>
                        </div>
                        <FormContainer className="">
                            <CouponSeriesForm
                                setFilterId={setFilterId}
                                values={values}
                                setFieldValue={setFieldValue}
                                resetForm={resetForm}
                                excludeFilterValue={excludeFilterId}
                                setExcludeFilterId={setExcludeFilterId}
                            />
                        </FormContainer>
                        <FormButton value="Add" isSpinning={addCouponseriesresponse.isLoading} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CouponSeriesAdd
