import { FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import { BasicSellerInformation } from '../sellerUtils/sellerFormCommon'
import { Field } from 'formik'

const SellerStepOne = () => {
    return (
        <div>
            <h4>Basic Information</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer>
                {BasicSellerInformation?.map((item, idx) => {
                    return (
                        <FormItem key={idx} label={item?.label} asterisk={item?.isRequired}>
                            <Field type={item?.type} name={item?.name} placeholder={`Enter ${item?.label}`} component={Input} />
                        </FormItem>
                    )
                })}
            </FormContainer>
        </div>
    )
}

export default SellerStepOne
