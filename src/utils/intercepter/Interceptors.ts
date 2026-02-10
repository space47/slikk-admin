import appConfig from '@/configs/app.config'
import store, { signOutSuccess } from '@/store'
import { notification } from 'antd'
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig<any>> => {
    const token = localStorage.getItem('accessToken')
    const storeCodes = store.getState().storeSelect.store_ids

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    const ifGetCall = config.method?.toLowerCase() === 'get'

    const excludedUrls = [
        'user/profile',
        'merchant/store',
        'goods/received/',
        'goods/dispatch',
        'indent',
        'inventory',
        'inventory-location',
        'merchant/orders?p=1&page_size=100&mobile=',
        'query/execute',
        'merchant/product/sku/sales',
        'picker/profile',
        'picker/profile?mobile',
    ]

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
    const status = error.response?.status
    const method = error.config?.method?.toLowerCase()
    const url = error.config?.url || ''

    const signInPath = appConfig.unAuthenticatedEntryPath
    const token = localStorage.getItem('accessToken')

    const restrictedPaths = ['https://api.olamaps.io/']
    const isAllowedUrl = !restrictedPaths.some((path) => url.includes(path))

    if (!isAllowedUrl) {
        return Promise.reject(error)
    }
    if (status === 401 && token) {
        localStorage.clear()
        sessionStorage.clear()
        store.dispatch(signOutSuccess())

        notification.error({
            message: 'Session expired',
            description: 'Your session has expired. Please login again.',
        })

        if (signInPath) {
            window.location.href = signInPath
        }

        return Promise.reject(error)
    }
    if (status === 403) {
        notification.error({
            message: 'You have no access to this resource.',
        })
    }

    if ((method === 'post' || method === 'patch') && error.response) {
        const message = (error.response.data as any)?.message || error.response.statusText || 'Something went wrong!'

        notification.error({ message })
    }

    return Promise.reject(error)
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError)
    axiosInstance.interceptors.response.use(onResponse, onResponseError)
    return axiosInstance
}
