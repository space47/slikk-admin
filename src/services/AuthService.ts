import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    SignInTwoFactor,
    SignInTwoFactorResponse,
} from '@/@types/auth'

export async function apiSignInTwoFactor(data: SignInTwoFactor) {
    let dataObj = {data:data.mobileNumber,type:"MOBILE"};
    data = dataObj;
    // return ApiService.fetchData<SignInTwoFactorResponse>({
    //     url: '/login',
    //     method: 'post',
    //     data,
    // })
    return axioisInstance.post("/login",data);
}

export async function apiSignIn(data: SignInCredential) {
    // return ApiService.fetchData<SignInResponse>({
    //     url: '/verify',
    //     method: 'post',
    //     data,
    // })
    return axioisInstance.post("/verify",data);
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/sign-up',
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/sign-out',
        method: 'post',
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data: ResetPassword) {
    return ApiService.fetchData({
        url: '/reset-password',
        method: 'post',
        data,
    })
}
