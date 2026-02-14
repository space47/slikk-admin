import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import React from 'react'
import { IndianStateCodes, PoFormFieldArray, PoNatureOption } from './poFormCommon'
import { Field, FieldProps } from 'formik'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import FullDateForm from '@/common/FullDateForm'
import WarehouseSelect from '@/common/WarehouseSelect'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'

const PoFormStepOne = () => {
    return (
        <FormContainer className="mt-8 grid grid-cols-2 gap-2">
            <WarehouseSelect isSingle label="Select Vendor Warehouse" name="warehouse_id" customCss="w-auto w-full" />
            <CommonSelect label="State Code" name="state_code" options={IndianStateCodes} />
            {PoFormFieldArray?.map((item, idx) => {
                return (
                    <FormItem key={idx} label={item?.label}>
                        <Field
                            type={item?.type}
                            name={item?.name}
                            placeholder={`Enter ${item?.label}`}
                            component={item?.type === 'checkbox' ? Switcher : Input}
                        />
                    </FormItem>
                )
            })}
            {/* <FullDateForm
                fieldname="expected_delivery_date"
                label="Expected Delivery Date"
                name="expected_delivery_date"
                customCss="w-full"
            /> */}
            <FormItem label="Expected Delivery Date">
                <Field name="expected_delivery_date">
                    {({ field, form }: FieldProps) => {
                        const dateValue = field.value ? dayjs(field.value) : null

                        return (
                            <DatePicker
                                placeholder=""
                                className="w-1/2"
                                value={dateValue && dateValue.isValid() ? dateValue : null}
                                onChange={(value) => {
                                    form.setFieldValue('expected_delivery_date', value ? value.format('YYYY-MM-DD') : '')
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
            <CommonSelect label="Po Nature" name="po_nature" options={PoNatureOption()} />
        </FormContainer>
    )
}

export default PoFormStepOne
