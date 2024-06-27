import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Welcome slikk!</h3>
                <p>Please enter your OTP to sign in!</p>
            </div>
            <SignInForm disableSubmit={true} />
        </>
    )
}

export default SignIn
