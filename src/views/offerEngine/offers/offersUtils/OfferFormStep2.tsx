/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import { APPLY_TYPE, GET_REWARD_TYPE, GetTypesList, OfferDiscountType, offersFormList } from './offersCommon'
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
                <FormContainer className="grid grid-cols-2 gap-6">
                    <FormItem label="Max Product Discount">
                        <Field
                            name="product_max_discount_amount"
                            placeholder="Enter Max Product Discount"
                            type="number"
                            component={Input}
                            className="w-full"
                        />
                    </FormItem>
                    <CommonSelect
                        needClassName
                        className={values?.discount_type === 'BXGY' ? 'w-full' : 'w-1/2'}
                        options={OfferDiscountType}
                        name="discount_type"
                        label="Offer Type(X Type)"
                    />
                    {values?.discount_type === 'BXGY' && (
                        <FormItem label="Buy Quantity(X)">
                            <Field
                                name="buy_quantity"
                                placeholder="Enter Buy Quantity"
                                type="number"
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                    )}
                </FormContainer>
                <div className="w-1/3">
                    <CommonSelect label="Apply Type" name="apply_type" options={APPLY_TYPE} />
                </div>
                {values?.discount_type !== 'BXGY' && (
                    <FormContainer className="grid grid-cols-3 gap-6">
                        <FormItem label="Discount Value">
                            <Field name="discount_value" placeholder="Enter Discount Value" type="number" component={Input} />
                        </FormItem>

                        <FormItem label="Min Item Quantity">
                            <Field name="min_order_quantity" placeholder="Enter Min Order Quantity" type="number" component={Input} />
                        </FormItem>
                        <FormItem label="Max Item Quantity">
                            <Field name="max_order_quantity" placeholder="Enter Max Order Quantity" type="number" component={Input} />
                        </FormItem>

                        {offersFormList?.map((item, key) => {
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
                )}

                <FormItem label="Buy Filter" asterisk={true}>
                    <MultiFilterSelect
                        isCsv
                        isSku
                        setFilterId={handleSetBuyFilterId}
                        filterId={buyFilterId as string}
                        fieldName="buyFilter"
                        values={values}
                    />
                </FormItem>
                <hr />
                {values?.discount_type === 'BXGY' && (
                    <>
                        <FormItem className="flex justify-between items-center mt-0 font-bold text-xl">Y Discount Options</FormItem>
                        <CommonSelect
                            needClassName
                            className="w-1/2"
                            options={GET_REWARD_TYPE}
                            name="get_reward_type"
                            label="Get(Y) Discount Type"
                        />

                        <FormContainer className="grid grid-cols-3 gap-6">
                            {GetTypesList?.map((item, key) => {
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
                        <FormItem label="Is Same as Buy Filter">
                            <Field
                                name="is_same_as_buy_filter"
                                component={Checkbox}
                                type="checkbox"
                                className="w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                            />
                        </FormItem>
                        <FormItem label="Y Filter" asterisk={true}>
                            <MultiFilterSelect
                                isCsv
                                isSku
                                setFilterId={handleSetGetFilterId}
                                filterId={getFilterId as string}
                                fieldName="getFilter"
                                values={values}
                            />
                        </FormItem>
                    </>
                )}
            </FormContainer>
        </div>
    )
}

export default OfferFormStep2
