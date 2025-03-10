import { RootState } from '@/store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const RtkQueryService = createApi({
    reducerPath: 'rtkApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URI,
        prepareHeaders: (headers, api) => {
            const token = (api.getState() as RootState).auth.session.token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        },
    }),
    endpoints: () => ({}),
})

export default RtkQueryService
