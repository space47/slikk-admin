/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import React from 'react'
import { CategoryMailOptions, CategoryNameOptions, CategoryNumberOptions, SellerInternalArray } from '../sellerUtils/sellerFormCommon'
import { Field } from 'formik'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { SellerKeys } from '../sellerCommon'

const SellerInternal = () => {
    return (
        <div>
            <h4>POC Internal Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                <CommonSelect asterisk label="Head Name" name={SellerKeys.INT_POC_NAME} options={CategoryNameOptions} />
                <CommonSelect asterisk label="Head Email" name={SellerKeys.INT_POC_EMAIL} options={CategoryMailOptions} />
                <CommonSelect asterisk label="Head Number" name={SellerKeys.INT_POC_CONTACT} options={CategoryNumberOptions} />

                {SellerInternalArray?.map((item, idx) => {
                    return (
                        <FormItem key={idx} label={item?.label} asterisk={item?.isRequired}>
                            <Field
                                type={item?.type}
                                name={item?.name}
                                placeholder={`Enter ${item?.label}`}
                                component={item?.type === 'checkbox' ? Switcher : Input}
                            />
                        </FormItem>
                    )
                })}
            </FormContainer>
        </div>
    )
}

export default SellerInternal
