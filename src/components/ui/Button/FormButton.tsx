import React from 'react'
import { FormContainer, FormItem } from '../Form'
import Button from './Button'
import Spinner from '../Spinner'

interface FormButtonProps {
    isSpinning?: boolean
    value?: string
}

const FormButton = ({ isSpinning, value }: FormButtonProps) => {
    return (
        <FormContainer className="mt-5 flex justify-end">
            <FormItem className="">
                <Button type="submit" variant="solid" className="flex gap-2 items-center">
                    <span>{isSpinning && <Spinner color="white" size={30} />}</span> {value}
                </Button>
            </FormItem>
        </FormContainer>
    )
}

export default FormButton
