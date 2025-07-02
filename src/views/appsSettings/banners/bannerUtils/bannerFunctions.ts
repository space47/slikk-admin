import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

export const fetchForSectionHeading = async (currentSelectedPage: Record<string, string>) => {
    try {
        const response = await axioisInstance.get(`/banners?data_type=section_heading&page=${currentSelectedPage.value}`)
        const data = response.data.data
        return data
    } catch (error) {
        console.log(error)
    }
}
