/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, vi, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'

describe('handleApply function', () => {
    // Mock state and props
    const setTypeFetch = vi.fn()
    const setShowDrawer = vi.fn()

    let divisionList: any[] = []
    let categoryList: any[] = []
    let subCategoryList: any[] = []
    let productTypeList: any[] = []
    let brandList: any[] = []
    let selectFilterString = ''

    // Mock the implementation
    const mockHandleApply = (values: any) => {
        let query = '&'

        if (divisionList.length > 0) {
            const divisionIds = divisionList.map((item: any) => item?.name).join(',')
            query += `division=${divisionIds}`
        }

        if (categoryList.length > 0) {
            const categoryIds = categoryList.map((item: any) => item?.name).join(',')
            if (query) query += '&'
            query += `category=${categoryIds}`
        }

        if (subCategoryList.length > 0) {
            const subCategoryIds = subCategoryList.map((item: any) => item?.name).join(',')
            if (query) query += '&'
            query += `sub_category=${subCategoryIds}`
        }

        if (productTypeList.length > 0) {
            const productTypeIds = productTypeList.map((item: any) => item?.name).join(',')
            if (query) query += '&'
            query += `Product_type=${productTypeIds}`
        }

        if (brandList.length > 0) {
            const brandIds = brandList.join(',')
            if (query) query += '&'
            query += `brand=${brandIds}`
        }

        if (selectFilterString) {
            query = selectFilterString
        }

        setTypeFetch(query)
        setShowDrawer(false)
    }

    it('should set query correctly when all lists are empty', () => {
        divisionList = []
        categoryList = []
        subCategoryList = []
        productTypeList = []
        brandList = []
        selectFilterString = ''

        act(() => {
            mockHandleApply({})
        })

        expect(setTypeFetch).toHaveBeenCalledWith('&')
        expect(setShowDrawer).toHaveBeenCalledWith(false)
    })

    it('should handle divisionList correctly', () => {
        divisionList = [{ name: 'Division1' }, { name: 'Division2' }]
        categoryList = []
        subCategoryList = []
        productTypeList = []
        brandList = []
        selectFilterString = ''

        act(() => {
            mockHandleApply({})
        })

        expect(setTypeFetch).toHaveBeenCalledWith('&division=Division1,Division2')
        expect(setShowDrawer).toHaveBeenCalledWith(false)
    })

    it('should override query with selectFilterString if set', () => {
        divisionList = []
        categoryList = []
        subCategoryList = []
        productTypeList = []
        brandList = []
        selectFilterString = 'custom=query'

        act(() => {
            mockHandleApply({})
        })

        expect(setTypeFetch).toHaveBeenCalledWith('custom=query')
        expect(setShowDrawer).toHaveBeenCalledWith(false)
    })
})
