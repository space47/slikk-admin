/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import { GET_REWARD_TYPE, OfferDiscountType, offersFormList } from './offersCommon'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field } from 'formik'
import MultiFilterSelect from '@/common/MultipleFilterSelect'

interface props {
    buyFilterId: string | null
    getFilterId: string | null
    setBuyFilterId: (id: string | undefined) => void
    setGetFilterId: (id: string | undefined) => void
    values: any
}

const OfferFormStep2 = ({ buyFilterId, getFilterId, setBuyFilterId, setGetFilterId, values }: props) => {
    const handleSetBuyFilterId = (id: string) => {
        setBuyFilterId(id)
    }

    const handleSetGetFilterId = (id: string) => {
        setGetFilterId(id)
    }

    return (
        <div>
            <FormContainer>
                <CommonSelect needClassName className="w-1/2" options={OfferDiscountType} name="discount_type" label="Discount Type" />
                <FormContainer className="grid grid-cols-3 gap-6">
                    {offersFormList?.slice(0, 8)?.map((item, key) => {
                        return (
                            <FormItem label={item.label} asterisk={item?.required} key={key}>
                                <Field
                                    name={item.name}
                                    component={item.type === 'checkbox' ? Checkbox : Input}
                                    placeholder={`Enter ${item.label}`}
                                    type={item.type}
                                />
                            </FormItem>
                        )
                    })}
                </FormContainer>
                <FormItem label="Buy Filter" asterisk={true}>
                    <MultiFilterSelect setFilterId={handleSetBuyFilterId} filterId={buyFilterId as string} fieldName="buyFilter" />
                </FormItem>
                <hr />
                {values?.discount_type === 'BXGY' && (
                    <>
                        <FormItem className="flex justify-between items-center mt-0 font-bold text-xl">Get Data</FormItem>
                        <CommonSelect
                            needClassName
                            className="w-1/2"
                            options={GET_REWARD_TYPE}
                            name="get_reward_type"
                            label="Get Reward Type"
                        />
                        <FormContainer className="grid grid-cols-3 gap-6">
                            {offersFormList?.slice(8)?.map((item, key) => {
                                return (
                                    <FormItem label={item.label} asterisk={item?.required} key={key}>
                                        <Field
                                            name={item.name}
                                            component={item.type === 'checkbox' ? Checkbox : Input}
                                            placeholder={`Enter ${item.label}`}
                                            type={item.type}
                                        />
                                    </FormItem>
                                )
                            })}
                        </FormContainer>
                        <FormItem label="Get Filter" asterisk={true}>
                            <MultiFilterSelect setFilterId={handleSetGetFilterId} filterId={getFilterId as string} fieldName="getFilter" />
                        </FormItem>
                    </>
                )}
            </FormContainer>
        </div>
    )
}

export default OfferFormStep2
