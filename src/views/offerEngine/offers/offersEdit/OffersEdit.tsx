/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { OfferFormTypes } from '../../offerEngineCommon'
import { useOfferFunctions } from '../offersUtils/useOfferFunctions'
import { getChangedValues } from '@/common/objectDiff'
import OfferFormStep1 from '../offersUtils/OfferFormStep1'
import OfferFormStep2 from '../offersUtils/OfferFormStep2'
import { offersService } from '@/store/services/offersService'
import { notification } from 'antd'

const OffersEdit = () => {
    const { id } = useParams()
    const [offersData, setOffersData] = useState<OfferFormTypes | null>(null)
    const [buyFilterId, setBuyFilterId] = useState<any>(undefined)
    const [getFilterId, setGetFilterId] = useState<any>(undefined)
    const [currentStep, setCurrentStep] = useState(0)
    const [editOffer, offerResponse] = offersService.useOffersEditMutation()
    const initialValuesRef = useRef<any>(null)
    const { data, isSuccess } = offersService.useOffersDetailQuery(
        {
            id: id as string,
        },
        { skip: !id },
    )

    useEffect(() => {
        if (isSuccess) {
            setOffersData(data?.body?.data || null)
        }
    }, [id, data, isSuccess])

    useEffect(() => {
        if (offerResponse.isSuccess) {
            console.log('offerResponse', offerResponse)
            notification.success({ message: offerResponse?.data?.message || 'Offer updated successfully' })
            setCurrentStep(0)
        }
        if (offerResponse.isError) {
            notification.error({ message: (offerResponse?.error as any)?.data?.message || 'Something went wrong' })
            console.log('offerResponse error', offerResponse)
        }
    }, [offerResponse])

    useEffect(() => {
        if (offersData) {
            setBuyFilterId(offersData?.buy_filter_id as number)
            setGetFilterId(offersData?.get_filter_id as number)
        }
    }, [offersData])

    const { initialValues } = useOfferFunctions({ offersData })

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            initialValuesRef.current = { ...initialValues }
        }
    }, [initialValues])

    const handleSubmit = async (values: any) => {
        if (!initialValuesRef.current) return

        const mandatoryFields = {
            offer_name: values?.offer_name,
            store_ids: values?.store?.id ? [values?.store?.id] : [],
            slab_id: values?.slab_id,
            discount_type: values?.discount_type,
            discount_value: values?.discount_value,
            start_date: values?.start_date,
            end_date: values?.end_date,
            buy_quantity: values?.buy_quantity,
            buy_filter_id: values?.buy_filter_id || buyFilterId,
        }

        const changedValues = getChangedValues(values, initialValuesRef.current)

        const finalPayload = {
            id: id,
            ...mandatoryFields,
            ...changedValues,
        }

        await editOffer({ finalPayload })
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
                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
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
                                        buyFilterId={buyFilterId}
                                        getFilterId={getFilterId}
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

export default OffersEdit
