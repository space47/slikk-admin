/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { NotificationConfigData, NotificationConfigResponse, NotificationUpdateBody } from '../types/sellerTemplate.types'

export const notificationConfigService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getTemplateList: builder.query<
            NotificationConfigResponse,
            { page: number; pageSize: number; event_name: string; notification_type: string }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.event_name) parameters.event_name = params.event_name
                if (params.notification_type) parameters.notification_type = params.notification_type

                return {
                    url: `notifications/config`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        getSingleNotificationData: builder.query<{ status: string; message: NotificationConfigData }, { id: string | number }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.id) parameters.id = params.id
                return {
                    url: `notifications/config`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        addTemplate: builder.mutation<{ status: string; message: string }, NotificationUpdateBody>({
            query: (formData) => {
                return {
                    url: `/notifications/config`,
                    method: 'POST',
                    body: formData,
                }
            },
        }),
        updateTemplate: builder.mutation<{ status: string; message: string }, NotificationUpdateBody>({
            query: ({ id, ...rest }) => {
                return {
                    url: `/notifications/config/${id}`,
                    method: 'PATCH',
                    body: rest,
                }
            },
        }),
        getPdfTemplateList: builder.query<any, { page: number; pageSize: number; name: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.name) parameters.name = params.name

                return {
                    url: `/pdf-config`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        getSingleNotificationPdfData: builder.query<{ status: string; data: any }, { id: string | number }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.id) parameters.id = params.id
                return {
                    url: `/pdf-config`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        addPdfTemplate: builder.mutation<{ status: string; message: string }, Record<string, string | number | boolean>>({
            query: (formData) => {
                return {
                    url: `/pdf-config`,
                    method: 'POST',
                    body: formData,
                }
            },
        }),
        updatePdfTemplate: builder.mutation<{ status: string; message: string }, Record<string, string | number | boolean>>({
            query: ({ id, ...rest }) => {
                return {
                    url: `/pdf-config/${id}`,
                    method: 'PATCH',
                    body: rest,
                }
            },
        }),
    }),
})
