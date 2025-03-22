import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Dispatch, SetStateAction } from 'react'
import { FormModel } from '../brandCommon'

export const fetchBrandData = async (
    setCateData: Dispatch<SetStateAction<FormModel | null>>,
    setImageView: Dispatch<SetStateAction<string[]>>,
    setLogoView: Dispatch<SetStateAction<string[]>>,
    id: string | undefined,
) => {
    try {
        const response = await axioisInstance.get(`brands?id=${id}&dashboard=true`)
        const categoryData = response.data?.data.results[0] || {}
        setCateData(categoryData)
        setImageView(categoryData.image ? [categoryData.image] : [])
        setLogoView(categoryData.logo ? [categoryData.logo] : [])
    } catch (error) {
        console.log(error)
    }
}
