import { createAction } from "@reduxjs/toolkit"

export interface SINGLE_BRAND_DATA {
    id: number;
    name: string;
    title: string;
    description: string;
    image: string;
    is_top: boolean;
    is_exclusive: boolean;
    is_private: boolean;
    footer: null;
    quick_filter_tags: string[];
    is_active: boolean;
    create_date: string;
    update_date: string;
    is_try_and_buy: boolean;
    last_updated_by: string;
}

export interface BRAND_STATE {
    brands : SINGLE_BRAND_DATA[];
    loading : boolean;
    message : string;
}

export const getAllBrandsRequest = "getAllBrandsRequest";
export const getAllBrandsSuccess = createAction<BRAND_STATE>("getAllBrandsSuccess");
export const getAllBrandsFailure = createAction<BRAND_STATE>("getAllBrandsFailure");
