import { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig<any>> => {
    
    const token = localStorage.getItem('accessToken');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // if (config.url.includes("user/profile") || config.url.includes("/fileupload")) {
    //     config.headers["Content-Type"] = "multipart/form-data";
    // }
    console.log("token", config.headers);
    return config;

}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    console.info(`[response] [${JSON.stringify(response)}]`);
    return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error1] [${JSON.stringify(error.message)}]`);
    console.error(`[response error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}