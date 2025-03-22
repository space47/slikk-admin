/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import { RichTextEditor } from '@/components/shared'
import { DatePicker } from 'antd'
import moment from 'moment'
import { beforeUpload } from '@/common/beforeUpload'
import { COUPON_SERIES_FORM } from '../couponSeriesCommon'
import CommonMultiSelect from '@/common/CommonMultiSelect'

interface CouponProps {
    values: any
    ACTIONARRAY?: any
    userAction?: any
    setUserAction?: any
    setFieldValue: any
    resetForm: any
    isEdit?: any
}

const DiscountType = [
    { name: 'COUPON', value: 'COUPON' },
    { name: 'PERIODIC', value: 'PERIODIC' },
]
const ApplicableCategoriesArray = [
    { name: 'Electronics', value: 'Electronics' },
    { name: 'Clothing', value: 'Clothing' },
    { name: 'Shoes', value: 'Shoes' },
]

const CouponsType = () => {
    return ['PERCENT_OFF', 'FLAT_OFF'].map((coupon) => ({
        label: coupon,
        value: coupon,
    }))
}

const CouponSeriesForm = ({ values, setFieldValue }: CouponProps) => {
    return (
        <Form className="">
            <FormContainer>
                <FormContainer className="grid grid-cols-2 gap-10">
                    {COUPON_SERIES_FORM.slice(0, 5).map((item, key) => (
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
                                    className="w-full"
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
                                    className="w-full"
                                    placeholder=""
                                    value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                    onChange={(value) => {
                                        form.setFieldValue('valid_to', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                    }}
                                />
                            )}
                        </Field>
                    </FormItem>

                    <FormItem label="Discount Type" className="col-span-1 w-full">
                        <Field name="discount_type">
                            {({ field, form }: FieldProps) => {
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

                    <FormContainer className="bg-blue-300 p-2 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-scroll scrollbar-hide ">
                        <div className="font-bold text-blue-700">Image</div>
                        <FormContainer className=" mt-5 w-full ">
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
                        </FormContainer>
                        <FormItem label="" className="col-span-1 w-[80%] rounded-xl ">
                            <Field
                                className="rounded-2xl "
                                type="text"
                                name="image"
                                placeholder="Drop an Image URL or Upload a File 💾"
                                component={Input}
                            />
                        </FormItem>
                    </FormContainer>

                    <FormItem label="Coupon Type">
                        <Select
                            isClearable
                            className="xl:w-1/2 mt-7 w-full"
                            options={DiscountType}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.value}
                            value={DiscountType.find((option: any) => option.value === values.coupon_type) || null}
                            onChange={(selectedOption) => {
                                const newValue: string = selectedOption?.value || ''
                                setFieldValue('coupon_type', newValue)
                            }}
                        />{' '}
                    </FormItem>

                    <CommonMultiSelect
                        needCss
                        label="Applicable categories"
                        name="extra_attributes.applicable_categories"
                        options={ApplicableCategoriesArray}
                        className=" mt-7 w-full"
                        setFieldValue={setFieldValue}
                    />

                    {COUPON_SERIES_FORM.slice(5).map((item, key) => (
                        <FormItem key={key} label={item.label} className={item.classname}>
                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                        </FormItem>
                    ))}
                </FormContainer>
            </FormContainer>
        </Form>
    )
}

export default CouponSeriesForm
