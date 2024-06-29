import { PayloadAction, createReducer } from "@reduxjs/toolkit";
import { AuthState, getProfileFailure,   loginFailure, loginRequest, loginSuccess, logoutFailure, logoutRequest, logoutSuccess, otpFailure, otpRequest, otpSuccess, saveProfileFailure, saveProfileRequest, saveProfileSuccess } from "../../@types/types";

const initialState: AuthState = {
    mobile:"",
    loading: false,
    phoneNumberValidated: false,
    message: "",
    show_profile_page:false,
    signup_done : false
}

export const authReducer = createReducer(initialState, (builder) => {
    builder.addCase(loginRequest, (state) => {
        state = initialState;
        state.loading = true;
    });
    builder.addCase(loginSuccess, (state, action: PayloadAction<AuthState>) => {
        state.loading = false;
        state.mobile = action.payload.mobile;
        state.phoneNumberValidated = true;
        state.signup_done = action.payload.signup_done;
        state.message = action.payload.message
    });
    builder.addCase(loginFailure, (state, action: PayloadAction<AuthState>) => {
        state.loading = false;
        state.mobile = action.payload.mobile;
        state.phoneNumberValidated = false;
        state.signup_done = false;
        state.message = action.payload.message;
    });
    builder.addCase("clearAuth", (state) => {
        state.mobile = "";
        state.loading = false;
        state.phoneNumberValidated = false;
        state.message = "";
    });
    builder.addCase(logoutRequest , (state) => {
        state.loading = true;
    });
    builder.addCase(logoutSuccess, (state) => {
        state.loading = false;
        state = {
            loading: true,
            show_profile_page:false,
            mobile:"",
            phoneNumberValidated: false,
            message: "",
            signup_done : false
        };
        window.location.href = "/";
    });
    builder.addCase(logoutFailure, (state) => {
        state.loading = true;
    });
    builder.addCase(otpRequest, (state) => {
        state.loading = true;
    });
    builder.addCase(otpSuccess, (state, action: PayloadAction<AuthState>) => {
        state.loading = false;
        state.message = action.payload.message;

    });
    builder.addCase(otpFailure, (state, action: PayloadAction<AuthState>) => {
        state.loading = false;
        state.message = action.payload.message;

    });
   
    builder.addCase(getProfileFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.message = action.payload;
    });
    builder.addCase(saveProfileRequest, (state) => {
        state.loading = true;
    });
    builder.addCase(saveProfileSuccess, (state, action: PayloadAction<string>) => {
        state.loading = true;
        state.message = action.payload;
    });
    builder.addCase(saveProfileFailure, (state, action: PayloadAction<any>) => {
        state.loading = true;
        state.message = action.payload.message;
    });
});