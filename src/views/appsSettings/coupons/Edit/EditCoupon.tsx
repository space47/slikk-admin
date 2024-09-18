import React, { useEffect } from 'react'
import { fetchCoupons } from '@/store/slices/couponSlice/couponSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { COUPON_STATE, COUPONDATA } from '@/store/types/coupons.types'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import { COUPON_FORM } from './EditCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const CouponsType = () => {
    return ['PERCENT_OFF', 'MONEY_OFF'].map((segment) => ({
        label: segment,
        value: segment,
    }))
}

const AddCoupons = () => {
    const { coupons } = useAppSelector<COUPON_STATE>((state) => state.coupon)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchCoupons())
    }, [])

    console.log('COUPONDATA', coupons)

    const initialValue: COUPONDATA = {
        code: '',
        imageArray: [],
        image: null,
        type: '',
        value: null,
        min_cart_value: '',
        max_count: '',
        maximum_price: '',
        valid_from: '',
        valid_to: '',
        description: '',
        max_count_per_user: '',
        coupon_used_count: '',
        frequency: null,
        coupon_discount_type: '',
        user: [],
    }

    const handleSubmit = async (values: COUPONDATA) => {
        console.log('ARRAY', values.imageArray)
        const { imageArray, ...formData } = values

        formData.image = imageArray.map((file: File) => file.name).join(',')
        formData.user = values.user.split(',')

        try {
            const response = await axioisInstance.post(
                `/merchant/coupon`,
                formData,
            )
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Coupon created Successfully',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to create Coupon',
            })
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">COUPON EDIT</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {COUPON_FORM.slice(0, 5).map((item, key) => (
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}

                                <FormItem
                                    label="Coupon Type"
                                    className="col-span-1 w-full"
                                >
                                    <Field name="type">
                                        {({ field }: FieldProps) => (
                                            <Select
                                                {...field}
                                                value={CouponsType().find(
                                                    (option) =>
                                                        option.value ===
                                                        field.value,
                                                )}
                                                options={CouponsType()}
                                                onChange={(option) =>
                                                    setFieldValue(
                                                        'type',
                                                        option?.value,
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {COUPON_FORM.slice(5, 20).map((item, key) => (
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                <Button
                                    type="reset"
                                    className="mr-2"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    className="bg-blue-500 text-white"
                                >
                                    Submit
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddCoupons
