import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React from 'react'
import { PocDetails, PocDetailsAdd } from '../sellerUtils/sellerFormCommon'
import { handlePhoneInputValidation } from '../sellerUtils/sellerFunctions'

interface Props {
    isAdd?: boolean
}

const SellerPocDetails = ({ isAdd }: Props) => {
    const phoneFields = ['contact_number', 'alternate_contact_number', 'finance_contact_number']
    const fieldsData = isAdd ? PocDetailsAdd : PocDetails

    return (
        <div className="w-full">
            <h4>POC Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                {fieldsData?.map((item, idx) => {
                    return (
                        <FormItem key={idx} label={item?.label} asterisk={item?.isRequired}>
                            <Field
                                type={item?.type}
                                name={item?.name}
                                placeholder={`Enter ${item?.label}`}
                                component={Input}
                                {...(phoneFields.includes(item?.name ?? '') ? { onInput: handlePhoneInputValidation } : {})}
                            />
                        </FormItem>
                    )
                })}
            </FormContainer>
        </div>
    )
}

export default SellerPocDetails
