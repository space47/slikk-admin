import { RootState } from '@/store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URI,
    prepareHeaders: (headers, api) => {
        const token = (api.getState() as RootState).auth.session.token
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
})

const customBaseQuery: typeof baseQuery = async (args, api, extraOptions) => {
    let modifiedArgs = typeof args === 'string' ? { url: args, method: 'GET' } : { ...args }
    const state = api.getState() as RootState
    const storeIds = state.storeSelect.store_ids
    const excludeUrls = [
        'indent',
        'logistic/riders',
        'rider/profile',
        'rider/cash/collection',
        'rtv',
        'picker/profile',
        'logistic-service-zones',
        'gdn_number',
        'goods/dispatch',
        'goods/received',
        'merchant/purchase/order',
        'merchant/purchase/orderitem',
        'merchant/purchase/bulkupload/orderitem',
        'goods/qualitycheck',
        'pdf-config',
    ]
    const method = (modifiedArgs.method || 'GET').toUpperCase()

    if (method === 'GET' && Array.isArray(storeIds) && storeIds.length > 0 && !excludeUrls.some((url) => modifiedArgs.url.includes(url))) {
        modifiedArgs = {
            ...modifiedArgs,
            params: {
                ...modifiedArgs.params,
                store_id: storeIds.join(','),
            },
        }
    }

    return baseQuery(modifiedArgs, api, extraOptions)
}

const RtkQueryService = createApi({
    reducerPath: 'rtkApi',
    keepUnusedDataFor: 0,
    baseQuery: customBaseQuery,
    endpoints: () => ({}),
})

export default RtkQueryService
