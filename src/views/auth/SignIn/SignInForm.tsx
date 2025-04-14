import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import Timer from './Timer'
import { useAppSelector } from '@/store'
import mockServer from '@/mock'
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
    const selector = useAppSelector((state) => state.authorization)
    const { signIn } = useAuth()

    const onSignIn = async (values: SignInFormSchema) => {
        const { otp } = values
        signIn({ otp, type: 'MOBILE', data: selector.mobile })
        if (selector?.signup_done) {
            setTimeout((): void => {
                const environment = process.env.NODE_ENV
                mockServer({ environment })
            }, 5000)
        }
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
                    otp: '',
                    data: '',
                    type: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onSignIn(values)
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem label="OTP" invalid={(errors.otp && touched.otp) as boolean} errorMessage={errors.otp}>
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="otp"
                                    placeholder="OTP"
                                    component={Input}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            const form = e.currentTarget.form
                                            if (form) {
                                                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                                            }
                                        }
                                    }}
                                />
                            </FormItem>

                            {/* <div className="flex justify-between mb-6">
                                <Field
                                    className="mb-0"
                                    name="rememberMe"
                                    component={Checkbox}
                                >
                                    Remember Me
                                </Field>
                                <ActionLink to={forgotPasswordUrl}>
                                    Forgot Password?
                                </ActionLink>
                            </div> */}
                            <Timer initialSeconds={20} />
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                                disabled={Array.isArray(errors) || Object.values(errors).toString() != ''}
                            >
                                {isSubmitting ? 'Signing in...' : 'Submit'}
                            </Button>
                            {/* <div className="mt-4 text-center">
                                <span>{`Don't have an account yet?`} </span>
                                <ActionLink to={signUpUrl}>Sign up</ActionLink>
                            </div> */}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
