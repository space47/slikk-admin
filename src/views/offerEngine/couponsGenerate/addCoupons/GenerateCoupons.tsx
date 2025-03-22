/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { couponSeriesService } from '@/store/services/couponSeriesService'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { CouponSeriesInitialTypes, setCouponSeriesData } from '@/store/slices/couponSeriesSlice/couponSeries'
import CouponsGenerateForm from '../couponsGenerateUtils/CouponsGenerateForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const GenerateCoupons = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { couponSeries } = useAppSelector<CouponSeriesInitialTypes>((state) => state.couponSeries)
    const { data: couponSeriesData, isSuccess } = couponSeriesService.useCouponSeriesQuery(
        { page: 1, pageSize: 100 },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setCouponSeriesData(couponSeriesData?.data?.results))
        }
    }, [isSuccess, couponSeriesData?.data?.results, dispatch])

    const formattedData = couponSeries?.map((item) => {
        return {
            label: item?.campaign,
            value: item?.id,
        }
    })

    const initialValue = {}

    const handleSubmit = async (values: any) => {
        console.log('form values are', values)
        const formData = new FormData()

        const appendIfDefined = (key: string, value: any) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value)
            }
        }

        console.log('here')
        appendIfDefined('id', values?.coupon_series)
        appendIfDefined('auto_generate', (values.auto_generate_code ? true : false).toString())
        appendIfDefined('mobiles', values?.users || '')
        appendIfDefined('prefix', values.prefix)
        appendIfDefined('unique_user_code', values.unique_user_code)
        appendIfDefined('code_length', values?.length)
        appendIfDefined('code_text_type', values?.auto_generate_type)
        appendIfDefined('coupons_count', values.coupons_count)
        appendIfDefined('code', values.coupon_code_name)
        appendIfDefined('series_diff', values?.series_diff)
        appendIfDefined('is_random', (values?.numeric_type === 'random' ? true : false).toString())
        if (values.docsArray && values.docsArray.length > 0) {
            formData.append('users', values.docsArray[0])
        }

        console.log('form data to be sent is', new Date(), formData)
        const formDataEntries: any = {}
        formData.forEach((value: any, key: any) => {
            formDataEntries[key] = value
        })
        console.log('Converted form data for logging:', formDataEntries)

        try {
            const response = await axioisInstance.post(`/merchant/coupon/generate`, formData)
            notification.success({
                message: response?.data?.data?.message || 'Successfully added coupon',
            })
            navigate(-1)
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to add',
            })
            console.error(error)
        }
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-full shadow-xl p-3 rounded-xl ">
                        <FormContainer className="">
                            <CouponsGenerateForm formattedOptions={formattedData} values={values} />
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

export default GenerateCoupons
