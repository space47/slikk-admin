import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import React from 'react'
import { BasicSellerInformation } from '../sellerUtils/sellerFormCommon'
import { Field } from 'formik'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'

import { handlePhoneInputValidation } from '../sellerUtils/sellerFunctions'

const SellerStepOne = () => {
    return (
        <div>
            <h4>Basic Information</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                {BasicSellerInformation?.map((item, idx) => {
                    return (
                        <FormItem key={idx} label={item?.label} asterisk={item?.isRequired}>
                            <Field
                                type={item?.type}
                                name={item?.name}
                                placeholder={`Enter ${item?.label}`}
                                component={item?.type === 'checkbox' ? Switcher : Input}
                                {...(item?.name === 'head_contact' ? { onInput: handlePhoneInputValidation } : {})}
                            />
                        </FormItem>
                    )
                })}
                {/* <CommonSelect asterisk name="segment" label="Fashion Style" options={FashionStyleOptions} /> */}
            </FormContainer>
        </div>
    )
}

export default SellerStepOne
