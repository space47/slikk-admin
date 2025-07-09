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

export const productService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        productData: builder.query<ProductResponseType, productDataTypes>({
            query: (params) => {
                const parameters: Record<string, any> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.globalFilter && params.currentSelectedPage?.value) {
                    parameters[params.currentSelectedPage.value] = encodeURI(params.globalFilter?.trim())
                }

                return {
                    url: `/merchant/products?dashboard=true${params.typeFetch}`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
