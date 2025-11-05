import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React from 'react'
import { PocDetails } from '../sellerUtils/sellerFormCommon'

const SellerPocDetails = () => {
    return (
        <div className="w-full">
            <h4>POC Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                {PocDetails?.map((item, idx) => {
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

export default SellerPocDetails
