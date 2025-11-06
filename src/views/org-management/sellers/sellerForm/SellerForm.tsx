/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Steps } from '@/components/ui'
import React, { useState } from 'react'
import { SellerSteps } from '../sellerCommon'
import SellerStepOne from './SellerStepOne'
import SellerBusinessDetails from './SellerBusinessDetails'
import SellerPocDetails from './SellerPocDetails'
import SellerBankDetails from './SellerBankDetails'
import SellerWarehouseDetails from './SellerWarehouseDetails'
import SellerMsme from './SellerMsme'
import SellerCommercials from './SellerCommercials'
import SellerInternal from './SellerInternal'
import SellerDocsAndDeclaration from './SellerDocsAndDeclaration'

interface props {
    values: any
}

const SellerForm = ({ values }: props) => {
    const [currentStep, setCurrentStep] = useState(0)
    return (
        <FormContainer className="flex xl:flex-row md:flex-row flex-col gap-4 xl:gap-6">
            <FormContainer className="shadow-xl rounded-xl xl:w-1/3 w-auto p-4">
                <Steps current={currentStep} className="flex flex-col items-start gap-5">
                    {SellerSteps.map((stepTitle, index) => (
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
                                    <span onClick={() => setCurrentStep(index)} className="cursor-pointer">
                                        {stepTitle}
                                    </span>
                                </span>
                            }
                        />
                    ))}
                </Steps>
            </FormContainer>
            <FormContainer className="shadow-xl p-4 rounded-xl  w-full">
                {currentStep === 0 && <SellerStepOne />}
                {currentStep === 1 && <SellerBusinessDetails isEdit={true} values={values} />}
                {currentStep === 2 && <SellerPocDetails />}
                {currentStep === 3 && <SellerBankDetails isEdit={true} values={values} />}
                {currentStep === 4 && <SellerWarehouseDetails isEdit={true} values={values} />}
                {currentStep === 5 && <SellerMsme isEdit={true} values={values} />}
                {currentStep === 6 && <SellerCommercials />}
                {currentStep === 7 && <SellerInternal />}
                {currentStep === 8 && <SellerDocsAndDeclaration isEdit={true} values={values} />}
                <FormContainer className="flex justify-end mt-5 mb-9 ">
                    {currentStep > 0 && (
                        <Button
                            type="button"
                            variant="pending"
                            className="mr-2 bg-gray-600"
                            onClick={() => setCurrentStep((prev) => prev - 1)}
                        >
                            Previous
                        </Button>
                    )}
                    {currentStep < 8 && (
                        <Button
                            type="button"
                            variant="accept"
                            className="mr-2 bg-gray-600"
                            onClick={() => setCurrentStep((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    )}
                    {currentStep >= 8 && (
                        <Button type="submit" variant="blue">
                            Submit
                        </Button>
                    )}
                </FormContainer>
            </FormContainer>
        </FormContainer>
    )
}

export default SellerForm
