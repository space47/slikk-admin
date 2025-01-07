import { createAction } from '@reduxjs/toolkit'

type GroupType = {
    id: number
    user: {
        first_name: string
        last_name: string
        email: string | null
        mobile: string
    }[]
    group: {
        id: number
        name: string
    }[]
    name: string
    rules: Record<string, unknown>
    create_date: string
    update_date: string
}

export type GroupData = {
    group: GroupType[]
    loading: boolean
    message: string
}

export const getAllGroupRequest = 'getAllGroupRequest'
export const getAllGroupSuccess = createAction<GroupData>('getAllGroupSuccess')
export const getAllGroupFailure = createAction<GroupData>('getAllGroupFailure')
