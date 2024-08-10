import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { SignInTwoFactor } from '@/@types/auth'
import { useState } from 'react'
import SignIn from '../SignIn/SignIn'
import { useAppSelector } from '@/store'

const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

const validationSchema = Yup.object().shape({
    mobileNumber: Yup.string()
        .required('Mobile number is required')
        .matches(phoneRegExp, 'Enter 10 digit mobile number.')
        .min(10, 'Enter 10 digit mobile number.')
        .max(10, 'Enter 10 digit mobile number.'),
})

const SignInForm = (props: SignInFormProps) => {
    const { className } = props
    const [message, setMessage] = useTimeOutMessage()
    const [isAuth, setAuth] = useState(false)
    const selector = useAppSelector((state) => state.authorization)
    const { signInTwoFactor } = useAuth()

    const onSignIn = async (values: SignInTwoFactor) => {
        const { mobileNumber } = values
        signInTwoFactor({ mobileNumber })
    }

    return (
        <>
            {selector.phoneNumberValidated ? (
                <SignIn />
            ) : (
                <div className={className}>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <>{message}</>
                        </Alert>
                    )}
                    <Formik
                        initialValues={{
                            mobileNumber: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            onSignIn(values)
                        }}
                    >
                        {({
                            touched,
                            errors,
                            isSubmitting,
                            isValid,
                            isValidating,
                        }) => (
                            <Form>
                                <FormContainer>
                                    <FormItem
                                        label="Mobile Number"
                                        invalid={
                                            (errors.mobileNumber &&
                                                touched.mobileNumber) as boolean
                                        }
                                        errorMessage={errors.mobileNumber}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="mobileNumber"
                                            placeholder="Mobile Number"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <Button
                                        block
                                        loading={selector.loading}
                                        variant="new"
                                        type="submit"
                                        className="bg-black"
                                        //disabled={isValidating}
                                        disabled={
                                            Array.isArray(errors) ||
                                            Object.values(errors).toString() !=
                                                ''
                                        }
                                    >
                                        {selector.loading
                                            ? 'Signing in...'
                                            : 'Send OTP'}
                                    </Button>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </>
    )
}

export default SignInForm
