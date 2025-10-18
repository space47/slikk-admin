/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from '@/store'
import useAuth from '@/utils/hooks/useAuth'
import { notification } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Timer = (props: any) => {
    const navigate = useNavigate()
    const { initialMinute = 0, initialSeconds = 0 } = props
    const [minutes, setMinutes] = useState(initialMinute)

    const [seconds, setSeconds] = useState(initialSeconds)
    const { userName } = useAppSelector((state) => state.auth.user)
    const { signInTwoFactor } = useAuth()
    const selector = useAppSelector((state) => state.authorization)

    const resendOTP = async () => {
        setSeconds(initialSeconds)
        console.log('data inside resend', userName)
        const curatedData = {
            mobileNumber: selector?.mobile,
            type: 'MOBILE',
        }
        try {
            await signInTwoFactor(curatedData)
            notification.success({ message: 'Otp has been resent' })
        } catch (error) {
            notification.error({ message: 'Failed to sent otp' })
        }
    }

    const reEnterMobile = () => {
        navigate(0)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1)
            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval)
                } else {
                    setSeconds(59)
                    setMinutes(minutes - 1)
                }
            }
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [seconds])
    return (
        <div className="flex flex-col items-center text-center mt-6">
            {seconds > 0 || minutes > 0 ? (
                <p className="text-gray-600 text-sm font-medium mb-2">
                    Time Remaining:&nbsp;
                    <span className="font-semibold text-gray-800">
                        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                </p>
            ) : (
                <p className="text-gray-700 text-sm font-medium mb-2">Didn’t receive the code?</p>
            )}

            <div className="flex gap-2">
                <button
                    disabled={seconds > 0 || minutes > 0}
                    onClick={resendOTP}
                    className={`mt-2 px-6 py-1 mb-5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        seconds > 0 || minutes > 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                    }`}
                >
                    Resend OTP
                </button>
                <button
                    type="button"
                    onClick={reEnterMobile}
                    className={`mt-2 px-6 py-1 mb-5 rounded-lg text-sm font-semibold transition-all duration-300 ${'bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg'}`}
                >
                    Retry Mobile Number
                </button>
            </div>
        </div>
    )
}

export default Timer
