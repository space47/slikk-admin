import React, { useEffect, useState } from 'react'
import { fetchCoupons, fetchCouponsEdit } from '@/store/slices/couponSlice/couponSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { COUPON_STATE, COUPONDATA } from '@/store/types/coupons.types'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import { COUPON_FORM } from './EditCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { DatePicker, notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload } from '@/components/ui'
import { beforeUpload } from '@/common/beforeUpload'
import moment from 'moment'

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
    const { couponsEdit } = useAppSelector<COUPON_STATE>((state) => state.coupon)
    const dispatch = useAppDispatch()
    const { coupon_code } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (coupon_code) {
            dispatch(fetchCouponsEdit(coupon_code))
        }
    }, [coupon_code, dispatch])

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

            if (userArray.length > 0) {
                formData.append('users', userArray)
            }

            const response = await axioisInstance.patch('/merchant/coupon', formData)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Coupon created successfully',
            })
            navigate(-1)
        } catch (error) {
            console.error('Error during submission:', error)

            notification.error({
                message: 'Failure',
                description: 'Failed to create Coupon',
            })
        }
    }

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
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">COUPON EDIT</h3>
            <Formik initialValues={initialValue} onSubmit={handleSubmit} enableReinitialize>
                {({ values, setFieldValue, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {COUPON_FORM.slice(0, 5).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                <FormItem label="Valid From" className="col-span-1 w-full">
                                    <Field name="valid_from">
                                        {({ field, form }: any) => (
                                            <DatePicker
                                                showTime
                                                placeholder=""
                                                value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                onChange={(value) => {
                                                    form.setFieldValue('valid_from', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem label="Valid To" className="col-span-1 w-full">
                                    <Field name="valid_to">
                                        {({ field, form }: any) => (
                                            <DatePicker
                                                showTime
                                                placeholder=""
                                                value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                onChange={(value) => {
                                                    form.setFieldValue('valid_to', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem label="Type" className="col-span-1 w-full">
                                    <Field name="type">
                                        {({ field, form }: FieldProps) => {
                                            console.log('VALUE', field.value)

                                            return (
                                                <Select
                                                    {...field}
                                                    value={CouponsType().find((option) => option.value === field.value)}
                                                    options={CouponsType()}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-scroll scrollbar-hide ">
                                    Image
                                    <FormContainer className=" mt-5 w-full ">
                                        {/* DIV */}

                                        <FormItem label="" className="grid grid-rows-2">
                                            <Field name="imageArray">
                                                {({ form }: FieldProps) => (
                                                    <>
                                                        <Upload
                                                            multiple
                                                            className="flex justify-center"
                                                            beforeUpload={beforeUpload}
                                                            fileList={values.imageArray}
                                                            onChange={(files) => form.setFieldValue('imageArray', files)}
                                                            onFileRemove={(files) => form.setFieldValue('imageArray', files)}
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>

                                        <br />
                                        <br />
                                    </FormContainer>
                                    <FormItem label="" className="col-span-1 w-[80%]">
                                        <Field
                                            type="text"
                                            name="image"
                                            placeholder="Enter ImageUrl or Upload Image file"
                                            component={Input}
                                        />
                                    </FormItem>
                                </FormContainer>

                                {COUPON_FORM.slice(5, 20).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                <Select
                                    className="xl:w-1/2 mt-7 w-full"
                                    options={ACTIONARRAY}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.value}
                                    value={ACTIONARRAY.find((option) => option.value === userAction)}
                                    onChange={(selectedOption) => {
                                        const newValue: string = selectedOption?.value || ''
                                        setUserAction(newValue)
                                        setFieldValue('user_add_action', newValue)
                                    }}
                                />
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
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
