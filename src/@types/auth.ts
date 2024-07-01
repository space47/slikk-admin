export type SignInTwoFactor = {
    mobileNumber:string,
    type?:string
}

export type SignInTwoFactorResponse = { 
    message: string,
    signup_done: boolean
}

export type SignInCredential = {
    data: string | undefined,
    type?:string,
    otp:string
}

export type SignInResponse = {
    token: string,
    access:string,
    user: {
        userName: string
        authority: string[]
        avatar: string
        email: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}
