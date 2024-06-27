// import {  getProfileRequest, getProfileSuccess, loginRequest, logoutFailure, logoutRequest, logoutSuccess, otpRequest, saveProfileRequest, } from "../types";
// //import { clearCookies } from "@/common/cookies";
// import axioisInstance from "@/utils/intercepter/globalInterceptorSetup";

// export const validatePhoneNumber = (mobileNumber : string) => async (dispatch : any) => {
//     try {
//         console.log(loginRequest);
//         dispatch({
//             type: loginRequest
//         });

//         console.log("Calling API");

//         const { data } : any = await axioisInstance.post("login", {
//             "type": "MOBILE",
//             "data": mobileNumber
//         }).then((res:any) => {
//             console.log(res);
//             return res;
//         });
        
//         dispatch({
//             type: "loginSuccess",
//             payload: {
//                 mobile : mobileNumber,
//                 referalCode:"",
//                 message: data.message,
//                 signup_done : data.signup_done
//             }
//         });
//     }
//     catch (error: any) {
//         dispatch({
//             type: "loginFailure",
//             payload: {
//                 mobileNumber,
//                 referalCode:"",
//                 message : error?.response?.data?.message
//             },
//         });
//     }
// }

// export const validateOTP = (mobileNumber : string, referalCode:string | null, otpCode : string, callBackfn:(e : boolean)=>void) => async (dispatch : any) => {
//     try {
//         dispatch({
//             type: otpRequest
//         });
//         const { data } : any = await axioisInstance.post(`verify`, {
//             type: 'MOBILE',
//             data: mobileNumber,
//             otp: otpCode,
//             referral_code: referalCode,
//         }).then((res) => {
//             console.log(res);
//             return res;
//         });

//         console.log(data.access, data.refresh);
//         const daysToExpire = new Date(2147483647 * 1000).toUTCString()
//         document.cookie = `accessToken=${data.access}; expires=${daysToExpire}`;

//         dispatch({
//             type: "otpSuccess",
//             payload: {
//                 mobileNumber,
//                 referalCode,
//                 message: data.message
//             }
//         });
//         callBackfn(true);
//     }
//     catch (error : any) {
//         console.log("Validate OTP Error", error?.response?.data);
//         dispatch({
//             type: "otpFailure",
//             payload: { message: error?.response?.data?.message }
//         });
//         callBackfn(false);
//     }
// }

// export const clearAuthState = async (dispatch:any) => {
//     try{
//         dispatch({
//             type : "clearAuth",
//         });
//     } catch(error : any){
//         console.log(error);
//     }
// }

// export const logoutAction = () => async (dispatch : any) => {
//     try{
//         dispatch({
//             type : "logoutRequest"
//         });

//         //clearCookies("accessToken");
//         //clearCookies("sessionToken");

//         dispatch({
//             type : "logoutSuccess"
//         });
//     } catch(error : any){
//         dispatch({
//             type : "logoutFailure"
//         });
//     }
// }

// export const getProfileData = () => async (dispatch : any) => {

//     //NOTE : Don't add server side call, get profile client side to prevent regressions.
//     //Create Route Guard and do getProfile there..
//     try {
//         dispatch({
//             type: getProfileRequest
//         });
//         const { data } : any = await clientSideAxios("GET", 'user/profile').then((res) => {return res;}).catch((err) => console.log(err));
//         console.log("GET PROFILE", data.data);
//         dispatch({
//             type: "getProfileSuccess",
//             payload: data.data
//         });
//     }
//     catch (error : any) {
//         dispatch({
//             type: "getProfileFailure",
//             payload: { message: error?.response?.data?.message}
//         });
//     }
// }


// export const saveProfileData = ({ firstName, lastName, email, gender, selectedImage, dob, callBackFunction } : any) => async (dispatch : any) => {
//     try {
//         dispatch({
//             type: saveProfileRequest
//         });
//         const formData = new FormData();
//         console.log("Form Values ", {
//             firstName,
//             lastName,
//             email,
//             gender,
//             selectedImage,
//             dob : dob.toISOString().split('T')[0]
//         });
//         formData.append('first_name', firstName);
//         formData.append('last_name', lastName);
//         formData.append('email', email);
//         formData.append('gender', gender);
//         formData.append('image', selectedImage);
//         formData.append('dob', dob.toISOString().split('T')[0]);

//         const { data } : any = await clientSideAxios("POST", "user/profile", formData, "file")
//         .then((res)=>{return  res});

//         dispatch({
//             type: "saveProfileSuccess",
//             payload: data.message
//         });
//         dispatch(getProfileData());
//         callBackFunction(true);
//     }
//     catch (error : any) {
//         console.log(error);
//         dispatch({
//             type: "saveProfileFailure",
//             payload: { 
//                 message: error?.response?.data?.message 
//             }
//         });
//         callBackFunction(false);
//     }
// }