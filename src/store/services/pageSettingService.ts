/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import {
    mainPageSettingsResponseTypes,
    pageNamesResponseType,
    pageSettingsResponseType,
    subPageResponseTypes,
} from '../types/pageSettings.types'

interface PageSettingsDataTypes {
    page?: number
    pageSize?: number
    sub_page?: number | string
    pageId?: number | string
    store_code?: number[]
    section_id?: number
    is_active?: string
    pageName?: string
    name?: string
}

export const pageSettingsService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        mainPageSettings: builder.query<mainPageSettingsResponseTypes, PageSettingsDataTypes>({
            query: (params) => {
                const parameters: Record<string, number | any> = {
                    dashboard: true,
                }
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.pageId) parameters.page = params.pageId
                if (params.sub_page) parameters.sub_page = params.sub_page
                if (params.store_code?.length && params.store_code?.length > 0) parameters.store = params.store_code
                if (params.is_active) parameters.is_active = params.is_active
                return {
                    url: `/page-sections`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        pageSettingsData: builder.query<pageSettingsResponseType, PageSettingsDataTypes>({
            query: (params) => {
                const parameters: Record<string, number | string[] | any> = {
                    dashboard: true,
                }
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.pageId) parameters.page = params.pageId
                if (params.sub_page) parameters.sub_page = params.sub_page
                if (params.section_id) parameters.section_id = params.section_id
                return {
                    url: `/section`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        pageNames: builder.query<pageNamesResponseType, PageSettingsDataTypes>({
            query: (params) => {
                const parameters: Record<string, number | any> = {
                    dashboard: true,
                }
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.pageId) parameters.page = params.pageId
                if (params.name) parameters.name = params.name
                return {
                    url: `/page`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        subPageNames: builder.query<subPageResponseTypes, PageSettingsDataTypes>({
            query: (params) => {
                const parameters: Record<string, number | any> = {
                    dashboard: true,
                }
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.sub_page) parameters.sub_page_id = params.sub_page
                if (params.pageId) parameters.page_id = params.pageId
                if (params.pageName) parameters.page = params.pageName

                return {
                    url: `/subpage`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
