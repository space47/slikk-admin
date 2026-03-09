/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Steps } from '@/components/ui'
import React, { useState } from 'react'
import { SellerSteps, SellerStepsAdd } from '../sellerCommon'
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
    isSubmitting: boolean
    isAdd?: boolean
}

const SellerForm = ({ values, isSubmitting, isAdd }: props) => {
    const [currentStep, setCurrentStep] = useState(0)
    const StepsData = isAdd ? SellerStepsAdd : SellerSteps

    const addSteps = [
        (props: any) => <SellerBusinessDetails isEdit={true} {...props} />,
        () => <SellerPocDetails isAdd={isAdd} />,
        (props: any) => <SellerBankDetails isEdit={true} {...props} />,
        (props: any) => <SellerWarehouseDetails isEdit={true} {...props} />,
        (props: any) => <SellerMsme isEdit={true} {...props} />,
        (props: any) => <SellerDocsAndDeclaration isEdit={true} {...props} />,
    ]

    const editSteps = [
        () => <SellerStepOne />,
        (props: any) => <SellerBusinessDetails isEdit={true} {...props} />,
        () => <SellerPocDetails />,
        (props: any) => <SellerBankDetails isEdit={true} {...props} />,
        (props: any) => <SellerWarehouseDetails isEdit={true} {...props} />,
        (props: any) => <SellerMsme isEdit={true} {...props} />,
        () => <SellerCommercials values={values} />,
        () => <SellerInternal values={values} />,
        (props: any) => <SellerDocsAndDeclaration isEdit={true} {...props} />,
    ]

    const steps = isAdd ? addSteps : editSteps
    const maxStep = steps.length - 1

    return (
        <FormContainer className="flex xl:flex-row md:flex-row flex-col gap-4 xl:gap-6">
            <FormContainer className="shadow-xl rounded-xl xl:w-1/3 w-auto p-4">
                <Steps current={currentStep} className="flex flex-col items-start gap-5">
                    {StepsData.map((stepTitle, index) => (
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
                                    <span className="cursor-pointer" onClick={() => setCurrentStep(index)}>
                                        {stepTitle}
                                    </span>
                                </span>
                            }
                        />
                    ))}
                </Steps>
            </FormContainer>
            <FormContainer className="shadow-xl p-4 rounded-xl w-full">
                {steps[currentStep]({ values })}
                <FormContainer className="flex justify-end mt-5 mb-9">
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

                    {currentStep < maxStep && (
                        <Button
                            type="button"
                            variant="accept"
                            className="mr-2 bg-gray-600"
                            onClick={() => setCurrentStep((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    )}

                    {currentStep === maxStep && (
                        <Button type="submit" variant="blue" loading={isSubmitting} disabled={isSubmitting}>
                            Send To Vendor
                        </Button>
                    )}
                </FormContainer>
            </FormContainer>
        </FormContainer>
    )
}

export default SellerForm
