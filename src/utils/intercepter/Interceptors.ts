import store from '@/store'
import { notification } from 'antd'
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig<any>> => {
    const token = localStorage.getItem('accessToken')
    const storeCodes = store.getState().storeSelect.store_ids

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // if (config.url.includes("user/profile") || config.url.includes("/fileupload")) {
    //     config.headers["Content-Type"] = "multipart/form-data";
    // }

    const ifGetCall = config.method?.toLowerCase() === 'get'

    const excludedUrls = ['user/profile', 'merchant/store']

    if (storeCodes && storeCodes.length > 0 && ifGetCall) {
        if (!excludedUrls.some((url) => config.url?.includes(url))) {
            config.params = {
                ...(config.params || {}),
                store_id: storeCodes.join(','),
            }
        }
    }

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
        notification.error({
            message: 'You have no access to this resource.',
        })
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
