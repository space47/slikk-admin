import { createAction } from '@reduxjs/toolkit'

export interface SINGLE_CATEGORY_DATA {
    id: number
    name: string
    division: number
    division_name: string
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
    sub_categories: {
        id: number
        name: string
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
    }[]
}

export interface CATEGORY_STATE {
    categories: SINGLE_CATEGORY_DATA[]
    loading: boolean
    message: string
}

export const getAllCategoryRequest = 'getAllCategoryRequest'
export const getAllCategorySuccess = createAction<CATEGORY_STATE>('getAllCategorySuccess')
export const getAllCategoryFailure = createAction<CATEGORY_STATE>('getAllCategoryFailure')
