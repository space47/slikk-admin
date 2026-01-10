import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import Timer from './Timer'
import { useAppSelector } from '@/store'
import mockServer from '@/mock'
import { useState } from 'react'
import { notification } from 'antd'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    otp: string
    type?: string
    data: string | undefined
}

const validationSchema = Yup.object().shape({
    otp: Yup.string()
        .required('required')
        .matches(phoneRegExp, 'Please enter valid OTP')
        .min(6, 'Please enter valid OTP')
        .max(6, 'Please enter valid OTP'),
})

const SignInForm = (props: SignInFormProps) => {
    const { disableSubmit = true, className, forgotPasswordUrl = '/forgot-password', signUpUrl = '/sign-up' } = props

    const [message, setMessage] = useTimeOutMessage()
    const [submitFailed, setSubmitFailed] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const selector = useAppSelector((state) => state.authorization)
    const { signIn } = useAuth()

    const onSignIn = async (values: SignInFormSchema) => {
        const { otp } = values

        setSubmitting(true)
        await signIn({ otp, type: 'MOBILE', data: selector.mobile }).then(() => {
            if (selector?.signup_done) {
                setTimeout((): void => {
                    const environment = process.env.NODE_ENV
                    mockServer({ environment })
                }, 5000)
            } else {
                setSubmitting(false)
                setSubmitFailed(true)
            }
        })
    }

    console.log('props is', props)

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    otp: '',
                    data: '',
                    type: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onSignIn(values)
                }}
            >
                {({ touched, errors }) => (
                    <Form>
                        <FormContainer>
                            <FormItem label="OTP" invalid={(errors.otp && touched.otp) as boolean} errorMessage={errors.otp}>
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="otp"
                                    placeholder="Enter Otp"
                                    component={Input}
                                    className="rounded-xl"
                                />
                            </FormItem>

                            <Timer initialSeconds={20} />
                            <Button block loading={submitting} variant="solid" type="submit">
                                {submitting ? 'Signing in' : 'Submit'}
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
