import { Button, FormContainer } from '@/components/ui'
import React, { useState } from 'react'
import PoFormStepOne from './PoFormStepOne'
import PoFormStepTwo from './PoFormStepTwo'

interface Props {
    isEdit?: boolean
    purchase_id?: string | number
}

const PoForm = ({ isEdit, purchase_id }: Props) => {
    const [currentStep, setCurrentStep] = useState(0)

    return (
        <FormContainer>
            {currentStep === 0 && <PoFormStepOne />}
            {currentStep === 1 && <PoFormStepTwo isEdit={isEdit} purchase_id={purchase_id} />}
            <FormContainer className="flex justify-end mt-5 mb-9 ">
                {currentStep > 0 && (
                    <Button type="button" variant="pending" className="mr-2 bg-gray-600" onClick={() => setCurrentStep((prev) => prev - 1)}>
                        Previous
                    </Button>
                )}
                {currentStep < 1 && (
                    <Button type="button" variant="blue" onClick={() => setCurrentStep((prev) => prev + 1)}>
                        Next
                    </Button>
                )}
                {currentStep >= 1 && (
                    <Button type="submit" variant="blue">
                        Submit
                    </Button>
                )}
            </FormContainer>
        </FormContainer>
    )
}

export default PoForm
