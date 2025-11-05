import React from 'react'
import { FormContainer, FormItem } from '../Form'
import Button, { ButtonProps } from './Button'
import Spinner from '../Spinner'

interface FormButtonProps extends ButtonProps {
    isSpinning?: boolean
    value?: string
}

const FormButton: React.FC<FormButtonProps> = ({ isSpinning, value, children, ...rest }) => {
    return (
        <FormContainer className="mt-5 flex justify-end">
            <FormItem>
                <Button {...rest} className={`flex gap-2 items-center ${rest.className || ''}`} variant="solid">
                    {isSpinning && <Spinner color="white" size={30} />}
                    {value || children}
                </Button>
            </FormItem>
        </FormContainer>
    )
}

export default FormButton
