/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OfferFormTypes } from '../../offerEngineCommon'
import { useOfferFunctions } from '../offersUtils/useOfferFunctions'
import OfferFormStep1 from '../offersUtils/OfferFormStep1'
import OfferFormStep2 from '../offersUtils/OfferFormStep2'
import { offersService } from '@/store/services/offersService'
import { notification } from 'antd'
import { filterEmptyValues, getChangedValues } from '@/utils/apiBodyUtility'
import { offerBodyFile } from '../offersUtils/offersCommon'

const OffersEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [offersData, setOffersData] = useState<OfferFormTypes | null>(null)
    const [buyFilterId, setBuyFilterId] = useState<any>('')
    const [getFilterId, setGetFilterId] = useState<any>('')
    const [currentStep, setCurrentStep] = useState(0)
    const [editOffer, offerResponse] = offersService.useOffersEditMutation()
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
            navigate(-1)
        }
        if (offerResponse.isError) {
            notification.error({ message: (offerResponse?.error as any)?.data?.body?.message || 'Something went wrong' })
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

    const handleSubmit = async (values: any) => {
        const { body } = offerBodyFile(values)
        const filteredBody = filterEmptyValues(body)
        const changedValues = getChangedValues(initialValues, filteredBody as any)

        const bodyToSend = {
            ...changedValues,
            buy_filter_id: buyFilterId || null,
            get_filter_id: values?.is_same_as_buy_filter ? values?.buy_filter_id : getFilterId || null,
        }

        if (Object.keys(changedValues).length === 0) {
            notification.info({
                message: 'No changes detected',
                description: 'You have not modified any fields.',
            })
            return
        }

        const finalPayload = { id: Number(id), ...bodyToSend }

        await editOffer(finalPayload)
    }

    return (
        <div>
            <div className="bg-gray-50 rounded-2xl">
                <div className="mb-10">
                    <Steps current={currentStep} className="flex flex-col items-start xl:flex-row">
                        {['Offer Details', 'Discount Options'].map((stepTitle, index) => (
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
