import {  getProfileRequest, getProfileSuccess, loginRequest, logoutFailure, logoutRequest, logoutSuccess, otpRequest, saveProfileRequest, } from "../../@types/types";
import { clearCookies } from "@/common/cookies";
import axioisInstance from "@/utils/intercepter/globalInterceptorSetup";
import { setUser, signInSuccess } from "../slices/auth";
import { access } from "fs";

export const validatePhoneNumber = (mobileNumber : string) => async (dispatch : any) => {
    try {
        console.log(loginRequest);
        dispatch({
            type: loginRequest
        });

        console.log("Calling API");

        const { data } : any = await axioisInstance.post("login", {
            "type": "MOBILE",
            "data": mobileNumber
        })
        
        dispatch({
            type: "loginSuccess",
            payload: {
                mobile : mobileNumber,
                message: data.message,
                signup_done : data.show_profile_page
            }
        });
    }
    catch (error: any) {
        dispatch({
            type: "loginFailure",
            payload: {
                mobileNumber,
                message : error?.response?.data?.message
            },
        });
    }
}

export const validateOTP = (mobileNumber : string, otpCode : string, callBackfn:()=>void) => async (dispatch : any) => {
    try {
        dispatch({
            type: otpRequest
        });
        console.log("otpRequest")
        const { data } : any  = await axioisInstance.post(`verify`, {
            type: 'MOBILE',
            data: mobileNumber,
            otp: otpCode
        });
        
        localStorage.setItem("accessToken", data.access);

        dispatch({
            type: "otpSuccess",
            payload: {
                mobileNumber,
                message: data.message,
                access:data.access
            }
        });
        dispatch(signInSuccess(data.access))
        dispatch(
            setUser(
                data || {
                    avatar: '',
                    userName: 'Anonymous',
                    authority: ['USER'],
                    email: '',
                }
            )
        )
        callBackfn();
    }
    catch (error : any) {
        console.log("Validate OTP Error", error?.response?.data);
        dispatch({
            type: "otpFailure",
            payload: { message: error?.response?.data?.message }
        });
    }
}

export const clearAuthState = async (dispatch:any) => {
    try{
        dispatch({
            type : "clearAuth",
        });
    } catch(error : any){
        console.log(error);
    }
}

export const logoutAction = () => async (dispatch : any) => {
    try{
        dispatch({
            type : "logoutRequest"
        });

        localStorage.clear();

        dispatch({
            type : "logoutSuccess"
        });
    } catch(error : any){
        dispatch({
            type : "logoutFailure"
        });
    }
}

export const getProfileData = () => async (dispatch : any) => {

    //NOTE : Don't add server side call, get profile client side to prevent regressions.
    //Create Route Guard and do getProfile there..
    try {
        dispatch({
            type: getProfileRequest
        });
        const { data } : any = await axioisInstance.get('user/profile').then((res) => {return res;}).catch((err) => console.log(err));
        console.log("GET PROFILE", data.data);
        dispatch({
            type: "getProfileSuccess",
            payload: data.data
        });
    }
    catch (error : any) {
        dispatch({
            type: "getProfileFailure",
            payload: { message: error?.response?.data?.message}
        });
    }
}