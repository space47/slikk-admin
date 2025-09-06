/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
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
                <CommonSelect
                    needClassName
                    className="w-1/2"
                    options={OfferDiscountType}
                    name="discount_type"
                    label="Discount Type(X Type)"
                />
                <FormContainer className="grid grid-cols-3 gap-6">
                    {offersFormList?.slice(0, 5)?.map((item, key) => {
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
                    {values?.discount_type === 'BXGY' && (
                        <FormItem label="Buy Quantity">
                            <Field name=" buy_quantity" placeholder="Enter Buy Quantity" type="number" component={Input} />
                        </FormItem>
                    )}
                    {values?.discount_type !== 'BXGY' && (
                        <>
                            <FormItem label="Min Item Quantity">
                                <Field name="min_order_quantity" placeholder="Enter Min Order Quantity" type="number" component={Input} />
                            </FormItem>
                            <FormItem label="Max Item Quantity">
                                <Field name="max_order_quantity" placeholder="Enter Max Order Quantity" type="number" component={Input} />
                            </FormItem>
                        </>
                    )}
                </FormContainer>

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
                            label="Get(Y) Reward Type"
                        />
                        <FormItem label="Is Same as Buy Filter">
                            <Field
                                name="is_same_as_buy_filter"
                                component={Checkbox}
                                type="checkbox"
                                className="w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                            />
                        </FormItem>
                        <FormContainer className="grid grid-cols-3 gap-6">
                            {offersFormList?.slice(5)?.map((item, key) => {
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
