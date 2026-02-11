/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { ShipmentResponse } from '../types/shipment.types'

export const shipmentService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getShipmentList: builder.query<ShipmentResponse, { shipment_id?: string; page?: number; pageSize?: number }>({
            query: (params) => {
                const parameters: Record<string, string | number | boolean> = {}
                if (params.shipment_id) parameters.shipment_id = params.shipment_id
                if (params.page) parameters.page = params.page
                if (params.pageSize) parameters.page_size = params.pageSize

                return {
                    url: `/product-shipment`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        getShipmentDetail: builder.query<ShipmentResponse, { id: number | string }>({
            query: (params) => {
                const parameters: Record<string, string | number | boolean> = {
                    view: 'detail',
                }
                if (params.id) parameters.id = params.id

                return {
                    url: `/product-shipment`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        // addDeliveryAgency: builder.mutation<{ status: string; data: DeliveryAgency }, { name?: string; delivery_type?: string }>({
        //     query: (params) => {
        //         return {
        //             url: `/delivery_partner`,
        //             method: 'POST',
        //             body: {
        //                 ...params,
        //             },
        //         }
        //     },
        // }),
        // updateDeliveryAgency: builder.mutation<{ status: string; data: DeliveryAgency }, Record<string, string | number | boolean>>({
        //     query: (params) => {
        //         return {
        //             url: `/delivery_partner/${params.id}`,
        //             method: 'POST',
        //             body: {
        //                 ...params,
        //             },
        //         }
        //     },
        // }),
    }),
})
