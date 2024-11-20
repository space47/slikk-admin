/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field, FieldArray } from 'formik'
import React from 'react'
import { TierOffer } from './LoyaltyCommon'

interface OfferProps {
    values: any
}

const LoyaltyAddoffer = ({ values }: OfferProps) => {
    return (
        <FormContainer>
            <h3 className="text-lg font-medium mb-4">Tier Upgrade Offer</h3>
            <FieldArray name="tier_upgrade_offer">
                {() => {
                    return values?.tier_upgrade_offer?.map((item: any, index: any) => (
                        <div key={index} className="mb-4 ">
                            <div className="w-[200px]">
                                <CommonSelect
                                    name={`tier_upgrade_offer[${index}].type`}
                                    label="Select Tier Type"
                                    options={TierOffer}
                                    className="w-1/2 mb-4"
                                />
                            </div>
                            <FormContainer className="grid grid-cols-2 gap-3">
                                <FormItem label="Value">
                                    <Field
                                        name={`tier_upgrade_offer[${index}].value`}
                                        placeholder="Enter Value"
                                        component={Input}
                                        className="w-1/2"
                                    />
                                </FormItem>
                                <FormItem label="Max Discount">
                                    <Field
                                        name={`tier_upgrade_offer[${index}].max_discount`}
                                        placeholder="Enter Max Discount"
                                        component={Input}
                                        className="w-1/2"
                                    />
                                </FormItem>
                                <FormItem label="Min Discount">
                                    <Field
                                        name={`tier_upgrade_offer[${index}].min_discount`}
                                        placeholder="Enter Min Discount"
                                        component={Input}
                                        className="w-1/2"
                                    />
                                </FormItem>
                                <FormItem label="Max Order Value">
                                    <Field
                                        name={`tier_upgrade_offer[${index}].max_order_value`}
                                        placeholder="Enter Max Order Value"
                                        component={Input}
                                        className="w-1/2"
                                    />
                                </FormItem>
                                <FormItem label="Min Order Value">
                                    <Field
                                        name={`tier_upgrade_offer[${index}].min_order_value`}
                                        placeholder="Enter Min Order Value"
                                        component={Input}
                                        className="w-1/2"
                                    />
                                </FormItem>
                            </FormContainer>
                        </div>
                    ))
                }}
            </FieldArray>
        </FormContainer>
    )
}

export default LoyaltyAddoffer
