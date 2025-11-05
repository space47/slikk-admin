/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { couponSeriesService } from '@/store/services/couponSeriesService'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { CouponSeriesInitialTypes, setCouponSeriesData } from '@/store/slices/couponSeriesSlice/couponSeries'
import CouponsGenerateForm from '../couponsGenerateUtils/CouponsGenerateForm'
import FormButton from '@/components/ui/Button/FormButton'

const GenerateCoupons = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { couponSeries } = useAppSelector<CouponSeriesInitialTypes>((state) => state.couponSeries)
    const [queryParams, setQueryParams] = useState({ page: 1, pageSize: 100, campaign: '' })
    const { data: couponSeriesData, isSuccess } = couponSeriesService.useCouponSeriesQuery(queryParams, { refetchOnMountOrArgChange: true })
    const [generateCoupon, generateCouponResponse] = couponSeriesService.useGenerateCouponFromSeriesMutation()
    const [searchInput, setSearchInput] = useState<string>('')
    const [showSpinner, setShowSpinner] = useState<boolean>(false)

    useEffect(() => {
        if (isSuccess) {
            dispatch(setCouponSeriesData(couponSeriesData?.data?.results))
        }
    }, [isSuccess, couponSeriesData?.data?.results, dispatch])

    useEffect(() => {
        if (generateCouponResponse?.isSuccess) {
            notification.success({ message: 'Coupon Series Updated Successfully' })
            navigate(-2)
        } else if (generateCouponResponse?.error) {
            notification.error({ message: 'Failed to update' })
        }
    }, [generateCouponResponse?.isSuccess, generateCouponResponse?.error, navigate])

    const handleSearch = (inputValue: string) => {
        setSearchInput(inputValue)
        setQueryParams((prev) => ({ ...prev, campaign: inputValue }))
    }

    const formattedData = couponSeries
        ?.filter((item) => item?.campaign !== '')
        .map((item) => {
            return { label: item?.campaign, value: item?.id }
        })

    const initialValue = {}
    const handleSubmit = async (values: any) => {
        notification.info({ message: 'Coupon Generate in Process' })
        const formData = new FormData()
        const appendIfDefined = (key: string, value: any) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value)
            }
        }
        appendIfDefined('id', values?.coupon_series)
        appendIfDefined('auto_generate', (values.auto_generate_code ? true : false).toString())
        appendIfDefined('mobiles', values?.users || '')
        appendIfDefined('max_count', values?.max_count || 0)
        appendIfDefined('prefix', values.prefix)
        appendIfDefined('unique_user_code', values.unique_user_code)
        appendIfDefined('code_length', values?.length)
        appendIfDefined('code_text_type', values?.auto_generate_type)
        appendIfDefined('coupons_count', values.coupons_count)
        appendIfDefined('code', values.coupon_code_name)
        appendIfDefined('series_diff', values?.series_diff)
        appendIfDefined('is_random', (values?.numeric_type === 'random' ? true : false).toString())
        if (values.docsArray) {
            if (values.docsArray[0] instanceof Blob || values.docsArray[0] instanceof File) {
                formData.append('users', values.docsArray[0])
            }
        }
        const formDataEntries: any = {}
        formData.forEach((value: any, key: any) => {
            formDataEntries[key] = value
        })
        try {
            setShowSpinner(true)
            generateCoupon({ ...formDataEntries })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to add',
            })
        } finally {
            setShowSpinner(false)
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="w-full shadow-xl p-3 rounded-xl ">
                        <div className="text-xl text-red-900 font-bold mb-10">Add New Coupon</div>

                        <FormItem label="Select Coupon Series" className="col-span-1 w-full">
                            <Field name="coupon_series">
                                {({ form, field }: FieldProps) => {
                                    console.log('FIELD.NAME', field.name, field.value)
                                    return (
                                        <Select
                                            isSearchable
                                            isClearable
                                            inputValue={searchInput}
                                            options={formattedData}
                                            value={formattedData?.find((option) => option.value === field.value)}
                                            onInputChange={handleSearch}
                                            onChange={(selectedOption: any) => {
                                                const value = selectedOption ? selectedOption.value : ''
                                                form.setFieldValue(field.name, value)
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <FormContainer className="">
                            <CouponsGenerateForm formattedOptions={formattedData} values={values} />
                        </FormContainer>
                        <FormButton isSpinning={showSpinner} value="Generate" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default GenerateCoupons
