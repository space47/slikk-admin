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

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

const validationSchema = Yup.object().shape({
mobileNumber: Yup.string()
  .required("Mobile number is required")
  .matches(phoneRegExp, 'Enter 10 digit mobile number.')
  .min(10, "Enter 10 digit mobile number.")
  .max(10, "Enter 10 digit mobile number.")
})

const SignInForm = (props: SignInFormProps) => {
    const {
        className,
    } = props
    const [message, setMessage] = useTimeOutMessage()

    const { signInTwoFactor } = useAuth()

    const onSignIn = async (
        values: SignInTwoFactor,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { mobileNumber } = values
        setSubmitting(true)

        const result = await signInTwoFactor({ mobileNumber })

        if (result?.status === 'success') {
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    mobileNumber:''
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    //if (!disableSubmit) {
                        onSignIn(values, setSubmitting)
                   // } else {
                   //     setSubmitting(false)
                   // }
                }}
            >
                {({ touched, errors, isSubmitting ,isValid}) => (
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
                                    placeholder= "Mobile Number"
                                    component={Input}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                                disabled={Array.isArray(errors) || Object.values(errors).toString() != ""}
                            >
                                {isSubmitting ? 'Signing in...' : 'Send OTP'}
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
