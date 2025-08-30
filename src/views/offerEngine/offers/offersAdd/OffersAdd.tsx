import { Button, FormContainer, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import OfferFormStep1 from '../offersUtils/OfferFormStep1'
import OfferFormStep2 from '../offersUtils/OfferFormStep2'

const OffersAdd = () => {
    const [buyFilterId, setBuyFilterId] = useState<string | undefined>(undefined)
    const [getFilterId, setGetFilterId] = useState<string | undefined>(undefined)
    const [currentStep, setCurrentStep] = useState(0)
    const handleSubmit = async (values: any) => {
        console.log(values)
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

export default OffersAdd
