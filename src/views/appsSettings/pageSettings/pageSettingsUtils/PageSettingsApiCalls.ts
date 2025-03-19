/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Dispatch, SetStateAction } from 'react'

export const fetchPageSettings = async (setPageNames: any, setCurrentSelectedPage: Dispatch<SetStateAction<Record<string, string>>>) => {
    try {
        const response = await axioisInstance.get(`/page?p=1&page_size=100`)
        const data = response?.data?.data
        const results = data?.results || []

        setPageNames(results)

        if (results.length > 0) {
            setCurrentSelectedPage({
                name: results[0]?.display_name,
                value: results[0]?.name,
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const fetchData = async (
    setShowSpinner: any,
    setData: any,
    setPreviousConfigs: any,
    setCurentConfigs: any,
    currentSelectedPage: any,
) => {
    try {
        setShowSpinner(true)
        if (!currentSelectedPage) return
        const response = await axioisInstance.get(`/page/config?page_name=${currentSelectedPage?.value}`)
        const responsedata = response.data?.data?.value?.Web || {}
        setData(Object.values(responsedata))
        setPreviousConfigs(response.data?.data?.previous_configs || [])
        setCurentConfigs(Object.values(responsedata))
    } catch (error) {
        console.error('Error fetching data:', error)
        setData([])
    } finally {
        setShowSpinner(false)
    }
}
