import store from '@/store'
import { notification } from 'antd'
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig<any>> => {
    const token = localStorage.getItem('accessToken')
    const storeCodes = store.getState().storeSelect.store_ids

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    const ifGetCall = config.method?.toLowerCase() === 'get'

    const excludedUrls = ['user/profile', 'merchant/store', 'goods/received/', 'indent', 'inventory-location']

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
    console.log('Error in request:', error)
    return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    const method = error.config?.method?.toLowerCase()
    console.log('Error in response:', method)

    const url = error.config?.url || ''
    console.log('Error URL:', url)

    const restrictedPaths = ['https://api.olamaps.io/']
    const excludeUrls = !restrictedPaths.some((path) => url.includes(path))

    if (excludeUrls) {
        if ((method === 'post' || method === 'patch') && error.response) {
            console.log('Error response:', error.response)
            const message = error.response.data?.message || error.response.statusText || 'Something went wrong!'

            notification.error({
                message,
            })
        } else if (error.response?.status === 403) {
            notification.error({
                message: 'You have no access to this resource.',
            })
        }
    }

    return Promise.reject(error)
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError)
    axiosInstance.interceptors.response.use(onResponse, onResponseError)
    return axiosInstance
}
