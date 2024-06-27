// import { PayloadAction, createReducer } from "@reduxjs/toolkit";
// import { AuthState, ProfileState, getProfileFailure, getProfileRequest, getProfileSuccess, loginFailure, loginRequest, loginSuccess, logoutFailure, logoutRequest, logoutSuccess, otpFailure, otpRequest, otpSuccess, saveProfileFailure, saveProfileRequest, saveProfileSuccess } from "../types";

// const initialState: AuthState & ProfileState = {
//     referalCode: "",
//     loading: false,
//     phoneNumberValidated: false,
//     message: "",
//     dob: null,
//     email: "",
//     mobile: "",
//     photo: "",
//     date_joined: null,
//     gender: "",
//     last_name: "",
//     first_name: "",
//     signup_done : false
// }

// export const authReducer = createReducer(initialState, (builder) => {
//     builder.addCase(loginRequest, (state) => {
//         state = {
//             referalCode: "",
//             loading: true,
//             phoneNumberValidated: false,
//             message: "",
//             dob: null,
//             email: "",
//             mobile: "",
//             photo: "",
//             date_joined: null,
//             gender: "",
//             last_name: "",
//             first_name: "",
//             signup_done : false,
//         };
//     });
//     builder.addCase(loginSuccess, (state, action: PayloadAction<AuthState>) => {
//         state.loading = false;
//         state.mobile = action.payload.mobile;
//         state.referalCode = action.payload.referalCode;
//         state.phoneNumberValidated = true;
//         state.signup_done = action.payload.signup_done
        
//     });
//     builder.addCase(loginFailure, (state, action: any) => {
//         state.loading = false;
//         state.mobile = action.payload.mobile;
//         state.referalCode = action.payload.referalCode;
//         state.phoneNumberValidated = false;
//         state.message = action.payload.message;
//     });
//     builder.addCase("clearAuth", (state) => {
//         state.mobile = "";
//         state.referalCode = "";
//         state.loading = false;
//         state.phoneNumberValidated = false;
//         state.message = "";
//     });
//     builder.addCase(logoutRequest , (state) => {
//         state.loading = true;
//     });
//     builder.addCase(logoutSuccess, (state) => {
//         state.loading = false;
//         state = {
//             referalCode: "",
//             loading: true,
//             phoneNumberValidated: false,
//             message: "",
//             dob: null,
//             email: "",
//             mobile: "",
//             photo: "",
//             date_joined: null,
//             gender: "",
//             last_name: "",
//             first_name: "",
//             signup_done : false,
//         };
//         window.location.href = "/";
//     });
//     builder.addCase(logoutFailure, (state) => {
//         state.loading = true;
//     });
//     builder.addCase(otpRequest, (state) => {
//         state.loading = true;
//     });
//     builder.addCase(otpSuccess, (state, action: PayloadAction<AuthState>) => {
//         state.loading = false;
//         state.message = action.payload.message;

//     });
//     builder.addCase(otpFailure, (state, action: PayloadAction<AuthState>) => {
//         state.loading = false;
//         state.message = action.payload.message;

//     });
//     builder.addCase(getProfileRequest, (state) => {
//         state.loading = true;
//         state.photo = "";
//     });
//     builder.addCase(getProfileSuccess, (state, action: PayloadAction<ProfileState>) => {
//         state.loading = false;
//         state.mobile = action.payload.mobile;
//         state.date_joined = action.payload.date_joined;
//         state.dob = action.payload.dob;
//         state.email = action.payload.email;
//         state.first_name = action.payload.first_name;
//         state.last_name = action.payload.last_name;
//         state.gender = action.payload.gender;
//         state.photo = action.payload.photo;
//     });
//     builder.addCase(getProfileFailure, (state, action: PayloadAction<string>) => {
//         state.loading = false;
//         state.message = action.payload;
//     });
//     builder.addCase(saveProfileRequest, (state) => {
//         state.loading = true;
//     });
//     builder.addCase(saveProfileSuccess, (state, action: PayloadAction<string>) => {
//         state.loading = true;
//         state.message = action.payload;
//     });
//     builder.addCase(saveProfileFailure, (state, action: PayloadAction<any>) => {
//         state.loading = true;
//         state.message = action.payload.message;
//     });
// });