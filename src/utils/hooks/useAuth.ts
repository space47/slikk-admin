import { apiSignIn, apiSignInTwoFactor, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignInTwoFactor, SignUpCredential } from '@/@types/auth'
import mockServer from '@/mock'
import { validateOTP, validatePhoneNumber } from '@/store/action/authAction'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()
    const selector = useAppSelector(state => state.authorization)
    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)


    const signInTwoFactor = async (
        values: SignInTwoFactor
    ) => {
        dispatch(validatePhoneNumber(values.mobileNumber))
    }

    const navigateTo = () => {
        const redirectUrl = query.get(REDIRECT_URL_KEY)
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
    }

    const signIn = async (
        values: SignInCredential
    ) => {
        dispatch(validateOTP(selector.mobile, values.otp,navigateTo))
        //dispatch(signInSuccess(selector.))
        
    }

    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(signInSuccess(token))
                if (resp.data.user) {
                    dispatch(
                        setUser(
                            resp.data.user || {
                                avatar: '',
                                userName: 'Anonymous',
                                authority: ['USER'],
                                email: '',
                            }
                        )
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        //await apiSignOut()
        localStorage.clear();
        sessionStorage.clear();
        handleSignOut()
        navigate("/");

    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
        signInTwoFactor
    }
}

export default useAuth
