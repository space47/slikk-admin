/* eslint-disable @typescript-eslint/no-explicit-any */

import { SINGLE_COMPANY_DATA, companyRequest } from '../types/company.types'
import axios from 'axios'
import store from '../storeSetup'

const hasValidCompany = (company: any): boolean => {
    if (!company) return false

    if (Array.isArray(company)) {
        return company.length > 0
    }

    if (typeof company === 'object') {
        return Object.keys(company).length > 0
    }

    if (typeof company === 'string') {
        return company.trim().length > 0
    }

    return false
}

export const getUserProfileAPI = () => async (dispatch: any) => {
    try {
        dispatch({ type: companyRequest })

        const response = await axios.get('dashboard/user/profile')
        const data = response?.data?.data

        dispatch({
            type: 'companyRequestSuccess',
            payload: { ...data },
        })

        const currentCompany = store.getState().company.currCompany

        const isCompanyPresent = hasValidCompany(currentCompany)
        const companyList = data?.company || []

        if (isCompanyPresent) {
            const findCurrentCompany = companyList?.find((item: Record<string, string | number>) => item.id === currentCompany.id)
            dispatch(setDefaultCompanyId(findCurrentCompany))
        }

        if (!isCompanyPresent) {
            dispatch(setDefaultCompanyId(companyList[0]))
        }
    } catch (err) {
        dispatch({
            type: 'companyRequestFailure',
        })
    }
}

export const setDefaultCompanyId = (company: SINGLE_COMPANY_DATA | undefined) => async (dispatch: any) => {
    dispatch({
        type: 'defaultCompanyRequest',
        payload: {
            currCompany: company,
        },
    })
}
