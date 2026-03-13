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
        console.log('hurray')
        dispatch({
            type: 'companyRequestSuccess',
            payload: { ...data },
        })

        const currentCompany = store.getState().company.currCompany
        console.log('curreent company', currentCompany)
        const isCompanyPresent = hasValidCompany(currentCompany)
        console.log('is there current company', isCompanyPresent)
        const companyList = data?.company || []

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
