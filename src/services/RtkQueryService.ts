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
    let modifiedArgs = typeof args === 'string' ? { url: args } : { ...args }

    const state = api.getState() as RootState
    const storeIds = state.storeSelect.store_ids

    const excludeUrls = ['indent', 'logistic/riders']

    if (Array.isArray(storeIds) && storeIds.length > 0) {
        if (!excludeUrls?.some((urls) => modifiedArgs.url.includes(urls))) {
            modifiedArgs = {
                ...modifiedArgs,
                params: {
                    ...(modifiedArgs as any).params,
                    store_id: storeIds.join(','),
                },
            }
        }
    }

    // if (Array.isArray(storeIds) && storeIds.length > 0) {
    //     modifiedArgs = {
    //         ...modifiedArgs,
    //         params: {
    //             ...(modifiedArgs as any).params,
    //             store_id: storeIds.join(','),
    //         },
    //     }
    // }

    return baseQuery(modifiedArgs, api, extraOptions)
}

const RtkQueryService = createApi({
    reducerPath: 'rtkApi',
    keepUnusedDataFor: 0,
    baseQuery: customBaseQuery,
    endpoints: () => ({}),
})

export default RtkQueryService
