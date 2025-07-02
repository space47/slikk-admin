/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import axios from 'axios'

export const fetchProducts = async (page: number, pageSize: number, typeFetch: string, globalFilter: string, currentSelectedPage: any) => {
    try {
        const pageAndSize = `&p=${page}&page_size=${pageSize}`
        const trimmedFilter = globalFilter?.trim()
        const searchKey =
            ['sku', 'name', 'barcode'].includes(currentSelectedPage.value) && trimmedFilter
                ? `&${currentSelectedPage.value}=${encodeURIComponent(trimmedFilter)}`
                : ''

        const response = await axioisInstance.get(`merchant/products?dashboard=true${pageAndSize}&${typeFetch}${searchKey}`)
        return {
            data: response.data?.data?.results || [],
            total: response.data?.data?.count || 0,
        }
    } catch (error) {
        console.error('Error fetching data:', error)
        return { data: [], total: 0 }
    }
}

export const handleDownload = async (currentSelectedPage: any, globalFilter: string, typeFetch: string) => {
    try {
        const searchKey =
            ['sku', 'name', 'barcode'].includes(currentSelectedPage.value) && globalFilter
                ? `&${currentSelectedPage.value}=${encodeURIComponent(globalFilter)}`
                : ''
        const response = await axioisInstance.get(`merchant/products?download=true&${typeFetch}${searchKey}`)
        notification.success({
            message: response?.data?.message,
        })
    } catch (error: any) {
        notification.error({
            message: error?.response?.data?.message || 'Failed ti export',
        })
        console.error('Error downloading the file:', error)
    }
}

export const handleFacebookSync = async (setShowFacebookDialog: any) => {
    notification.info({
        message: 'SYNC IN PROCESS',
    })
    const body = {
        task_name: 'update_facebook_catalog_full',
    }
    setShowFacebookDialog(false)
    try {
        const response = await axioisInstance.post(`/backend/task/create`, body)
        notification.success({
            message: response?.data?.message || 'SYNCED TO FB',
        })
    } catch (error: any) {
        console.error(error)
        notification.error({
            message: error.response?.data?.message || 'FAILED TO SYNC TO FB',
        })
    }
}
export const handleRandomize = async (setShowRandomizeDialog: any) => {
    notification.info({
        message: 'SYNC IN PROCESS',
    })
    const body = {
        task_name: 'randomize_product_listing',
    }
    setShowRandomizeDialog(false)
    try {
        const response = await axioisInstance.post(`/backend/task/create`, body)
        notification.success({
            message: response?.data?.message || 'product is randomized',
        })
    } catch (error: any) {
        console.error(error)
        notification.error({
            message: error.response?.data?.message || 'FAILED TO ranodmize product',
        })
    }
}

export const handleGenerateSiteMap = async () => {
    notification.info({
        message: 'SiteMap generate in process',
    })
    try {
        const response = await axios.get('https://zgvm8zgvld.execute-api.ap-south-1.amazonaws.com/api/generate-sitemap')

        if (response.status === 200) {
            notification.success({
                message: response?.data?.message || 'Successfully Created sitemap',
            })
        } else {
            notification.error({
                message: 'Failed to Created sitemap',
            })
        }
    } catch (error) {
        console.error('Error generating site map:', error)
    }
}
