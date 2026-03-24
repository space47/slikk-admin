import RtkQueryService from '@/services/RtkQueryService'
import { MasterShipmentResponseType, Shipment } from '../types/masterShipment.types'

export const masterShipmentService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        masterShipmentList: builder.query<
            MasterShipmentResponseType,
            { page: number; page_size: number; company_code: string; shipment_id: string }
        >({
            query: (params) => {
                const parameters: Record<string, string | number> = {}
                if (params.page) parameters.p = params.page
                if (params.page_size) parameters.page_size = params.page_size
                if (params.company_code) parameters.company_code = params.company_code
                if (params.shipment_id) parameters.shipment_id = params.shipment_id
                return {
                    url: `/shipments/master`,
                    method: 'GET',
                }
            },
        }),
        masterShipmentDetails: builder.query<{ status: string; data: Shipment }, { id: string | number }>({
            query: (params) => {
                const parameters: Record<string, string | number> = {}
                return {
                    url: `/shipments/master/${params.id}`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
