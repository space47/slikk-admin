import { createAction } from '@reduxjs/toolkit'

export interface SINGLE_DIVISION_DATA {
    id: number
    name: string
    image: string
    description: string
    title: string
    footer: string
    count: number
    quick_filter_tags: string
    position: string
    seo_tags: string
    is_active: true
    create_date: string
    update_date: string
    last_updated_by: string
    product_count: number | undefined
    categories: {
        id: number
        name: string
        division: number
        division_name: string
        count: number
        image: string
        description: string
        title: string
        footer: string
        quick_filter_tags: string
        position: number
        seo_tags: null
        gender: null
        is_active: boolean
        create_date: string
        update_date: string
        is_try_and_buy: boolean
        last_updated_by: string
        product_count: number | undefined
        sub_categories: {
            id: number
            name: string
            count: number
            category: number
            category_name: string
            image: string
            description: string
            title: string
            footer: null
            quick_filter_tags: string
            position: number
            seo_tags: null
            gender: string
            is_active: boolean
            create_date: string
            update_date: string
            is_try_and_buy: boolean
            last_updated_by: null
            product_count: number | undefined
            product_types: {
                id: number
                name: string
                sub_category_name: string
                image: string
                count: number
                description: string
                title: string
                footer: null
                quick_filter_tags: string
                position: number
                seo_tags: null
                gender: string
                is_active: boolean
                create_date: string
                update_date: string
                is_try_and_buy: boolean
                sub_category: number
                last_updated_by: null
                product_count: number | undefined
            }[]
        }[]
    }[]
}

export interface DIVISION_STATE {
    divisions: SINGLE_DIVISION_DATA[]
    loading: boolean
    message: string
}

export const getAllDivisionRequest = 'getAllDivisionRequest'
export const getAllDivisionSuccess = createAction<DIVISION_STATE>('getAllDivisionSuccess')
export const getAllDivisionFailure = createAction<DIVISION_STATE>('getAllDivisionFailure')
