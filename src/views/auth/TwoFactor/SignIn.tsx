import withAuth from '@/utils/hoc/withAuth'
import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <SignInForm disableSubmit={true} />
        </>
    )
}

export default SignIn
