/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import OfferFormStep1 from '../offersUtils/OfferFormStep1'
import OfferFormStep2 from '../offersUtils/OfferFormStep2'
import { offersService } from '@/store/services/offersService'
import { notification } from 'antd'

const OffersAdd = () => {
    const [buyFilterId, setBuyFilterId] = useState<string | undefined>(undefined)
    const [getFilterId, setGetFilterId] = useState<string | undefined>(undefined)
    const [currentStep, setCurrentStep] = useState(0)

    const [addOffers, offerResponse] = offersService.useOffersAddMutation()

    useEffect(() => {
        if (offerResponse.isSuccess) {
            console.log('offerResponse', offerResponse)
            notification.success({ message: offerResponse?.data?.message || 'Offer added successfully' })
            setCurrentStep(0)
        }
        if (offerResponse.isError) {
            notification.error({ message: (offerResponse?.error as any)?.data?.message || 'Something went wrong' })
            console.log('offerResponse error', offerResponse)
        }
    }, [offerResponse])

    const handleSubmit = async (values: any) => {
        if (
            !values?.offer_name ||
            !values?.slab_id ||
            !values?.discount_type ||
            !values?.discount_value ||
            !values?.start_date ||
            !values?.end_date ||
            !values?.buy_quantity ||
            !values?.buy_filter_id
        ) {
            notification.error({ message: 'Incomplete fields' })
            return
        }

        console.log(values)
        const body = {
            offer_name: values?.offer_name, // mandatory
            store_ids: values?.store?.id ? [values?.store?.id] : [], // mandatory
            slab_id: values?.slab_id, // mandatory
            apply_type: values?.apply_type, // PRODUCT / USER
            discount_type: values?.discount_type, //PERCENTAGE FLAT BXGY  // mandatory
            discount_value: values?.discount_value, // mandatory
            min_purchase_amount: values?.min_purchase_amount,
            max_discount_amount: values?.max_discount_amount,
            start_date: values?.start_date, // mandatory
            end_date: values?.end_date, // mandatory
            is_active: values?.is_active || false,
            min_order_quantity: values?.min_order_quantity,
            max_order_quantity: values?.max_order_quantity,
            is_multi_unit_eligible: values?.is_multi_unit_eligible || false,
            set_size: values?.set_size,
            max_sets: values?.max_sets,
            buy_quantity: values?.buy_quantity, // mandatory
            buy_filter_id: values?.buy_filter_id || buyFilterId, // mandatory
            get_quantity: values?.get_quantity,
            get_filter_id: values?.get_filter_id || getFilterId,
            get_reward_type: values?.get_reward_type, //PERCENTAGE / FLAT / CONSTANT_PRICE
            get_reward_value: values?.get_reward_value,
            daily_time_windows: values?.daily_time_windows?.length
                ? values?.daily_time_windows?.map((timeWindow: any) => ({
                      start_time: timeWindow?.start_time,
                      end_time: timeWindow?.end_time,
                  }))
                : [],
        }

        console.log('body', body)
        await addOffers(body)
    }

    return (
        <div>
            <div className="bg-gray-50 rounded-2xl">
                <div className="mb-10">
                    <Steps current={currentStep} className="flex flex-col items-start xl:flex-row">
                        {['Names', 'Type'].map((stepTitle, index) => (
                            <Steps.Item
                                key={index}
                                title={
                                    <span
                                        className={`p-2 rounded-md ${
                                            currentStep === index
                                                ? 'text-green-500 font-bold bg-gray-200 px-2 py-2 rounded-md text-xl'
                                                : 'text-inherit font-normal'
                                        }`}
                                    >
                                        {stepTitle}
                                    </span>
                                }
                            />
                        ))}
                    </Steps>
                </div>
                <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                    {({ values }) => (
                        <Form className="w-full shadow-xl p-3 rounded-2xl ">
                            {currentStep === 0 && (
                                <FormContainer className="">
                                    <OfferFormStep1 values={values} />
                                </FormContainer>
                            )}
                            {currentStep === 1 && (
                                <FormContainer className="">
                                    <OfferFormStep2
                                        buyFilterId={buyFilterId as string}
                                        getFilterId={getFilterId as string}
                                        setBuyFilterId={setBuyFilterId}
                                        setGetFilterId={setGetFilterId}
                                        values={values}
                                    />
                                </FormContainer>
                            )}
                            <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                                {currentStep > 0 && currentStep < 1 && (
                                    <Button
                                        type="button"
                                        variant="pending"
                                        className="mr-2 bg-gray-600"
                                        onClick={() => setCurrentStep((prev) => prev - 1)}
                                    >
                                        Previous
                                    </Button>
                                )}
                                {currentStep === 0 && (
                                    <Button
                                        type="button"
                                        variant="accept"
                                        className="mr-2 bg-gray-600"
                                        onClick={() => setCurrentStep((prev) => prev + 1)}
                                    >
                                        Next
                                    </Button>
                                )}
                            </FormContainer>

                            <FormContainer className="flex justify-start">
                                {currentStep === 1 && (
                                    <div className="flex">
                                        <Button
                                            type="button"
                                            variant="pending"
                                            className="mr-2 mt-5 bg-gray-600"
                                            onClick={() => setCurrentStep((prev) => prev - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex gap-20 mt-5">
                                            <FormContainer>
                                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                                    Update Offer
                                                </Button>
                                            </FormContainer>
                                        </div>
                                    </div>
                                )}
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default OffersAdd
