import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import React from 'react'
import { IndianStateCodes, PoFormFieldArray, PoNatureOption } from './poFormCommon'
import { Field } from 'formik'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import FullDateForm from '@/common/FullDateForm'
import WarehouseSelect from '@/common/WarehouseSelect'

const PoFormStepOne = () => {
    return (
        <FormContainer className="mt-8 grid grid-cols-2 gap-2">
            <WarehouseSelect isSingle label="Select Vendor Warehouse" name="warehouse_id" customCss="xl:w-[700px] w-full" />
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
            <FullDateForm
                fieldname="expected_delivery_date"
                label="Expected Delivery Date"
                name="expected_delivery_date"
                customCss="w-full"
            />
            <CommonSelect label="Po Nature" name="po_nature" options={PoNatureOption()} />
        </FormContainer>
    )
}

export default PoFormStepOne
