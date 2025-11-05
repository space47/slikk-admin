/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { ProductResponseType } from '../types/products.types'

interface productDataTypes {
    page?: number
    pageSize?: number
    globalFilter?: string
    typeFetch?: string
    currentSelectedPage: {
        label: string
        value: string
    }
}

interface productLockTypes {
    page?: number
    pageSize?: number
    globalFilter?: string
    id?: number
}

export const productService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        productData: builder.query<ProductResponseType, productDataTypes>({
            query: (params) => {
                const parameters: Record<string, any> = {
                    dashboard: true,
                }
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.globalFilter && params.currentSelectedPage?.value) {
                    // Remove encodeURI - the HTTP client will handle encoding
                    parameters[params.currentSelectedPage.value] = params.globalFilter?.trim()
                }

                return {
                    url: `/merchant/products?${params.typeFetch}`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        productLockData: builder.query<ProductResponseType, productLockTypes>({
            query: (params) => {
                const parameters: Record<string, any> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.globalFilter) {
                    parameters.name = encodeURI(params.globalFilter?.trim())
                }
                if (params.id) parameters.id = params.id

                return {
                    url: `/product/lock/update`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
