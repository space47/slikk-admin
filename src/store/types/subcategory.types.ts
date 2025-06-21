import { createAction } from '@reduxjs/toolkit'

export interface SINGLE_SUBCATEGORY_DATA {
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
    product_count: number | undefined
}

export interface SUBCATEGORY_STATE {
    subcategories: SINGLE_SUBCATEGORY_DATA[]
    loading: boolean
    message: string
}

export const getAllSubCategoryRequest = 'getAllSubCategoryRequest'
export const getAllSubCategorySuccess = createAction<SUBCATEGORY_STATE>('getAllSubCategorySuccess')
export const getAllSubCategoryFailure = createAction<SUBCATEGORY_STATE>('getAllSubCategoryFailure')
