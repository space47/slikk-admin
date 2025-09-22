/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Select, Tooltip, Upload } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import { RichTextEditor } from '@/components/shared'
import { DatePicker } from 'antd'
import { beforeUpload } from '@/common/beforeUpload'
import { COUPON_SERIES_FORM } from '../couponSeriesCommon'
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { CiCircleQuestion } from 'react-icons/ci'
import dayjs from 'dayjs'
import GetEvenNames from '@/common/GetEvenNames'
import StoreSelectForm from '@/common/StoreSelectForm'

interface CouponProps {
    values: any
    setFieldValue: any
    resetForm: any
    isEdit?: any
    setFilterId?: any
    filterValue?: any
    setExcludeFilterId?: any
    excludeFilterValue?: any
}

const DiscountType = [
    { name: 'PERCENT_OFF', value: 'PERCENT_OFF' },
    { name: 'FLAT_OFF', value: 'FLAT_OFF' },
    { name: 'BXGY', value: 'BXGY' },
]
const SeriesType = [
    { name: 'PROMOTION', value: 'promotion' },
    { name: 'EVENT', value: 'event' },
]

const CouponsType = () => {
    return ['PERIODIC', 'COUPON', 'REFERRER', 'REFEREE'].map((coupon) => ({
        label: coupon,
        value: coupon,
    }))
}

const CouponSeriesForm = ({ values, setFieldValue, setFilterId, filterValue, setExcludeFilterId, excludeFilterValue }: CouponProps) => {
    return (
        <Form className="w-full">
            <FormContainer className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* First 5 Fields */}
                {COUPON_SERIES_FORM.slice(0, 5).map((item, key) => (
                    <FormItem key={key} label={item.label} className={item.classname}>
                        <div className="flex items-center gap-2 mb-2">
                            {item?.tooltip && (
                                <Tooltip title={item.tooltip}>
                                    <CiCircleQuestion className="text-yellow-600 text-lg" />
                                </Tooltip>
                            )}
                        </div>
                        <Field
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                            min={item?.min || 0}
                            className="w-full"
                        />
                    </FormItem>
                ))}

                {/* Rich Text Editor */}
                <FormItem label="Description" className="col-span-2">
                    <Field name="description">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>
                <FormItem label="T&C" className="col-span-2">
                    <Field name="extra_attributes.terms_and_conditions">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>

                {/* Date Pickers */}
                <FormItem label="Valid From">
                    <Field name="valid_from">
                        {({ field, form }: any) => (
                            <DatePicker
                                showTime
                                className="w-full"
                                value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                onChange={(value) => form.setFieldValue('valid_from', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')}
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem label="Valid To">
                    <Field name="valid_to">
                        {({ field, form }: any) => (
                            <DatePicker
                                showTime
                                className="w-full"
                                value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                onChange={(value) => form.setFieldValue('valid_to', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')}
                            />
                        )}
                    </Field>
                </FormItem>

                {/* Coupon Type */}
                <FormItem label="Coupon Type">
                    <Field name="coupon_type">
                        {({ field, form }: FieldProps) => (
                            <Select
                                {...field}
                                className="w-full"
                                value={CouponsType().find((option: any) => option.value === field.value)}
                                options={CouponsType()}
                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                            />
                        )}
                    </Field>
                </FormItem>

                {/* Image Upload Section */}
                <FormContainer className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-blue-700 font-semibold text-center mb-4">Upload Image</div>

                    <FormItem>
                        <Field name="imageArray">
                            {({ form }: FieldProps) => (
                                <Upload
                                    multiple
                                    className="flex justify-center"
                                    beforeUpload={beforeUpload}
                                    fileList={values.imageArray}
                                    onChange={(files) => form.setFieldValue('imageArray', files)}
                                    onFileRemove={(files) => form.setFieldValue('imageArray', files)}
                                />
                            )}
                        </Field>
                    </FormItem>

                    <FormItem className="mt-4">
                        <Field
                            type="text"
                            name="image"
                            placeholder="Drop an Image URL or Upload a File 💾"
                            component={Input}
                            className="w-full"
                        />
                    </FormItem>
                </FormContainer>

                {/* Discount + Series Type */}
                <FormItem label="Discount Type">
                    <Select
                        isClearable
                        className="w-full"
                        options={DiscountType}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.value}
                        value={DiscountType.find((option: any) => option.value === values.discount_type) || null}
                        onChange={(selectedOption) => setFieldValue('discount_type', selectedOption?.value || '')}
                    />
                </FormItem>

                <FormItem label="Series Type">
                    <Select
                        isClearable
                        className="w-full"
                        options={SeriesType}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.value}
                        value={SeriesType.find((option: any) => option.value === values.series_type) || null}
                        onChange={(selectedOption) => setFieldValue('series_type', selectedOption?.value || '')}
                    />
                </FormItem>

                <FormItem label=" Y Discount Type">
                    <Select
                        isClearable
                        className="w-full"
                        options={DiscountType}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.value}
                        value={
                            DiscountType.find((option: any) => option.value === values?.extra_attributes?.bxgy_config?.y_discount_type) ||
                            null
                        }
                        onChange={(selectedOption) =>
                            setFieldValue('extra_attributes.bxgy_config.y_discount_type', selectedOption?.value || '')
                        }
                    />
                </FormItem>

                {/* Event-based fields */}
                {values?.series_type === 'event' && (
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GetEvenNames label="Coupon Issued on Event" name="event_name" />
                        <GetEvenNames label="Coupon Activation on Event" name="coupon_active_event_name" />
                    </div>
                )}

                {/* Store & Filters */}
                <StoreSelectForm name="store" label="Store" />

                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CommonFilterSelect filterId={filterValue} setFilterId={setFilterId} />
                    <CommonFilterSelect isExclude filterId={excludeFilterValue} setFilterId={setExcludeFilterId} />
                </div>

                {/* Remaining Fields */}
                {COUPON_SERIES_FORM.slice(5).map((item, key) => (
                    <FormItem key={key} label="" className={item.classname}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            {item?.tooltip && (
                                <Tooltip title={item.tooltip}>
                                    <CiCircleQuestion className="text-yellow-600 text-lg" />
                                </Tooltip>
                            )}
                        </div>
                        <Field
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                            min={item?.min || 0}
                            className="w-full"
                        />
                    </FormItem>
                ))}
            </FormContainer>
        </Form>
    )
}

export default CouponSeriesForm
