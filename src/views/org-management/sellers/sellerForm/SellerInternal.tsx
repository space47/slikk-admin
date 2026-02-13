import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import React from 'react'
import { SellerInternalArray } from '../sellerUtils/sellerFormCommon'
import { Field } from 'formik'
import { handlePhoneInputValidation } from '../sellerUtils/sellerFunctions'

const SellerInternal = () => {
    const phoneFields = ['int_poc_number', 'int_ops_number']

    return (
        <div>
            <h4>POC Internal Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                {SellerInternalArray?.map((item, idx) => {
                    return (
                        <FormItem key={idx} label={item?.label} asterisk={item?.isRequired}>
                            <Field
                                type={item?.type}
                                name={item?.name}
                                placeholder={`Enter ${item?.label}`}
                                component={item?.type === 'checkbox' ? Switcher : Input}
                                {...(phoneFields.includes(item?.name ?? '') ? { onInput: handlePhoneInputValidation } : {})}
                            />
                        </FormItem>
                    )
                })}
            </FormContainer>
        </div>
    )
}

export default SellerInternal
