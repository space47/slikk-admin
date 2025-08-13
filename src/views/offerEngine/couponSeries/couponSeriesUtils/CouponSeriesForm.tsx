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

interface CouponProps {
    values: any
    ACTIONARRAY?: any
    userAction?: any
    setUserAction?: any
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
        <Form className="">
            <FormContainer>
                <FormContainer className="grid grid-cols-1 xl:grid-cols-2 gap-10 ">
                    {COUPON_SERIES_FORM.slice(0, 5).map((item, key) => (
                        <FormItem key={key} className={item.classname}>
                            <div className="flex gap-2">
                                <FormItem label={item.label}></FormItem>{' '}
                                {item?.tooltip && (
                                    <Tooltip title={item.tooltip}>
                                        <CiCircleQuestion className="text-yellow-800 text-xl" />
                                    </Tooltip>
                                )}
                            </div>
                            <Field
                                type={item.type}
                                name={item.name}
                                placeholder={item.placeholder}
                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                min={item?.min || 0}
                            />
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
                                    value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
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
                                    value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                    onChange={(value) => {
                                        form.setFieldValue('valid_to', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                    }}
                                />
                            )}
                        </Field>
                    </FormItem>

                    <FormItem label="Coupon Type" className="col-span-1 w-full">
                        <Field name="coupon_type">
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

                    <FormItem label="Discount Type">
                        <Select
                            isClearable
                            className="xl:w-1/2 mt-7 w-full"
                            options={DiscountType}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.value}
                            value={DiscountType.find((option: any) => option.value === values.discount_type) || null}
                            onChange={(selectedOption) => {
                                const newValue: string = selectedOption?.value || ''
                                setFieldValue('discount_type', newValue)
                            }}
                        />
                    </FormItem>
                    <FormItem label="Series Type">
                        <Select
                            isClearable
                            className="xl:w-1/2 mt-7 w-full"
                            options={SeriesType}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.value}
                            value={SeriesType.find((option: any) => option.value === values.series_type) || null}
                            onChange={(selectedOption) => {
                                const newValue: string = selectedOption?.value || ''
                                setFieldValue('series_type', newValue)
                            }}
                        />
                    </FormItem>

                    {values?.series_type === 'event' && (
                        <>
                            <GetEvenNames label="Coupon Issued on Event" name="event_name" />
                            <GetEvenNames label="Coupon Activation on Event" name="coupon_active_event_name" />
                        </>
                    )}

                    <div>
                        <CommonFilterSelect filterId={filterValue} setFilterId={setFilterId} />
                    </div>
                    <div>
                        <CommonFilterSelect isExclude filterId={excludeFilterValue} setFilterId={setExcludeFilterId} />
                    </div>

                    {COUPON_SERIES_FORM.slice(5).map((item, key) => (
                        <FormItem key={key} className={item.classname}>
                            <div className="flex gap-2">
                                <FormItem label={item.label}></FormItem>{' '}
                                {item?.tooltip && (
                                    <Tooltip title={item.tooltip}>
                                        <CiCircleQuestion className="text-yellow-800 text-xl" />
                                    </Tooltip>
                                )}
                            </div>
                            <Field
                                type={item.type}
                                name={item.name}
                                placeholder={item.placeholder}
                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                min={item?.min || 0}
                            />
                        </FormItem>
                    ))}
                </FormContainer>
            </FormContainer>
        </Form>
    )
}

export default CouponSeriesForm
