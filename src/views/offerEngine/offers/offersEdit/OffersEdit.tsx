/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState, useRef } from 'react'
import OfferForms from '../offersUtils/OfferForms'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { OfferFormTypes } from '../../offerEngineCommon'
import { useOfferFunctions } from '../offersUtils/useOfferFunctions'
import { getChangedValues, hasChanges } from '@/common/objectDiff'
import OfferFormStep1 from '../offersUtils/OfferFormStep1'
import OfferFormStep2 from '../offersUtils/OfferFormStep2'

const OffersEdit = () => {
    const { id } = useParams()
    const [offersData, setOffersData] = useState<OfferFormTypes | null>(null)
    const [buyFilterId, setBuyFilterId] = useState<any>(undefined)
    const [getFilterId, setGetFilterId] = useState<any>(undefined)
    const [currentStep, setCurrentStep] = useState(0)
    const initialValuesRef = useRef<any>(null)

    const fetchOfferDetails = async () => {
        try {
            const response = await axios.get(`http://slikk-offer-lb-new-431979695.ap-south-1.elb.amazonaws.com/v1/offers/${id}`)
            setOffersData(response?.data?.body?.data)
        } catch (error) {
            console.error('Error fetching offer details:', error)
        }
    }

    useEffect(() => {
        fetchOfferDetails()
    }, [id])

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

        const changedValues = getChangedValues(values, initialValuesRef.current)
        if (!hasChanges(values, initialValuesRef.current)) {
            alert('No changes detected')
            return
        }

        try {
            const response = await axios.patch(
                `http://slikk-offer-lb-new-431979695.ap-south-1.elb.amazonaws.com/v1/offers/${id}`,
                changedValues,
            )
            console.log('Update successful:', response.data)
            initialValuesRef.current = { ...values }
            fetchOfferDetails()
        } catch (error) {
            console.error('Error updating offer:', error)
        }
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
                                        onClick={() => setCurrentStep((prev) => prev - 1)}
                                        className="mr-2 bg-gray-600"
                                    >
                                        Previous
                                    </Button>
                                )}
                                {currentStep === 0 && (
                                    <Button
                                        type="button"
                                        variant="accept"
                                        onClick={() => setCurrentStep((prev) => prev + 1)}
                                        className="mr-2 bg-gray-600"
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
                                            onClick={() => setCurrentStep((prev) => prev - 1)}
                                            className="mr-2 mt-5 bg-gray-600"
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
