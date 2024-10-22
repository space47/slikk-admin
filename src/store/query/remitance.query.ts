/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface REMITANCETYPE {
    remitance: any[]
    count: number
    total_amount: number
}

interface ApiResponse {
    data: {
        data: {
            remitance: any[]
            count: number
            total_amount: number
        }
    }
}

export const remitanceApi = createApi({
    reducerPath: 'remitanceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/merchant/product',
    }),
    endpoints: (builder) => ({
        fetchRemitanceApi: builder.query<REMITANCETYPE, { page: number; pageSize: number; from: string; to: string; brandValue: any }>({
            query: ({ page, pageSize, from, to, brandValue }) => {
                return `/sales?brand=${brandValue.name}&from=${from}&to=${to}&page=${page}&pageSize=${pageSize}`
            },
            transformResponse: (response: ApiResponse) => {
                const data = response?.data?.data
                return {
                    remitance: data?.remitance || [],
                    count: data?.count || 0,
                    total_amount: data?.total_amount || 0,
                }
            },
        }),
    }),
})

export const { useFetchRemitanceApiQuery } = remitanceApi
