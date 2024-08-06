import { createAction } from "@reduxjs/toolkit"

export interface SINGLE_DIVISION_DATA {
    id: number,
    name: string,
    image: string
    description: string
    title: string,
    footer: string,
    quick_filter_tags: string
    position: string
    seo_tags: string
    is_active: true,
    create_date: string
    update_date: string
    last_updated_by: string
}

export interface DIVISION_STATE {
    divisions : SINGLE_DIVISION_DATA[];
    loading : boolean;
    message : string;
}

export const getAllDivisionRequest = "getAllDivisionRequest";
export const getAllDivisionSuccess = createAction<DIVISION_STATE>("getAllDivisionSuccess");
export const getAllDivisionFailure = createAction<DIVISION_STATE>("getAllDivisionFailure");
