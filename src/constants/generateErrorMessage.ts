import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const getApiErrorMessage = (error: unknown): string => {
    const isFetchBaseQueryError = (err: unknown): err is FetchBaseQueryError => {
        return typeof err === 'object' && err !== null && 'status' in err
    }

    if (isFetchBaseQueryError(error)) {
        if (typeof error.status === 'string') {
            if (error.status === 'FETCH_ERROR') return 'Network Error — Please check your connection.'
            if (error.status === 'PARSING_ERROR') return 'Server returned invalid data format.'
            if (error.status === 'CUSTOM_ERROR') return 'An unexpected error occurred.'
        }
        if (typeof error.status === 'number') {
            if (error.status === 403) return 'Status: 403 — Permission Denied'
            if (error.status === 500) return 'Status: 500 — Server Error'

            const data = error.data as { message?: string }
            if (data?.message) return data.message
        }
    }

    return JSON.stringify(error)
}
