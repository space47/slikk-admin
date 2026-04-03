/* eslint-disable @typescript-eslint/no-explicit-any */
import { FrameSingleTemplate, FrameTemplate } from '../types/frameTemplateType'
import RtkQueryService from '@/services/RtkQueryService'

export const frameService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        frameList: builder.query<FrameTemplate[], { id?: string }>({
            query: () => {
                const parameters: Record<string, string | string[]> = {}

                return {
                    url: `/frame-style-templates`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        frameSingleData: builder.query<FrameSingleTemplate, { id?: string }>({
            query: (params) => {
                return {
                    url: `/frame-style-templates/${params.id}`,
                    method: 'GET',
                }
            },
        }),
    }),
})
