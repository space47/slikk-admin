/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { CreateAgencyRequest, CreateAgencyResponse, DeliveryAgencyResponse } from '../types/deliveryAgencyTypes'

export const deliveryAgency = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getDeliveryAgency: builder.query<
            DeliveryAgencyResponse,
            { name?: string; is_active?: string; page?: number; id?: number; page_size?: number }
        >({
            query: (params) => {
                const parameters: Record<string, string | number | boolean> = {}
                if (params.name) parameters.name = params.name
                if (params.is_active) parameters.is_active = params.is_active
                if (params.page_size) parameters.page_size = params.page_size
                if (params.id) parameters.id = params.id
                if (params.page) parameters.p = params.page
                return {
                    url: `/logistic/agency`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        getSingleAgency: builder.query<
            DeliveryAgencyResponse,
            { name?: string; is_active?: string; page?: number; id: number | string; page_size?: number }
        >({
            query: (params) => {
                const parameters: Record<string, string | number | boolean> = {}
                if (params.name) parameters.name = params.name
                if (params.is_active) parameters.is_active = params.is_active
                if (params.page_size) parameters.page_size = params.page_size
                if (params.id) parameters.agency_id = params.id
                if (params.page) parameters.p = params.page
                return {
                    url: `/logistic/agency`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        addDeliveryAgency: builder.mutation<CreateAgencyResponse, CreateAgencyRequest>({
            query: (params) => {
                return {
                    url: `/logistic/agency`,
                    method: 'POST',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        assignAgencyToRider: builder.mutation<{ status: string; message: string }, { rider_mobile: string; agency_id: string }>({
            query: (params) => {
                return {
                    url: `/logistic/rider/agency`,
                    method: 'POST',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        updateDeliveryAgency: builder.mutation<CreateAgencyResponse, Record<string, string | number | boolean>>({
            query: (params) => {
                return {
                    url: `/logistic/agency`,
                    method: 'PATCH',
                    body: {
                        ...params,
                    },
                }
            },
        }),
    }),
})
