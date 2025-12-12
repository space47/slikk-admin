// import { RootState } from '@/store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const OfferQueryService = createApi({
    reducerPath: 'offerApi',
    keepUnusedDataFor: 0,
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_OFFER_URI,
        // prepareHeaders: (headers, api) => {
        //     const token = (api.getState() as RootState).auth.session.token
        //     if (token) {
        //         headers.set('Authorization', `Bearer ${token}`)
        //     }

        //     return headers
        // },
    }),
    endpoints: () => ({}),
})

export default OfferQueryService
