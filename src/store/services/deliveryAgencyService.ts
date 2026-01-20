/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { DeliveryAgency, DeliveryAgencyResponse } from '../types/deliveryAgencyTypes'

export const deliveryAgency = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getDeliveryAgency: builder.query<
            DeliveryAgencyResponse,
            { name?: string; is_active?: string; delivery_type?: string; id?: number; view_type?: string }
        >({
            query: (params) => {
                const parameters: Record<string, string | number | boolean> = {}
                if (params.name) parameters.name = params.name
                if (params.is_active) parameters.is_active = params.is_active
                if (params.delivery_type) parameters.delivery_type = params.delivery_type
                if (params.id) parameters.id = params.id
                if (params.view_type) parameters.view_type = params.view_type
                return {
                    url: `/delivery_partner`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        addDeliveryAgency: builder.mutation<{ status: string; data: DeliveryAgency }, { name?: string; delivery_type?: string }>({
            query: (params) => {
                return {
                    url: `/delivery_partner`,
                    method: 'POST',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        updateDeliveryAgency: builder.mutation<{ status: string; data: DeliveryAgency }, Record<string, string | number | boolean>>({
            query: (params) => {
                return {
                    url: `/delivery_partner/${params.id}`,
                    method: 'POST',
                    body: {
                        ...params,
                    },
                }
            },
        }),
    }),
})
