import React, { useEffect } from 'react'
import { fetchCoupons } from '@/store/slices/couponSlice/couponSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { COUPON_STATE } from '@/store/types/coupons.types'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import { COUPON_FORM } from './EditCommon'

const EditCoupon = () => {
    const { coupons } = useAppSelector<COUPON_STATE>((state) => state.coupon)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchCoupons())
    }, [dispatch])
    console.log('coupons', coupons)

    const initialValue = {}

    const handleSubmit = () => {}

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
                                {COUPON_FORM.map((item, key) => (
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

export default EditCoupon
