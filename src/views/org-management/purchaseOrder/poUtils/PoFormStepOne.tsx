import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import React from 'react'
import { PoFormFieldArray, PoNatureOption, SpecialTermsOption } from './poFormCommon'
import { Field } from 'formik'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import FullDateForm from '@/common/FullDateForm'

const PoFormStepOne = () => {
    return (
        <FormContainer className="mt-8 grid grid-cols-2 gap-2">
            {PoFormFieldArray?.map((item, idx) => {
                return (
                    <FormItem key={idx} label={item?.label} asterisk={item?.is_required}>
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
            <CommonSelect label="Special Terms" name="special_terms" options={SpecialTermsOption()} />
        </FormContainer>
    )
}

export default PoFormStepOne
