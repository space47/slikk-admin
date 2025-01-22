/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import React from 'react'
import { COUPON_FORM } from './Edit/EditCommon'
import { RichTextEditor } from '@/components/shared'
import { DatePicker } from 'antd'
import moment from 'moment'
import { beforeUpload } from '@/common/beforeUpload'

interface CouponProps {
    CouponsType: any
    values: any
    ACTIONARRAY?: any
    userAction?: any
    setUserAction?: any
    setFieldValue: any
    resetForm: any
    isEdit?: any
}

const FrequencyType = () => {
    return ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY'].map((freq) => ({
        label: freq,
        value: freq,
    }))
}

const DiscountType = [
    { name: 'COUPON', value: 'COUPON' },
    { name: 'PERIODIC', value: 'PERIODIC' },
]

const CouponForm = ({ CouponsType, values, ACTIONARRAY, userAction, setUserAction, setFieldValue, resetForm, isEdit }: CouponProps) => {
    return (
        <Form className="w-3/4">
            <FormContainer>
                <FormContainer className="grid grid-cols-2 gap-10">
                    {COUPON_FORM.slice(0, 5).map((item, key) => (
                        <FormItem key={key} label={item.label} className={item.classname}>
                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                        </FormItem>
                    ))}

                    <FormItem label="Description">
                        <Field name="description">
                            {({ field, form }: FieldProps) => (
                                <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                            )}
                        </Field>
                    </FormItem>

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
                                        value={CouponsType().find((option: any) => option.value === field.value)}
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
                            <Field type="text" name="image" placeholder="Enter ImageUrl or Upload Image file" component={Input} />
                        </FormItem>
                    </FormContainer>

                    <FormItem label="Coupon Discount Type">
                        <Select
                            isClearable
                            className="xl:w-1/2 mt-7 w-full"
                            options={DiscountType}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.value}
                            value={DiscountType.find((option: any) => option.value === values.coupon_discount_type) || null}
                            onChange={(selectedOption) => {
                                const newValue: string = selectedOption?.value || ''
                                setFieldValue('coupon_discount_type', newValue)
                            }}
                        />{' '}
                    </FormItem>

                    <FormItem label="Max Order Count">
                        <Field type="number" name="max_order_count" placeholder="Enter max order count" component={Input} min="0" />
                    </FormItem>
                    <FormItem label="Min Order Count">
                        <Field type="number" name="min_order_count" placeholder="Enter min order count" component={Input} min="0" />
                    </FormItem>

                    {COUPON_FORM.slice(5, 20).map((item, key) => (
                        <FormItem key={key} label={item.label} className={item.classname}>
                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                        </FormItem>
                    ))}

                    {isEdit && (
                        <Select
                            isClearable
                            className="xl:w-1/2 mt-7 w-full"
                            options={ACTIONARRAY}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.value}
                            value={ACTIONARRAY.find((option: any) => option.value === userAction)}
                            onChange={(selectedOption) => {
                                const newValue: string = selectedOption?.value || ''
                                setUserAction(newValue)
                                setFieldValue('user_add_action', newValue)
                            }}
                        />
                    )}
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
    )
}

export default CouponForm
