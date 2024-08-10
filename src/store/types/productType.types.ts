import { createAction } from "@reduxjs/toolkit";

export interface SINGLE_PRODUCTTYPE_DATA {
    id: number,
    name: string,
    sub_category_name: string,
    image: string,
    description: string,
    title: string,
    footer: null,
    quick_filter_tags: string,
    position: number,
    seo_tags: null,
    gender: string,
    is_active: boolean,
    create_date: string,
    update_date: string,
    is_try_and_buy: boolean,
    sub_category: number,
    last_updated_by: null
}

export interface PRODUCTTYPE_STATE {
    product_types : SINGLE_PRODUCTTYPE_DATA[];
    loading : boolean;
    message : string;
}

export const getAllProductTypeRequest = "getAllProductTypeRequest";
export const getAllProductTypeSuccess = createAction<PRODUCTTYPE_STATE>("getAllProductTypeSuccess");
export const getAllProductTypeFailure = createAction<PRODUCTTYPE_STATE>("getAllProductTypeFailure");
