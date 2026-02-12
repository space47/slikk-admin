import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import ApiService from './ApiService'

export async function apiGetSalesDashboardData<T extends Record<string, unknown>>() {
    return ApiService.fetchData<T>({
        url: '/sales/dashboard',
        method: 'post',
    })
}

export async function apiGetAllDivision() {
    return axioisInstance.get('/division?view=detail')
}

export async function apiGetAllCategory() {
    return axioisInstance.get('/category?view=detail')
}

export async function apiGetSalesProducts<T, U extends Record<string, unknown>>(data: U) {
    return axioisInstance.get('/division?view=detail&dashboard=true', data)
}

export async function apiDeleteSalesProducts<T, U extends Record<string, unknown>>(data: U) {
    // return ApiService.fetchData<T>({
    //     url: '/sales/products/delete',
    //     method: 'delete',
    //     data,
    // })
    return axioisInstance.delete('/division/delete', data)
}

export async function apiGetSalesProduct<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchData<T>({
        url: '/sales/product',
        method: 'get',
        params,
    })
}

export async function apiPutSalesProduct<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchData<T>({
        url: '/sales/products/update',
        method: 'put',
        data,
    })
}

export async function apiCreateCategory<T, U extends Record<string, unknown>>(data: U) {
    return axioisInstance.post('/category', data)
}

export async function apiCreateSalesProduct<T, U extends Record<string, unknown>>(data: U) {
    // return ApiService.fetchData<T>({
    //     url: '/sales/products/create',
    //     method: 'post',
    //     data,
    // })
    return axioisInstance.post('/division', data)
}

export async function apiGetSalesOrders<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchData<T>({
        url: '/sales/orders',
        method: 'get',
        params,
    })
}

export async function apiDeleteSalesOrders<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchData<T>({
        url: '/sales/orders/delete',
        method: 'delete',
        data,
    })
}

export async function apiGetSalesOrderDetails<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchData<T>({
        url: '/sales/orders-details',
        method: 'get',
        params,
    })
}
