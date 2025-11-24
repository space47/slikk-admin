/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import OfferFormStep1 from '../offersUtils/OfferFormStep1'
import OfferFormStep2 from '../offersUtils/OfferFormStep2'
import { offersService } from '@/store/services/offersService'
import { notification } from 'antd'
import { offerBodyFile } from '../offersUtils/offersCommon'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { useNavigate } from 'react-router-dom'

const OffersAdd = () => {
    const navigate = useNavigate()
    const [buyFilterId, setBuyFilterId] = useState<string | undefined>(undefined)
    const [getFilterId, setGetFilterId] = useState<string | undefined>(undefined)
    const [currentStep, setCurrentStep] = useState(0)

    const [addOffers, offerResponse] = offersService.useOffersAddMutation()

    const initialValue = {
        is_active: true,
    }

    useEffect(() => {
        if (offerResponse.isSuccess) {
            console.log('offerResponse', offerResponse)
            notification.success({ message: offerResponse?.data?.message || 'Offer added successfully' })
            navigate(-1)
        }
        if (offerResponse.isError) {
            notification.error({ message: (offerResponse?.error as any)?.data?.body?.message || 'Something went wrong' })
            console.log('offerResponse error', offerResponse)
        }
    }, [offerResponse])

    const handleSubmit = async (values: any) => {
        console.log(values)
        const { body } = offerBodyFile(values)
        const filteredBody = filterEmptyValues(body)

        const bodyToSend = {
            ...filteredBody,
            buy_filter_id: buyFilterId || null,
            get_filter_id: values?.is_same_as_buy_filter ? values?.buy_filter_id : getFilterId || null,
        }

        await addOffers(bodyToSend)
    }

    return (
        <div>
            <div className="bg-gray-50 rounded-2xl">
                <div className="mb-8 p-4">
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
                <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
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
                                                    Save
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
