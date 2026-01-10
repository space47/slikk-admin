import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { SignInTwoFactor } from '@/@types/auth'
import SignIn from '../SignIn/SignIn'
import { useAppSelector } from '@/store'
import { FaWhatsapp } from 'react-icons/fa'
import { MdOutlineSms } from 'react-icons/md'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

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

    const selector = useAppSelector((state) => state.authorization)
    const { signInTwoFactor } = useAuth()

    const onSignIn = async (values: SignInTwoFactor) => {
        const { mobileNumber, channel } = values
        signInTwoFactor({ mobileNumber, channel })
    }

    return (
        <>
            {selector.phoneNumberValidated ? (
                <SignIn />
            ) : (
                <div className={className}>
                    <Formik
                        initialValues={{
                            mobileNumber: '',
                            channel: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            onSignIn(values)
                        }}
                    >
                        {({ touched, errors, setFieldValue, submitForm, values }) => (
                            <Form>
                                <FormContainer>
                                    <FormItem
                                        label="Mobile Number"
                                        invalid={!!(errors.mobileNumber && touched.mobileNumber)}
                                        errorMessage={errors.mobileNumber}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="mobileNumber"
                                            placeholder="Mobile Number"
                                            component={Input}
                                            className="rounded-xl"
                                        />
                                    </FormItem>

                                    <FormContainer className="flex gap-2 items-center">
                                        <Button
                                            block
                                            loading={selector.loading && values.channel === 'SMS'}
                                            variant="blue"
                                            type="button"
                                            className="bg-black"
                                            disabled={!!errors.mobileNumber}
                                            icon={<MdOutlineSms />}
                                            onClick={() => {
                                                setFieldValue('channel', 'SMS')
                                                submitForm()
                                            }}
                                        >
                                            {selector.loading && values.channel === 'SMS' ? 'Signing in...' : 'Send SMS'}
                                        </Button>
                                        <Button
                                            block
                                            loading={selector.loading && values.channel === 'WHATSAPP'}
                                            variant="accept"
                                            type="button"
                                            className="bg-black"
                                            disabled={!!errors.mobileNumber}
                                            icon={<FaWhatsapp />}
                                            onClick={() => {
                                                setFieldValue('channel', 'WHATSAPP')
                                                submitForm()
                                            }}
                                        >
                                            {selector.loading && values.channel === 'WHATSAPP' ? 'Signing in...' : 'WhatsApp'}
                                        </Button>
                                    </FormContainer>
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
