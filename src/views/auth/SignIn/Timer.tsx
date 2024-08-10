import { useAppSelector } from '@/store';
import useAuth from '@/utils/hooks/useAuth';
import React from 'react'
import { useState, useEffect } from 'react';

const Timer = (props:any) => {
    const {initialMinute = 0,initialSeconds = 0} = props;
    const [ minutes, setMinutes ] = useState(initialMinute);
    const [seconds, setSeconds ] =  useState(initialSeconds);
    const { userName } = useAppSelector(
        (state) => state.auth.user
    )
    const { signInTwoFactor } = useAuth();
    const resendOTP = async()=>{
        setSeconds(initialSeconds);
        const result = await signInTwoFactor({ data:userName,type:"MOBILE" })
        if (result?.status === 'success') {
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
          if (seconds > 0) {
            setSeconds(seconds - 1);
          }
      
          if (seconds === 0) {
            if (minutes === 0) {
              clearInterval(interval);
            } else {
              setSeconds(59);
              setMinutes(minutes - 1);
            }
          }
        }, 1000);
      
        return () => {
          clearInterval(interval);
        };
      }, [seconds]);
    return (
        <div className="countdown-text">
        {seconds > 0 || minutes > 0 ? (
          <p>
            Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </p>
        ) : (
          <p>Didn't recieve code?</p>
        )}
  
        <button
          disabled={seconds > 0 || minutes > 0}
          style={{
            color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
          }}
          
          onClick={resendOTP}
        >
            Resend OTP
        </button>
        
      </div>
    )
}

export default Timer;