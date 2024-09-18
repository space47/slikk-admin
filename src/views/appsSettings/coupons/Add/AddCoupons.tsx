/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { COUPONDATA } from '@/store/types/coupons.types'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import { COUPON_FORM } from '../Edit/EditCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import Upload from '@/components/ui/Upload'

const CouponsType = () => {
    return ['PERCENT_OFF', 'MONEY_OFF'].map((coupon) => ({
        label: coupon,
        value: coupon,
    }))
}

const FrequencyType = () => {
    return ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY'].map((freq) => ({
        label: freq,
        value: freq,
    }))
}

const DiscountType = () => {
    return ['COUPON', 'PERIODIC'].map((freq) => ({
        label: freq,
        value: freq,
    }))
}

const AddCoupons = () => {
    const MAX_UPLOAD = 90000000

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
            'image/JPEG',
            'image/JPG',
            'image/WEBP',
            'image/PNG',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]
        const MAX_FILE_SIZE = 5000000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a valid file format'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }

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
            const response = await axioisInstance.post(`/merchant/coupon`, formData)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Coupon created Successfully',
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
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                <FormItem label="Coupon Type" className="col-span-1 w-full">
                                    <Field name="type">
                                        {({ field }: FieldProps) => (
                                            <Select
                                                {...field}
                                                value={CouponsType().find((option) => option.value === field.value)}
                                                options={CouponsType()}
                                                onChange={(option) => setFieldValue('type', option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Frequency */}

                                <FormItem label="Frequency" className="col-span-1 w-full">
                                    <Field name="frequency">
                                        {({ field }: FieldProps) => (
                                            <Select
                                                {...field}
                                                value={FrequencyType().find((option) => option.value === field.value)}
                                                options={FrequencyType()}
                                                onChange={(option) => setFieldValue('frequency', option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                {/* DIscount TYpe */}
                                <FormItem label="Coupon Discount Type" className="col-span-1 w-full">
                                    <Field name="coupon_discount_type">
                                        {({ field }: FieldProps) => (
                                            <Select
                                                {...field}
                                                value={DiscountType().find((option) => option.value === field.value)}
                                                options={DiscountType()}
                                                onChange={(option) => setFieldValue('coupon_discount_type', option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/*  */}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-hidden ">
                                    Image
                                    <FormContainer className=" mt-5 w-full ">
                                        {/* DIV */}

                                        <FormItem label="" className="grid grid-rows-2">
                                            <Field name="imageArray">
                                                {({ form }: FieldProps<any>) => (
                                                    <>
                                                        <Upload
                                                            className="flex justify-center"
                                                            multiple
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
                                    <FormItem
                                        label=""
                                        invalid={errors.image && touched.image}
                                        errorMessage={errors.image}
                                        className="col-span-1 w-[80%]"
                                    >
                                        <Field type="text" name="image" placeholder="Enter ImageUrl or Upload Image file" component={Input} />
                                    </FormItem>
                                </FormContainer>

                                {COUPON_FORM.slice(5, 20).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
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
