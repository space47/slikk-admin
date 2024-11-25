import { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig<any>> => {
    const token = localStorage.getItem('accessToken')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // if (config.url.includes("user/profile") || config.url.includes("/fileupload")) {
    //     config.headers["Content-Type"] = "multipart/form-data";
    // }
    return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 403) {
        window.location.href = '/access-denied'
    }
    // else if (error.response?.status === 500) {
    //     window.location.href = '/internal-error'
    // }
    return Promise.reject(error)
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError)
    axiosInstance.interceptors.response.use(onResponse, onResponseError)
    return axiosInstance
}
